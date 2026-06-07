import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  getFallbackTeamApplicationStatuses,
  getTeamApplicationStatuses
} from "@/lib/server/applications";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: true,
        configured: false,
        teams: getFallbackTeamApplicationStatuses()
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }

  try {
    return NextResponse.json(
      {
        ok: true,
        configured: true,
        teams: await getTeamApplicationStatuses(supabase)
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return NextResponse.json(
      {
        ok: true,
        configured: true,
        teams: getFallbackTeamApplicationStatuses()
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
