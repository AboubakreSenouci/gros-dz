import { useEffect, useState } from "react";
import { sampleProducts } from "@/constants/product";

export function useProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.BASE_URL}/api/product`, {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : sampleProducts);
      } catch {
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading };
}
