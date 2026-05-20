import { createClient } from "@/lib/supabase/server"
import HomepageEditorClient from "./HomepageEditorClient"

export const metadata = { title: "Homepage Editor — Scooty Do Admin" }

export default async function HomepageEditorPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")

  const defaults: Record<string, string> = {}
  for (const row of data ?? []) {
    defaults[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value)
  }

  return <HomepageEditorClient defaults={defaults} />
}
