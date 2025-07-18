import { getAllProducts, getProductById } from "@/lib/queries/product";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const product = await getProductById(parseInt(id));
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(product);
  }

  const products = await getAllProducts();
  return Response.json(products || []);
}
