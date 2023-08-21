import { supabase } from "./supabase";
import { isUserLoggedIn, currentUser, userProfile } from "../store/userStore";
import { Provider } from "@supabase/supabase-js";

export const oAuthLogin = async (provider: Provider = 'google', path = window.location.pathname) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + path,
    },
  });

  if (error) {
    console.log(error);
  }

  console.log(data);
};

export const oAuthLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }

  currentUser.set(null);
  isUserLoggedIn.set(false);
  userProfile.set(null);
};
