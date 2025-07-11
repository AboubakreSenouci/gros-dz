import { notFound } from "next/navigation";

export default async function SupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/supplier/${params.id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const supplier = await res.json();

  if (!supplier) {
    return <p className="p-6 text-gray-500">Supplier not found.</p>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Supplier: {supplier.name}</h1>
      <p>Email: {supplier.email}</p>
      <p>Phone: {supplier.phone}</p>

      {supplier.products?.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mt-6">Products</h2>
          <ul className="space-y-2">
            {supplier.products.map((product: any) => (
              <li key={product.id} className="border p-2 rounded">
                {product.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-gray-500">
          No products listed by this supplier.
        </p>
      )}
    </main>
  );
}
