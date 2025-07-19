import { faker } from "@faker-js/faker";
import { createHash } from "@better-auth/utils/hash";
import { base64 } from "@better-auth/utils/base64";
import { prisma } from "@/lib/prisma";
import { UserRole, OrderType, ProductVisibility } from "@/generated/prisma";
import { readFileSync } from "fs";
import path from "path";

// Utility function used by all seeds
async function hashToBase64(data: string): Promise<string> {
  const buffer = await createHash("SHA-256").digest(
    new TextEncoder().encode(data)
  );
  return base64.encode(buffer);
}

// ==============================================
// SEED 1: SUPPLIERS
// ==============================================

const COMMON_PASSWORD = "Password@123";
const ALGERIAN_PHONE_PREFIX = "+213";
const NUMBER_OF_SUPPLIERS = 10;
const NUMBER_OF_BUYERS = 10;

async function createAddress() {
  return await prisma.address.create({
    data: {
      province: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.streetAddress(),
    },
  });
}

async function createUserWithCompany(role: UserRole) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({
    firstName,
    lastName,
    provider: `${role.toLowerCase()}.dz`,
  });
  const phoneNumber = `${ALGERIAN_PHONE_PREFIX}${faker.string.numeric(9)}`;
  const passwordHash = await hashToBase64(COMMON_PASSWORD);
  const address = await createAddress();

  const companyName = faker.company.name();
  const description = `Leading ${faker.commerce.department()} company.`;
  const logoUrl = faker.image.avatar();

  let user: Awaited<ReturnType<typeof prisma.user.create>> | undefined;
  let company: Awaited<ReturnType<typeof prisma.company.create>> | undefined;

  await prisma.$transaction(async (tx) => {
    // Step 1: Create the user without companyId
    user = await tx.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        passwordHash,
        role,
        phoneNumber,
        phoneNumberVerified: true,
        emailVerified: true,
        image: faker.image.avatar(),
      },
    });

    // Step 2: Create the company with ownerId = user.id
    company = await tx.company.create({
      data: {
        name: companyName,
        description,
        logoUrl,
        addressId: address.id,
        ownerId: user.id,
      },
    });

    // Step 3: Update the user to set companyId
    await tx.user.update({
      where: { id: user.id },
      data: { companyId: company.id },
    });
  });

  if (!user || !company) {
    console.log("error");
  }

  // Update company to assign ownerId
  await prisma.company.update({
    where: { id: company!.id },
    data: {
      ownerId: user!.id,
    },
  });

  return { user, company };
}

export async function seedSuppliersAndBuyers() {
  console.log("🌱 Seeding suppliers and buyers...");

  for (let i = 0; i < NUMBER_OF_SUPPLIERS; i++) {
    await createUserWithCompany(UserRole.SUPPLIER);
  }

  for (let i = 0; i < NUMBER_OF_BUYERS; i++) {
    await createUserWithCompany(UserRole.BUYER);
  }

  console.log("✅ Seeding completed.");
}

// ==============================================
// SEED 2: CATEGORIES
// ==============================================
async function seedCategories() {
  interface SubCategory {
    name: string;
    nameFrench: string | null;
    nameArabic: string | null;
    slug: string;
  }

  interface CategoryInput {
    name: string;
    nameFrench: string | null;
    nameArabic: string | null;
    slug: string;
    categories: SubCategory[];
  }

  console.log("Starting category seeding...");

  const filePath = path.join(__dirname, "categories.json");
  const categoriesData: CategoryInput[] = JSON.parse(
    readFileSync(filePath, "utf-8")
  );

  const results = await prisma.$transaction(async (tx) => {
    const createdCategories = [];

    for (const categoryData of categoriesData) {
      const mainCategory = await tx.category.create({
        data: {
          name: categoryData.name,
          nameFrench: categoryData.nameFrench || "",
          nameArabic: categoryData.nameArabic || "",
          slug: categoryData.slug,
        },
      });

      createdCategories.push(mainCategory);
      console.log(`✅ Created main category: ${mainCategory.name}`);

      if (categoryData.categories?.length > 0) {
        for (const subCategoryData of categoryData.categories) {
          const subCategory = await tx.category.create({
            data: {
              name: subCategoryData.name,
              nameFrench: subCategoryData.nameFrench || "",
              nameArabic: subCategoryData.nameArabic || "",
              slug: subCategoryData.slug,
              categories: { connect: { id: mainCategory.id } },
            },
          });
          createdCategories.push(subCategory);
          console.log(`   ↳ Created subcategory: ${subCategory.name}`);
        }
      }
    }
    return createdCategories;
  });

  console.log(`\n🎉 Successfully created ${results.length} categories`);
}

// ==============================================
// SEED 3: PRODUCTS
// ==============================================
async function seedProducts() {
  const data = JSON.parse(
    readFileSync(path.join(__dirname, "products.json"), "utf-8")
  );
  const slice = data.results.slice(0, 200);

  // Get all supplier companies
  const companies = await prisma.company.findMany({
    select: { id: true },
  });

  const companyIds = companies.map((c) => c.id);

  // Get all categories
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const toCreate: Array<{
    name: string;
    nameArabic: string | null;
    description: string | null;
    images: string[];
    categoryId: string;
    price: number;
    quantityAvailable: number;
    minOrderQuantity: number;
    visibility: ProductVisibility;
    isDeliveryAvailable: boolean;
    isSampleAvailable: boolean;
    samplePrice?: number;
    orderType: OrderType;
    numberOfPiecesPerBox?: number;
    rating: number;
    companyId: string;
  }> = [];

  companyIds.forEach((companyId, idx) => {
    const start = idx * 10;
    const chunk = slice.slice(start, start + 10);

    chunk.forEach((p: any) => {
      const category = categories.find(
        (c) => c.name === p.category_details.name
      );

      if (!category) {
        console.warn(
          `Skipping product ${p.id}: category "${p.category_details.name}" not found.`
        );
        return;
      }

      toCreate.push({
        name: p.title,
        nameArabic: p.category_details.name_ar ?? null,
        description: p.description,
        images: p.images.map((img: { image: string }) => img.image),
        categoryId: category.id,
        price: Math.round(p.price * 100),
        quantityAvailable: Math.floor(Math.random() * (5000 - 500 + 1)) + 500,
        minOrderQuantity: p.min_quantity,
        visibility: ProductVisibility.PUBLIC,
        isDeliveryAvailable: true,
        isSampleAvailable: p.ask_for_sample,
        samplePrice: p.sample_price
          ? Math.round(p.sample_price * 100)
          : undefined,
        orderType: p.order_type.toUpperCase() as OrderType,
        numberOfPiecesPerBox: p.pieces_per_box ?? undefined,
        rating: p.rating,
        companyId,
      });
    });
  });

  await prisma.product.createMany({
    data: toCreate,
    skipDuplicates: true,
  });

  console.log(`Created ${toCreate.length} products`);
}

seedProducts().catch((e) => {
  console.error("❌ Seed failed", e);
  process.exit(1);
});

// ==============================================
// MAIN EXECUTION
// ==============================================
async function main() {
  try {
    // await seedSuppliersAndBuyers();
    await seedProducts();
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
