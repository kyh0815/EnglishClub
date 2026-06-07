import { createClient } from "@supabase/supabase-js";
import { landingContent, TEAM_CAPACITY } from "@/lib/content";

type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          availability: string | null;
          contact: string;
          created_at: string;
          id: string;
          level: string;
          motivation: string | null;
          name: string;
          source: string | null;
          status: string;
        };
        Insert: {
          availability?: string | null;
          contact: string;
          created_at?: string;
          id?: string;
          level: string;
          motivation?: string | null;
          name: string;
          source?: string | null;
          status?: string;
        };
        Update: {
          availability?: string | null;
          contact?: string;
          created_at?: string;
          id?: string;
          level?: string;
          motivation?: string | null;
          name?: string;
          source?: string | null;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type SupabaseServerClient = ReturnType<typeof createClient<Database>>;

export type TeamApplicationStatus = {
  capacity: number;
  count: number | null;
  isClosed: boolean;
  level: string;
  status: "모집 중" | "모집 마감";
};

export function createServerSupabaseClient(): SupabaseServerClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function countApplicationsByLevel(
  supabase: SupabaseServerClient,
  level: string,
  source = landingContent.apply.source
): Promise<number> {
  const { count, error } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("level", level)
    .eq("source", source)
    .neq("status", "waitlist");

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getTeamApplicationStatuses(
  supabase: SupabaseServerClient
): Promise<Record<string, TeamApplicationStatus>> {
  const entries = await Promise.all(
    landingContent.teams.map(async (team) => {
      const count = await countApplicationsByLevel(supabase, team.levelOption);
      const isClosed = count >= TEAM_CAPACITY;

      return [
        team.englishName,
        {
          capacity: TEAM_CAPACITY,
          count,
          isClosed,
          level: team.levelOption,
          status: isClosed ? "모집 마감" : "모집 중"
        }
      ] as const;
    })
  );

  return Object.fromEntries(entries);
}

export function getFallbackTeamApplicationStatuses(): Record<string, TeamApplicationStatus> {
  return Object.fromEntries(
    landingContent.teams.map((team) => [
      team.englishName,
      {
        capacity: TEAM_CAPACITY,
        count: null,
        isClosed: false,
        level: team.levelOption,
        status: "모집 중" as const
      }
    ])
  );
}
