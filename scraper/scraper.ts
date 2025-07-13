import ollama from 'ollama'
import { TelegramClient } from './telegram.client';
import path from 'path';
import fs from 'fs';
// 1. base number (integer or decimal)
const NUM = '(\\d+(?:\\.\\d+)?)'

// 2. suffix groups
const SUFFIX_THOUSAND = '(?:alf|elf|[أا]لف|[أا]لف)'     // “alf”, “elf”, “ألف”, “الف”
const SUFFIX_K = '[kK]\\b'                    // “k” or “K”
const SUFFIX_CUR = '(?:DA|DZD|dinars?)\\b'      // “DA”, “DZD”, “dinar”, “dinars”

const PRICE_RE_FIRST = new RegExp(
  NUM + '\\s*(?:' +
  SUFFIX_THOUSAND + '|' +
  SUFFIX_K + '|' +
  SUFFIX_CUR +
  ')',
  'iu'  // note: no 'g'
)


function detect_algerian_prices(text: string) {
  const m = PRICE_RE_FIRST.exec(text)
  if (!m) return null

  const raw = m[0]
  let value = parseFloat(m[1])

  // normalize thousands
  if (/alf|elf|[أا]لف|[أا]لف/i.test(raw) || /[kK]\b/.test(raw)) {
    value *= 1_000
  }

  return { raw, value }
}


const describeProduct = async (images: string[], text: string) => {
  const response = await ollama.chat({
    model: "gemma3:4b",
    stream: false,
    messages: [
      {
        role: "user",
        images,
        content: `You are an e-commerce assistant. Given a product image and its accompanying text 
                  (e.g., from a e promotional post or catalog), extract structured product information 
                  in the following JSON format:
                  {
                    "name": "<short and clear product title>",
                    "description": "<brief but informative product description (materials, style, use, etc.)>",
                  }
                  Rules:
                    - Use the image to understand the product name and category, visual style, and key attributes.
                    - Do not add explanations or extra comments—only return valid JSON.
        `
      },
    ],
    format: {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
      },
      "required": ["name", "description"]
    },
  });

  const product_info = await JSON.parse(response.message.content);
  const price = detect_algerian_prices(text);
  if (price) {
    product_info['price'] = price.value;
  }
  return product_info;

}
// Define CSV headers explicitly, including price as optional

const HEADERS = [
  'name',
  'description',
  'price',           // optional
  'channel_title',
  'channel_username',
  'image_path'       // path to saved image
];


function saveDataToCsv(dataObj: Record<(typeof HEADERS)[number], any>, outputPath = 'data.csv', headers = HEADERS) {
  // Build header row
  const headerRow = headers.join(',') + '\n';

  // Map each header to its corresponding value or empty string
  const values = headers.map(key => {
    const value = dataObj[key] != null ? dataObj[key].toString() : '';
    // Escape double quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  });

  const csvContent = headerRow + values.join(',');

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write CSV file
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  console.log(`CSV file has been saved to ${outputPath}`);
}

function saveBase64Image(base64Data: string, outputDir: './assets', filename: string) {
  // Strip off data URI prefix if present
  const matches = base64Data.match(/^data:(.+);base64,(.*)$/);
  const rawBase64 = matches ? matches[2] : base64Data;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const imagePath = path.join(outputDir, filename);
  const buffer = Buffer.from(rawBase64, 'base64');
  fs.writeFileSync(imagePath, buffer);
  console.log(`Image saved to ${imagePath}`);
  return imagePath;
}

const run = async () => {
  const telegramClient = new TelegramClient();
  await telegramClient.init();

  const channelsIds = await telegramClient.getJoinedChannels();
  console.log('Channels: ', channelsIds);
  if (!channelsIds) {
    return;
  }
  const firstChannel = channelsIds[0];

  const messages = await telegramClient.fetchRecentMessages(firstChannel, { limit: 200 });
  if (!messages) {
    return;
  }

  let channelTitle = messages?.[0]?._chat?.title;
  let channelUser = messages?.[0]?._chat?.username;

  console.log("Channel: ", channelTitle);
  const filteredMessages = messages.filter(m => m.media && m.message).map(m => ({
    media: m.media,
    message: m.message,
    ...m,
  }));


  // const promises = filteredMessages.map(async (message) => {
  //
  //   const media = await telegramClient.downloadMedia(message);
  //   if (!media) {
  //     return;
  //   }
  //   const mediaBase64 = media.toString('base64');
  //   const product = await describeProduct([mediaBase64], message.message);
  //   product['channel_title'] = channelTitle;
  //   product['channel_username'] = channelUser;
  //
  //
  //   await telegramClient.init();
  //
  //   return product;
  //
  //
  // });
  //
  // const responses = await Promise.all(promises)
  // responses.forEach((product) => {
  //   console.log(JSON.stringify(product, null, 2));
  //
  // })
  //
  console.log('Messages to process: ', filteredMessages.length);
  for (const message of filteredMessages) {
    const media = await telegramClient.downloadMedia(message);
    if (!media) {
      return;
    }
    const mediaBase64 = media.toString('base64');
    const product = await describeProduct([mediaBase64], message.message);
    product['channel_title'] = channelTitle;
    product['channel_username'] = channelUser;

    const imagesDir = path.join(__dirname, 'images');
    const filename = `item_image_${Date.now()}.png`;

    // Save image and add path to data
    const savedImagePath = saveBase64Image(mediaBase64, "./assets", filename);
    product['image_path'] = savedImagePath;
    // Save CSV
    saveDataToCsv(product, './data.csv');

    console.log(JSON.stringify(product, null, 2));

    await telegramClient.init();

  }
  await telegramClient.disconnect();
};

run();
