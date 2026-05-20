import { createClient } from "@/lib/supabase/server"
import ContactEditorClient from "./ContactEditorClient"

export const metadata = { title: "Contact Page Editor — Scooty Do Admin" }

export default async function ContactEditorPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", [
      "contact_title_en",
      "contact_title_ar",
      "contact_subtitle_en",
      "contact_subtitle_ar",
      "contact_info_cards",
      "contact_hubs",
      "contact_faqs"
    ])

  const defaults: Record<string, any> = {}
  for (const row of data ?? []) {
    // We try to parse the JSON if it's a string, otherwise if it's already an object/array, we keep it.
    // For simple strings (like title), we'll keep them as strings.
    if (["contact_info_cards", "contact_hubs", "contact_faqs"].includes(row.key)) {
      defaults[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    } else {
      defaults[row.key] = typeof row.value === 'string' ? row.value : String(row.value);
    }
  }

  return <ContactEditorClient defaults={defaults} />
}
