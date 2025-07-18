// import { faker } from "@faker-js/faker";
// import { createHash } from "@better-auth/utils/hash";
// import { base64 } from "@better-auth/utils/base64";
// import { prisma } from "@/lib/prisma";
// import { UserRole } from "@/generated/prisma";

// async function hashToBase64(data: string): Promise<string> {
//   const buffer = await createHash("SHA-256").digest(
//     new TextEncoder().encode(data)
//   );
//   return base64.encode(buffer);
// }

// const NUMBER_OF_SUPPLIERS = 10;
// const COMMON_PASSWORD = "Supplier@123";
// const ALGERIAN_PHONE_PREFIX = "+213";

// async function createSuppliers() {
//   const suppliers = [];

//   for (let i = 0; i < NUMBER_OF_SUPPLIERS; i++) {
//     const firstName = faker.person.firstName();
//     const lastName = faker.person.lastName();
//     const email = faker.internet.email({
//       firstName,
//       lastName,
//       provider: "supplier.dz",
//     });
//     const phoneNumber = `${ALGERIAN_PHONE_PREFIX}${faker.string.numeric(9)}`;
//     const passwordHash = await hashToBase64(COMMON_PASSWORD);

//     const supplierData = {
//       user: {
//         name: `${firstName} ${lastName}`,
//         email,
//         passwordHash,
//         role: UserRole.SUPPLIER,
//         emailVerified: true,
//         phoneNumber,
//         phoneNumberVerified: true,
//         image: faker.image.avatar(),
//       },
//       supplierProfile: {
//         companyName: faker.company.name(),
//         businessCategory: faker.commerce.department(),
//         address: `${faker.location.streetAddress()}, ${faker.location.city()}, Algeria`,
//         description: `Professional ${faker.commerce.department()} supplier with ${faker.number.int({ min: 2, max: 20 })} years of experience. ${faker.lorem.paragraph()}`,
//         logoUrl: faker.image.urlLoremFlickr({ category: "business" }),
//       },
//     };

//     suppliers.push(supplierData);
//   }

//   return suppliers;
// }

// async function insertSuppliers(suppliersData: any[]) {
//   const createdSuppliers = [];

//   for (const data of suppliersData) {
//     try {
//       const user = await prisma.user.create({
//         data: {
//           ...data.user,
//           supplierProfile: {
//             create: data.supplierProfile,
//           },
//         },
//         include: {
//           supplierProfile: true,
//         },
//       });
//       createdSuppliers.push(user);
//       console.log(`Created supplier: ${user.email}`);
//     } catch (error) {
//       console.error(`Error creating supplier:`, error);
//     }
//   }

//   return createdSuppliers;
// }

// async function main() {
//   console.log("Starting seed process...");

//   console.log("\nGenerating supplier data...");
//   const suppliersData = await createSuppliers();

//   console.log("\nSample supplier data:");
//   console.log(JSON.stringify(suppliersData[0], null, 2));

//   console.log("\nInserting suppliers into database...");
//   const createdSuppliers = await insertSuppliers(suppliersData);

//   console.log(`\nSuccessfully created ${createdSuppliers.length} suppliers`);
//   console.log(`All suppliers have password: ${COMMON_PASSWORD}`);
// }

// main()
//   .catch((e) => {
//     console.error("Seed error:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
