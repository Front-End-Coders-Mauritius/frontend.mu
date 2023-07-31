import { supabase } from "./supabase";

export const getUserProfile = async () => {
  const { data: profile, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.log(error);
    return null;
  }

  return profile[0];
};
