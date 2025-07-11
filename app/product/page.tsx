import Link from "next/link";

export default async function ProductListPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/product`, {
    cache: "no-store",
  });
  const products = await res.json();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <ul className="space-y-3">
        {products.map((product: any) => (
          <li key={product.id} className="border p-4 rounded">
            <Link
              href={`/products/${product.id}`}
              className="text-blue-600 font-medium"
            >
              {product.name}
            </Link>
            <p className="text-gray-600">Price: ${product.price}</p>
            <Link
              href={`/suppliers/${product.supplierId}`}
              className="text-sm text-gray-500 underline"
            >
              View Supplier
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
