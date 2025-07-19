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
  "recipient_type": "individual",
  to,
  'template': {
    'name': 'otp',
    'language': {
      'code': 'en_US'
    },
    'components': [{
      'type': 'body',
      'parameters': [
        { type: 'text', text: message }
      ]
    }]
  }
});


async function saveProductsToDB() {
  const url = 'https://graph.facebook.com/v22.0/693405723860387/messages';
  const token = 'EAASpcPkQFKsBPGvJRTFqRPadP8mVNScmXsPqaJL66jHuZBwoJB0ZC7f4WFcsEJJvZAbZAV0KIugjRRZB2PA5duLGCUUZBOd5erJa2MNO0osVsMaactZBujtDKv0ZAlejGnf7GP1zPvJZCL7xzWBWL2hEmy2X2tAA5olLwgjp5TJKWCRt4ciHCGTboTRVR4D7Ar4Co1P0HK21hGPsUxpqmvFqo5GRv6XNaoltVZBeo1z3WqqpF9tAZDZD';
  console.log(JSON.stringify(getWhatsappPayload("213659581898", "2306"), null, 2));
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(getWhatsappPayload("213659581898", "2306"))
    });
    console.log(JSON.stringify(response, null, 2));

  } catch (_error) {
    console.error(_error)
  }
}

async function main() {
  try {
    // You need to specify supplierId, e.g. from existing user in DB
    // const supplierId = 'your-existing-supplier-uuid'; 

    // const products = await fetchFakeProducts();
    // await saveProductsToDB();
    await prisma.$connect();

    const response = await authClient.signUp.email({
      email: 'lahmermohammed65@gmail.com',
      password: 'Gros123',
      name: 'Lahmer mohammed',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/009/178/125/small_2x/url-letter-logo-design-with-polygon-shape-url-polygon-and-cube-shape-logo-design-url-hexagon-logo-template-white-and-black-colors-url-monogram-business-and-real-estate-logo-vector.jpg'
    });

    console.log(response);

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
