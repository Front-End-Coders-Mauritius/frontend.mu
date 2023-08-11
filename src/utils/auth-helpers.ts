import { supabase } from "./supabase";
import { isUserLoggedIn, currentUser, userProfile } from "../store/userStore";

export const oAuthLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + window.location.pathname,
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
