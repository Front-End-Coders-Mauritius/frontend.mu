import type { Provider } from '@supabase/supabase-js'
import { currentUser, isUserLoggedIn, userProfile } from '../store/userStore'
import { supabase } from './supabase'

export async function oAuthLogin(provider: Provider = 'google', path = window.location.pathname) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + path,
    },
  })

  if (error) {
    console.log(error)
  }

  console.log(data)
}

export async function oAuthLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error)
  }

  currentUser.set(null)
  isUserLoggedIn.set(false)
  userProfile.set(null)
}
