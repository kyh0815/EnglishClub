import { createClient } from "@supabase/supabase-js";
import {
  APPLICATION_STATUSES,
  INQUIRY_STATUSES,
  type ApplicationStatus,
  type InquiryStatus
} from "@/lib/applications";
import { landingContent, TEAM_CAPACITY } from "@/lib/content";

export type StatusHistoryEntry = {
  at: string;
  from: string | null;
  to: string;
};

type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          admin_memo: string | null;
          admin_note: string | null;
          application_date: string | null;
          availability: string | null;
          contact: string;
          cohort: string | null;
          created_at: string;
          email: string | null;
          gender: string | null;
          id: string;
          international_school: string | null;
          level: string;
          motivation: string | null;
          name: string;
          notification_error: string | null;
          notified_at: string | null;
          overseas_experience: string | null;
          phone: string | null;
          source: string | null;
          speaking_test_score: string | null;
          status: string;
          status_changed_at: string | null;
          status_history: StatusHistoryEntry[] | null;
        };
        Insert: {
          admin_memo?: string | null;
          admin_note?: string | null;
          application_date?: string | null;
          availability?: string | null;
          contact: string;
          cohort?: string | null;
          created_at?: string;
          email?: string | null;
          gender?: string | null;
          id?: string;
          international_school?: string | null;
          level: string;
          motivation?: string | null;
          name: string;
          notification_error?: string | null;
          notified_at?: string | null;
          overseas_experience?: string | null;
          phone?: string | null;
          source?: string | null;
          speaking_test_score?: string | null;
          status?: string;
          status_changed_at?: string | null;
          status_history?: StatusHistoryEntry[] | null;
        };
        Update: {
          admin_memo?: string | null;
          admin_note?: string | null;
          application_date?: string | null;
          availability?: string | null;
          contact?: string;
          cohort?: string | null;
          created_at?: string;
          email?: string | null;
          gender?: string | null;
          id?: string;
          international_school?: string | null;
          level?: string;
          motivation?: string | null;
          name?: string;
          notification_error?: string | null;
          notified_at?: string | null;
          overseas_experience?: string | null;
          phone?: string | null;
          source?: string | null;
          speaking_test_score?: string | null;
          status?: string;
          status_changed_at?: string | null;
          status_history?: StatusHistoryEntry[] | null;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          admin_memo: string | null;
          contact: string;
          created_at: string;
          id: string;
          message: string;
          name: string | null;
          source: string | null;
          status: string;
          status_changed_at: string | null;
          status_history: StatusHistoryEntry[] | null;
        };
        Insert: {
          admin_memo?: string | null;
          contact: string;
          created_at?: string;
          id?: string;
          message: string;
          name?: string | null;
          source?: string | null;
          status?: string;
          status_changed_at?: string | null;
          status_history?: StatusHistoryEntry[] | null;
        };
        Update: {
          admin_memo?: string | null;
          contact?: string;
          created_at?: string;
          id?: string;
          message?: string;
          name?: string | null;
          source?: string | null;
          status?: string;
          status_changed_at?: string | null;
          status_history?: StatusHistoryEntry[] | null;
        };
        Relationships: [];
      };
      message_templates: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          title: string;
          updated_at: string | null;
          variables: string[] | null;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string | null;
          variables?: string[] | null;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string | null;
          variables?: string[] | null;
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
type ApplicationInsert = Database["public"]["Tables"]["applications"]["Insert"];
type TemplateInsert = Database["public"]["Tables"]["message_templates"]["Insert"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];
export type MessageTemplateRow = Database["public"]["Tables"]["message_templates"]["Row"];

export type TeamApplicationStatus = {
  capacity: number;
  count: number | null;
  isClosed: boolean;
  level: string;
  status: "모집 중" | "모집 마감" | "준비중" | "사전예약";
};

export type ApplicationCreateInput = {
  applicationDate: string;
  availability: string | null;
  cohort: string | null;
  email: string | null;
  gender: string;
  internationalSchool: string;
  level: string;
  motivation: string | null;
  name: string;
  overseasExperience: string;
  phone: string;
  source: string | null;
  speakingTestScore: string;
  status?: ApplicationStatus;
};

export type ApplicationListFilters = {
  applicationDate?: string;
  level?: string;
  status?: ApplicationStatus;
};

export type ApplicationUpdateInput = {
  adminMemo?: string | null;
  adminNote?: string | null;
  status?: ApplicationStatus;
};

export type InquiryListFilters = {
  status?: InquiryStatus;
};

export type InquiryUpdateInput = {
  adminMemo?: string | null;
  status?: InquiryStatus;
};

