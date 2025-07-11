import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.BASE_URL}/api/product?id=${params.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <p className="mt-2 font-semibold">Price: ${product.price}</p>
      <Link
        href={`/suppliers/${product.supplierId}`}
        className="mt-4 inline-block text-blue-600 underline"
      >
        Contact Supplier
      </Link>
    </main>
  );
}
