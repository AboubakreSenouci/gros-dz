import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterAndSortProducts({
  products,
  search,
  category,
  price,
  sort_option,
}: {
  products: any[];
  search: string;
  category: string;
  price: {
    from: number;
    to: number;
  };
  sort_option: string;
}) {
  return products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = category ? product.category === category : true;

      const matchesPrice =
        product.price >= price.from && product.price <= price.to;

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sort_option === "price_asc") return a.price - b.price;
      if (sort_option === "price_desc") return b.price - a.price;
      if (sort_option === "name_asc")
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      if (sort_option === "name_desc")
        return b.name.localeCompare(a.name, undefined, {
          sensitivity: "base",
        });
      return 0;
    });
}