export type MessageTemplateInput = {
  body: string;
  title: string;
  variables?: string[] | null;
};

export type ApplicationNotificationUpdateInput = {
  error: string | null;
  notifiedAt: string | null;
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
  cohort: string = landingContent.apply.defaultCohort
): Promise<number> {
  const { count, error } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("level", level)
    .eq("cohort", cohort)
    .neq("status", "waitlist");

  if (error && !isMissingColumnError(error)) {
    throw error;
  }

  if (!error) {
    return count ?? 0;
  }

  const { count: legacyCount, error: legacyError } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("level", level)
    .eq("source", landingContent.apply.source)
    .neq("status", "waitlist");

  if (legacyError) {
    throw legacyError;
  }

  return legacyCount ?? 0;
}

function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) {
    return false;
  }

  return error.code === "PGRST204" || /column .* does not exist/i.test(error.message ?? "");
}

export async function createApplication(
  supabase: SupabaseServerClient,
  input: ApplicationCreateInput
): Promise<ApplicationRow> {
  const application: ApplicationInsert = {
    name: input.name,
    contact: input.phone,
    phone: input.phone,
    email: input.email,
    gender: input.gender,
    cohort: input.cohort,
    application_date: input.applicationDate,
    level: input.level,
    speaking_test_score: input.speakingTestScore,
    overseas_experience: input.overseasExperience,
    international_school: input.internationalSchool,
    motivation: input.motivation,
    availability: input.availability,
    source: input.source,
    status: input.status ?? "신규"
  };

  const { data, error } = await supabase
    .from("applications")
    .insert(application)
    .select("*")
    .single();

  if (!error) {
    return data;
  }

  if (!isMissingColumnError(error)) {
    throw error;
  }

  const legacyApplication: ApplicationInsert = {
    name: input.name,
    contact: input.phone,
    level: input.level,
    motivation: input.motivation,
    availability: input.availability,
    source: input.source,
    status: input.status ?? "신규"
  };

  const { data: legacyData, error: legacyError } = await supabase
    .from("applications")
    .insert(legacyApplication)
    .select("*")
    .single();

  if (legacyError) {
    throw legacyError;
  }

  return legacyData;
}

export async function listApplications(
  supabase: SupabaseServerClient,
  filters: ApplicationListFilters = {}
): Promise<ApplicationRow[]> {
  let query = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.level) {
    query = query.eq("level", filters.level);
  }

  if (filters.applicationDate) {
    query = query.eq("application_date", filters.applicationDate);
  }

  const { data, error } = await query;

  if (!error) {
    return data ?? [];
  }

  if (!filters.applicationDate || !isMissingColumnError(error)) {
    throw error;
  }

  let legacyQuery = supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filters.status) {
    legacyQuery = legacyQuery.eq("status", filters.status);
  }

  if (filters.level) {
    legacyQuery = legacyQuery.eq("level", filters.level);
  }

  const { data: legacyData, error: legacyError } = await legacyQuery;

  if (legacyError) {
    throw legacyError;
  }

  return legacyData ?? [];
}

