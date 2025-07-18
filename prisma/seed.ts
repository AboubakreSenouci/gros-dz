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
async function seedSuppliers() {
  const NUMBER_OF_SUPPLIERS = 10;
  const COMMON_PASSWORD = "Supplier@123";
  const ALGERIAN_PHONE_PREFIX = "+213";

  async function createSuppliersData() {
    const suppliers = [];
    for (let i = 0; i < NUMBER_OF_SUPPLIERS; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({
        firstName,
        lastName,
        provider: "supplier.dz",
      });
      const phoneNumber = `${ALGERIAN_PHONE_PREFIX}${faker.string.numeric(9)}`;
      const passwordHash = await hashToBase64(COMMON_PASSWORD);

      suppliers.push({
        user: {
          name: `${firstName} ${lastName}`,
          email,
          passwordHash,
          role: UserRole.SUPPLIER,
          emailVerified: true,
          phoneNumber,
          phoneNumberVerified: true,
          image: faker.image.avatar(),
        },
        supplierProfile: {
          companyName: faker.company.name(),
          businessCategory: faker.commerce.department(),
          address: `${faker.location.streetAddress()}, ${faker.location.city()}, Algeria`,
          description: `Professional ${faker.commerce.department()} supplier with ${faker.number.int({ min: 2, max: 20 })} years of experience. ${faker.lorem.paragraph()}`,
          logoUrl: faker.image.urlLoremFlickr({ category: "business" }),
        },
      });
    }
    return suppliers;
  }

  console.log("Starting supplier seed...");
  const suppliersData = await createSuppliersData();

  console.log("\nSample supplier data:");
  console.log(JSON.stringify(suppliersData[0], null, 2));

  for (const data of suppliersData) {
    try {
      const user = await prisma.user.create({
        data: {
          ...data.user,
          supplierProfile: {
            create: data.supplierProfile,
          },
        },
        include: {
          supplierProfile: true,
        },
      });
      console.log(`Created supplier: ${user.email}`);
    } catch (error) {
      console.error(`Error creating supplier:`, error);
    }
  }
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
  const Data = JSON.parse(
    readFileSync(path.join(__dirname, "products.json"), "utf-8")
  );
  const slice = Data.results.slice(0, 200);

  const suppliers = await prisma.supplierProfile.findMany({
    select: { id: true },
  });
  const supplierIds = suppliers.map((s) => s.id);

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const toCreate = [] as Array<{
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
    supplierId: string;
  }>;

  supplierIds.forEach((supplierId, idx) => {
    const start = idx * 10;
    const chunk = slice.slice(start, start + 10);

    interface ProductImage {
      image: string;
    }

    interface CategoryDetails {
      name: string;
      name_ar: string | null;
    }

    interface ProductChunkItem {
      id: string;
      title: string;
      category_details: CategoryDetails;
      description: string | null;
      images: ProductImage[];
      price: number;
      min_quantity: number;
      ask_for_sample: boolean;
      sample_price?: number;
      order_type: string;
      pieces_per_box?: number;
      rating: number;
    }

    chunk.forEach((p: ProductChunkItem) => {
      const categoryName: string = p.category_details.name;
      const category = categories.find((c) => c.name === categoryName);

      if (!category) {
      console.warn(
        `Skipping product ${p.id}: category "${categoryName}" not found.`
      );
      return;
      }

      toCreate.push({
      name: p.title,
      nameArabic: p.category_details.name_ar,
      description: p.description,
      images: p.images.map((img: ProductImage) => img.image),
      categoryId: category.id,
      price: p.price * 100,
      quantityAvailable: Math.floor(Math.random() * (5000 - 500 + 1)) + 500,
      minOrderQuantity: p.min_quantity,
      visibility: ProductVisibility.PUBLIC,
      isDeliveryAvailable: true,
      isSampleAvailable: p.ask_for_sample,
      samplePrice: p.sample_price ? p.sample_price * 100 : undefined,
      orderType: p.order_type.toUpperCase() as OrderType,
      numberOfPiecesPerBox: p.pieces_per_box ?? undefined,
      rating: p.rating,
      supplierId: supplierId,
      });
    });
  });

  await prisma.product.createMany({ data: toCreate, skipDuplicates: true });
  console.log(`Created ${toCreate.length} products`);
}

// ==============================================
// MAIN EXECUTION
// ==============================================
async function main() {
  try {
    await seedSuppliers();
    await seedCategories();
    await seedProducts();
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
