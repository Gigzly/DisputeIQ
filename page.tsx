import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase'

export default async function Home() {
  // If coming from Shopify install flow, redirect to auth
  // Otherwise redirect to landing page or dashboard
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  // Redirect to static landing page
  redirect('https://disputeiq.co')
}
