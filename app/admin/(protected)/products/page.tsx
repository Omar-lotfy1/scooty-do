import { createClient } from "@/lib/supabase/server"
import ProductsClient from "./ProductsClient"

export const metadata = { title: "Products — Scooty Do Admin" }

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return <ProductsClient initialProducts={data ?? []} />
}
