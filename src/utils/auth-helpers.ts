import { supabase } from "./supabase";
import { isUserLoggedIn, currentUser } from "../store/userStore";

export const oAuthLogin = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
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
};
