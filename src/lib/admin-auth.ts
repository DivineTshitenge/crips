import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/admin-token";

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE_NAME)?.value);
}
