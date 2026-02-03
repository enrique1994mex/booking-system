import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export function createSupabaseMiddlewareClient(req: Request, res: Response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.headers.get("cookie")?.split("; ").map((c) => {
            const [name, value] = c.split("=");
            return { name, value };
          }) ?? [];
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.headers.append(
              "Set-Cookie",
              `${name}=${value}; Path=/`
            );
          });
        },
      },
    }
  );
}