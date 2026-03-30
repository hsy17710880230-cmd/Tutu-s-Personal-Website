import { supabase, User } from "@/src/lib/supabase";

export const ADMINS = ["hongleigu19@gmail.com", "hsy17710880230@163.com"];

export interface FileItem {
  name: string;
  path: string;
}

export async function requireAdmin(token?: string): Promise<User> {
  if (!token) throw new Error("Unauthorized");

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user || !ADMINS.includes(user.email ?? "")) {
    throw new Error("Unauthorized");
  }

  return user;
}
