const { PrismaClient } = require("../generated/prisma");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const prisma = new PrismaClient();

type ProductCSVRow = {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  price: string;
  quantityAvailable: string;
  supplierEmail: string;
};

async function main() {
  const filePath = path.join(__dirname, "products.csv");

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const csvData = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ProductCSVRow[];

  const supplierEmails = [...new Set(csvData.map((row) => row.supplierEmail))];

  const suppliers = await Promise.all(
    supplierEmails.map((email) =>
      prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          passwordHash: "hashed-password",
          role: "supplier",
        },
      })
    )
  );

  const supplierMap = new Map(suppliers.map((s) => [s.email, s.id]));

  for (const product of csvData) {
    await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        price: parseInt(product.price),
        quantityAvailable: parseInt(product.quantityAvailable),
        supplierId: supplierMap.get(product.supplierEmail)!,
      },
    });
  }

  console.log("✅ Seeded products from CSV successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
