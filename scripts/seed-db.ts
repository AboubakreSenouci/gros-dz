import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";


interface FakeProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

async function fetchFakeProducts(): Promise<FakeProduct[]> {
  const response = await fetch('https://fakestoreapi.com/products');
  if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
  return response.json();
}

const WHATSAPP_API = 'https://graph.facebook.com/v22.0/693405723860387/messages';
const getWhatsappPayload = (to: string, message: string) => ({
    'message_product': 'whatsapp',
    'type': 'template',
    to,
    'template': {
        'name': message,
        'language': {
            'code': 'en_US'
        }
    }
});


async function saveProductsToDB() {
//    await prisma.$connect();
//    const client = await authClient.phoneNumber.sendOtp({
//     phoneNumber: '213696872939',
//    })
//   for (const p of products) {
//     // Transform data to fit your schema
//     await prisma.product.upsert({
//       where: { id: p.id.toString() },
//       update: {
//         name: p.title,
//         description: p.description,
//         category: p.category,
//         price: Math.round(p.price), // your schema uses Int price
//         imageUrls: [p.image],
//         quantityAvailable: 100, // default quantity, adjust as needed
//         updatedAt: new Date(),
//       },
//       create: {
//         id: p.id.toString(),
//         name: p.title,
//         description: p.description,
//         category: p.category,
//         price: Math.rou  nd(p.price),
//         imageUrls: [p.image],
//         quantityAvailable: 100,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         supplierId,
//       }
//     });
//   }

  const url = 'https://graph.facebook.com/v22.0/693405723860387/messages';
  const token = 'EAASpcPkQFKsBPGvJRTFqRPadP8mVNScmXsPqaJL66jHuZBwoJB0ZC7f4WFcsEJJvZAbZAV0KIugjRRZB2PA5duLGCUUZBOd5erJa2MNO0osVsMaactZBujtDKv0ZAlejGnf7GP1zPvJZCL7xzWBWL2hEmy2X2tAA5olLwgjp5TJKWCRt4ciHCGTboTRVR4D7Ar4Co1P0HK21hGPsUxpqmvFqo5GRv6XNaoltVZBeo1z3WqqpF9tAZDZD';

  const body = {
    messaging_product: "whatsapp",
    to: "213696872939",
    type: "template",
    template: {
      name: "otp",
      language: {
        code: "en_US"
      },
      components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: "3443",
                },
              ],
            },
          ],
    }
  };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  console.log(JSON.stringify(response, null, 2));
}

async function main() {
  try {
    // You need to specify supplierId, e.g. from existing user in DB
    // const supplierId = 'your-existing-supplier-uuid'; 

    // const products = await fetchFakeProducts();
    await saveProductsToDB();
  } catch (error) {
    console.error(error);
  } finally {
    // await prisma.$disconnect();
  }
}

main();
