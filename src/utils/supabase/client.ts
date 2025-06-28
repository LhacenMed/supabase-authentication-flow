import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient as createNewClient } from "@supabase/supabase-js";

export const createClient = () => createClientComponentClient();

export const createAdminClient = () =>
  createNewClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );
