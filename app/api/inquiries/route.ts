import { getAllProducts, getProductById } from "@/lib/queries/product";

export async function GET(request: Request) {
  const products = await getAllProducts();
  return Response.json(products || []);
}

export async function GETProductById(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get("id") || "0", 10);

  if (isNaN(id)) {
    return Response.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await getProductById(id);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
