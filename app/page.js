import { getProducts } from "@/lib/data";
import StoreClient from "@/components/StoreClient";

// Har request par fresh products (admin ke changes foran dikhein).
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  return <StoreClient initialProducts={products} />;
}