export async function updateApplication(
  supabase: SupabaseServerClient,
  id: string,
  input: ApplicationUpdateInput
): Promise<ApplicationRow> {
  const { data: existing, error: existingError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (existingError) {
    throw existingError;
  }

  const update: Database["public"]["Tables"]["applications"]["Update"] = {};
  const nextMemo =
    Object.prototype.hasOwnProperty.call(input, "adminMemo")
      ? input.adminMemo
      : input.adminNote;

  if (input.status) {
    update.status = input.status;

    if (input.status !== existing.status) {
      const changedAt = new Date().toISOString();
      update.status_changed_at = changedAt;
      update.status_history = [
        ...(Array.isArray(existing.status_history) ? existing.status_history : []),
        {
          at: changedAt,
          from: existing.status ?? null,
          to: input.status
        }
      ];
    }
  }

  if (
    Object.prototype.hasOwnProperty.call(input, "adminMemo") ||
    Object.prototype.hasOwnProperty.call(input, "adminNote")
  ) {
    update.admin_memo = nextMemo ?? null;
    update.admin_note = nextMemo ?? null;
  }

  const { data, error } = await supabase
    .from("applications")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (!error) {
    return data;
  }

  if (!isMissingColumnError(error)) {
    throw error;
  }

  const legacyUpdate: Database["public"]["Tables"]["applications"]["Update"] = {};

  if (input.status) {
    legacyUpdate.status = input.status;
  }

  if (
    Object.prototype.hasOwnProperty.call(input, "adminMemo") ||
    Object.prototype.hasOwnProperty.call(input, "adminNote")
  ) {
    legacyUpdate.admin_note = nextMemo ?? null;
  }

  const { data: legacyData, error: legacyError } = await supabase
    .from("applications")
    .update(legacyUpdate)
    .eq("id", id)
    .select("*")
    .single();

  if (legacyError) {
    throw legacyError;
  }

  return legacyData;
}

export async function updateApplicationNotification(
  supabase: SupabaseServerClient,
  id: string,
  input: ApplicationNotificationUpdateInput
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .update({
      notification_error: input.error,
      notified_at: input.notifiedAt
    })
    .eq("id", id);

  if (error && !isMissingColumnError(error)) {
    throw error;
  }
}

export function isApplicationStatus(value: string): value is ApplicationStatus {
  return APPLICATION_STATUSES.includes(value as ApplicationStatus);
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return INQUIRY_STATUSES.includes(value as InquiryStatus);
}

export async function listInquiries(
  supabase: SupabaseServerClient,
  filters: InquiryListFilters = {}
): Promise<InquiryRow[]> {
  let query = supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function updateInquiry(
  supabase: SupabaseServerClient,
  id: string,
  input: InquiryUpdateInput
): Promise<InquiryRow> {
  const { data: existing, error: existingError } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (existingError) {
    throw existingError;
  }

  const update: Database["public"]["Tables"]["inquiries"]["Update"] = {};

  if (input.status) {
    update.status = input.status;

    if (input.status !== existing.status) {
      const changedAt = new Date().toISOString();
      update.status_changed_at = changedAt;
      update.status_history = [
        ...(Array.isArray(existing.status_history) ? existing.status_history : []),
        {
          at: changedAt,
          from: existing.status ?? null,
          to: input.status
        }
      ];
    }
  }

  if (Object.prototype.hasOwnProperty.call(input, "adminMemo")) {
    update.admin_memo = input.adminMemo ?? null;
  }

  const { data, error } = await supabase
    .from("inquiries")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (!error) {
    return data;
  }

  if (!isMissingColumnError(error)) {
    throw error;
  }

  const legacyUpdate: Database["public"]["Tables"]["inquiries"]["Update"] = {};

  if (input.status) {
    legacyUpdate.status = input.status;
  }

  const { data: legacyData, error: legacyError } = await supabase
    .from("inquiries")
    .update(legacyUpdate)
    .eq("id", id)
    .select("*")
    .single();

  if (legacyError) {
    throw legacyError;
  }

  return legacyData;
}

export async function listMessageTemplates(
  supabase: SupabaseServerClient
): Promise<MessageTemplateRow[]> {
  const { data, error } = await supabase
    .from("message_templates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createMessageTemplate(
  supabase: SupabaseServerClient,
  input: MessageTemplateInput
): Promise<MessageTemplateRow> {
  const template: TemplateInsert = {
    body: input.body,
    title: input.title,
    variables: input.variables ?? []
  };
  const { data, error } = await supabase
    .from("message_templates")
    .insert(template)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateMessageTemplate(
  supabase: SupabaseServerClient,
  id: string,
  input: MessageTemplateInput
): Promise<MessageTemplateRow> {
  const { data, error } = await supabase
    .from("message_templates")
    .update({
      body: input.body,
      title: input.title,
      updated_at: new Date().toISOString(),
      variables: input.variables ?? []
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTeamApplicationStatuses(
  supabase: SupabaseServerClient
): Promise<Record<string, TeamApplicationStatus>> {
  const entries = await Promise.all(
    landingContent.teams.map(async (team) => {
      const teamStatus = team.status as TeamApplicationStatus["status"];

      if (teamStatus === "사전예약") {
        return [
          team.englishName,
          {
            capacity: TEAM_CAPACITY,
            count: null,
            isClosed: false,
            level: team.levelOption,
            status: "사전예약"
          }
        ] as const;
      }

      if (teamStatus === "준비중") {
        return [
          team.englishName,
          {
            capacity: TEAM_CAPACITY,
            count: null,
            isClosed: true,
            level: team.levelOption,
            status: "준비중"
          }
        ] as const;
      }

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
        isClosed: (team.status as TeamApplicationStatus["status"]) === "준비중",
        level: team.levelOption,
        status:
          (team.status as TeamApplicationStatus["status"]) === "준비중"
            ? "준비중"
            : (team.status as TeamApplicationStatus["status"]) === "사전예약"
              ? "사전예약"
              : "모집 중"
      }
    ])
  );
}
