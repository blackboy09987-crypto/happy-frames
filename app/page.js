import { getProducts, getSettings } from "@/lib/data";
import StoreClient from "@/components/StoreClient";

// Har request par fresh products (admin ke changes foran dikhein).
export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  return <StoreClient initialProducts={products} initialSettings={settings} />;
}
