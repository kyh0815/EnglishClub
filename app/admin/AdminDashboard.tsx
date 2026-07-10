"use client";

import { createClient, type Session } from "@supabase/supabase-js";
import {
  Clipboard,
  ChevronUp,
  FileText,
  Home,
  LogOut,
  MailQuestion,
  Menu,
  MessageSquareText,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  X
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  APPLICATION_STATUSES,
  INQUIRY_STATUSES,
  getApplicationStatusLabel,
  type ApplicationStatus,
  type InquiryStatus
} from "@/lib/applications";
import { cohortOptions } from "@/lib/content";
import Image from "next/image";
import styles from "./AdminDashboard.module.css";

type AdminView = "dashboard" | "applications" | "inquiries" | "templates";

type StatusHistoryEntry = {
  at: string;
  from: string | null;
  to: string;
};

type AdminApplication = {
  admin_memo?: string | null;
  admin_note?: string | null;
  application_date?: string | null;
  availability?: string | null;
  cohort?: string | null;
  contact: string;
  created_at: string;
  email?: string | null;
  gender?: string | null;
  id: string;
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
  status: string;
  status_changed_at?: string | null;
  status_history?: StatusHistoryEntry[] | null;
};

type AdminInquiry = {
  admin_memo?: string | null;
  contact: string;
  created_at: string;
  id: string;
  message: string;
  name?: string | null;
  source?: string | null;
  status: string;
  status_changed_at?: string | null;
  status_history?: StatusHistoryEntry[] | null;
};

type MessageTemplate = {
  body: string;
  created_at: string;
  id: string;
  title: string;
  updated_at?: string | null;
  variables?: string[] | null;
};

type AdminDashboardProps = {
  initialView?: AdminView;
};

type AdminListResponse = {
  applications?: AdminApplication[];
  inquiries?: AdminInquiry[];
  message?: string;
  ok?: boolean;
  templates?: MessageTemplate[];
  viewerEmail?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

const navItems: Array<{
  href: string;
  icon: typeof Home;
  label: string;
  view: AdminView;
}> = [
  { href: "/admin", icon: Home, label: "대시보드", view: "dashboard" },
  { href: "/admin/applications", icon: FileText, label: "신청 관리", view: "applications" },
  { href: "/admin/inquiries", icon: MailQuestion, label: "문의 관리", view: "inquiries" },
  { href: "/admin/templates", icon: MessageSquareText, label: "메시지 템플릿", view: "templates" }
];

const newApplicationStatuses = new Set<string>(["신규", "new"]);
const confirmedStatuses = new Set<string>(["확정", "accepted"]);

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatShortId(id: string): string {
  return id.slice(0, 8);
}

function getInitials(email: string): string {
  const target = email.trim();

  if (!target) {
    return "TR";
  }

  const [name] = target.split("@");
  return name
    .split(/[.\-_]/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "TR";
}

function getPhone(application: AdminApplication): string {
  return application.phone || application.contact || "-";
}

function getApplicationMemo(application: AdminApplication): string {
  return application.admin_memo ?? application.admin_note ?? "";
}

function getCohort(application: AdminApplication): string {
  return application.cohort || application.source || "-";
}

function getStatusTone(status: string): string {
  if (["신규", "미답변", "new"].includes(status)) {
    return styles.statusNew;
  }

  if (["검토중", "보류", "level_check_scheduled"].includes(status)) {
    return styles.statusReview;
  }

  if (["연락완료", "답변완료", "contacted"].includes(status)) {
    return styles.statusContacted;
  }

  if (["입금대기", "waitlist"].includes(status)) {
    return styles.statusPending;
  }

  if (["확정", "accepted"].includes(status)) {
    return styles.statusAccepted;
  }

  if (["거절", "이탈", "rejected"].includes(status)) {
    return styles.statusClosed;
  }

  return styles.statusNeutral;
}

function includesApplication(application: AdminApplication, search: string): boolean {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [
    application.id,
    application.name,
    getPhone(application),
    application.email,
    application.level,
    application.application_date,
    getCohort(application)
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function includesInquiry(inquiry: AdminInquiry, search: string): boolean {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [inquiry.id, inquiry.name, inquiry.contact, inquiry.message]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function isThisWeek(value: string): boolean {
  const date = new Date(value);
  const now = new Date();
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  const offset = day === 0 ? 6 : day - 1;

  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - offset);

  return date >= weekStart;
}

function extractVariables(text: string): string[] {
  return Array.from(text.matchAll(/\{\{([^{}]+)\}\}/g))
    .map((match) => match[1]?.trim())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

function interpolateTemplate(template: MessageTemplate, application: AdminApplication): string {
  const values: Record<string, string> = {
    기수: getCohort(application),
    레벨: application.level,
    상태: getApplicationStatusLabel(application.status),
    수업일: application.application_date ?? "",
    연락처: getPhone(application),
    이름: application.name
  };

  return template.body.replace(/\{\{([^{}]+)\}\}/g, (_match, key: string) => {
    return values[key.trim()] ?? "";
  });
}

export default function AdminDashboard({ initialView = "dashboard" }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<AdminView>(initialView);
  const [session, setSession] = useState<Session | null>(null);
  const [viewerEmail, setViewerEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [selectedInquiryId, setSelectedInquiryId] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>("신규");
  const [applicationMemo, setApplicationMemo] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus>("미답변");
  const [inquiryMemo, setInquiryMemo] = useState("");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("all");
  const [applicationCohortFilter, setApplicationCohortFilter] = useState("all");
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState("all");
  const [applicationSort, setApplicationSort] = useState<"desc" | "asc">("desc");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [inquirySearch, setInquirySearch] = useState("");
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [templateVariables, setTemplateVariables] = useState("");
  const [isApplicationSheetOpen, setIsApplicationSheetOpen] = useState(false);
  const [isInquirySheetOpen, setIsInquirySheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedApplicationId) ?? null,
    [applications, selectedApplicationId]
  );
  const selectedInquiry = useMemo(
    () => inquiries.find((inquiry) => inquiry.id === selectedInquiryId) ?? null,
    [inquiries, selectedInquiryId]
  );
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );
  const visibleApplications = useMemo(() => {
    return applications
      .filter((application) =>
        applicationCohortFilter === "all" ? true : getCohort(application) === applicationCohortFilter
      )
      .filter((application) =>
        applicationStatusFilter === "all" ? true : application.status === applicationStatusFilter
      )
      .filter((application) => includesApplication(application, applicationSearch))
      .sort((a, b) => {
        const left = new Date(a.created_at).getTime();
        const right = new Date(b.created_at).getTime();
        return applicationSort === "desc" ? right - left : left - right;
      });
  }, [
    applications,
    applicationCohortFilter,
    applicationSearch,
    applicationSort,
    applicationStatusFilter
  ]);
  const visibleInquiries = useMemo(() => {
    return inquiries
      .filter((inquiry) =>
        inquiryStatusFilter === "all" ? true : inquiry.status === inquiryStatusFilter
      )
      .filter((inquiry) => includesInquiry(inquiry, inquirySearch));
  }, [inquiries, inquirySearch, inquiryStatusFilter]);
  const dashboardMetrics = useMemo(() => {
    const total = applications.length;
    const confirmed = applications.filter((application) =>
      confirmedStatuses.has(application.status)
    ).length;
    const thisWeekNew = applications.filter(
      (application) =>
        newApplicationStatuses.has(application.status) && isThisWeek(application.created_at)
    ).length;

    return {
      registered: confirmed,
      recent: [...applications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5),
      // TODO: cohort-level registration history is needed before this can be calculated.
      retentionRate: null,
      thisWeekNew,
      total
    };
  }, [applications]);
  const activeNavItem = navItems.find((item) => item.view === activeView);
  const accountEmail = viewerEmail || session?.user.email || "";
  const accountInitials = getInitials(accountEmail);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      if (data.session) {
        void loadAdminData(data.session);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession) {
        void loadAdminData(nextSession);
      } else {
        setApplications([]);
        setInquiries([]);
        setTemplates([]);
        setViewerEmail("");
      }
    });

    return () => subscription.unsubscribe();
    // Auth subscription must be registered once; loadAdminData is called from auth callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchJson<T>(url: string, currentSession: Session, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);

    headers.set("Authorization", `Bearer ${currentSession.access_token}`);

    const response = await fetch(url, {
      ...init,
      headers,
      cache: "no-store"
    });
    const result = (await response.json()) as T & { message?: string; ok?: boolean };

    if (!response.ok || result.ok === false) {
      throw new Error(result.message || "요청을 처리하지 못했어요.");
    }

    return result;
  }

  async function loadAdminData(currentSession = session) {
    if (!currentSession) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const [applicationsResult, inquiriesResult] = await Promise.all([
        fetchJson<AdminListResponse>("/api/admin/applications", currentSession),
        fetchJson<AdminListResponse>("/api/admin/inquiries", currentSession)
      ]);

      setApplications(applicationsResult.applications ?? []);
      setInquiries(inquiriesResult.inquiries ?? []);
      setViewerEmail(
        applicationsResult.viewerEmail ??
          inquiriesResult.viewerEmail ??
          currentSession.user.email ??
          ""
      );

      try {
        const templatesResult = await fetchJson<AdminListResponse>(
          "/api/admin/templates",
          currentSession
        );
        setTemplates(templatesResult.templates ?? []);
      } catch (templateError) {
        setTemplates([]);
        setMessage(
          templateError instanceof Error
            ? templateError.message
            : "메시지 템플릿을 불러오지 못했어요."
        );
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Admin 데이터를 불러오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setMessage("Supabase 공개 키 설정이 필요해요.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        throw error;
      }
    } catch {
      setMessage("로그인 정보를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  }

  async function saveApplication() {
    if (!session || !selectedApplication) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const result = await fetchJson<{
        application?: AdminApplication;
        ok?: boolean;
      }>(`/api/admin/applications/${selectedApplication.id}`, session, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminMemo: applicationMemo,
          status: applicationStatus
        })
      });

      if (!result.application) {
        throw new Error("신청 정보를 저장하지 못했어요.");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === result.application?.id ? result.application : application
        )
      );
      setMessage("신청 정보를 저장했어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "신청 정보를 저장하지 못했어요.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveInquiry() {
    if (!session || !selectedInquiry) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const result = await fetchJson<{
        inquiry?: AdminInquiry;
        ok?: boolean;
      }>(`/api/admin/inquiries/${selectedInquiry.id}`, session, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminMemo: inquiryMemo,
          status: inquiryStatus
        })
      });

      if (!result.inquiry) {
        throw new Error("문의 정보를 저장하지 못했어요.");
      }

      setInquiries((current) =>
        current.map((inquiry) => (inquiry.id === result.inquiry?.id ? result.inquiry : inquiry))
      );
      setMessage("문의 정보를 저장했어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "문의 정보를 저장하지 못했어요.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveTemplate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const variables = templateVariables
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const body = JSON.stringify({
      body: templateBody,
      title: templateTitle,
      variables: variables.length > 0 ? variables : extractVariables(templateBody)
    });
    const url = selectedTemplate ? `/api/admin/templates/${selectedTemplate.id}` : "/api/admin/templates";

    setIsSaving(true);
    setMessage("");

    try {
      const result = await fetchJson<{
        ok?: boolean;
        template?: MessageTemplate;
      }>(url, session, {
        method: selectedTemplate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body
      });

      if (!result.template) {
        throw new Error("메시지 템플릿을 저장하지 못했어요.");
      }

      setTemplates((current) => {
        if (!selectedTemplate) {
          return [result.template as MessageTemplate, ...current];
        }

        return current.map((template) =>
          template.id === result.template?.id ? result.template : template
        );
      });
      setSelectedTemplateId(result.template.id);
      setMessage("메시지 템플릿을 저장했어요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "메시지 템플릿을 저장하지 못했어요.");
    } finally {
      setIsSaving(false);
    }
  }

  async function copyTemplate(template: MessageTemplate, application: AdminApplication) {
    const text = interpolateTemplate(template, application);

    await navigator.clipboard.writeText(text);
    setMessage("템플릿 메시지를 클립보드에 복사했어요.");
  }

  function openApplication(application: AdminApplication) {
    setSelectedApplicationId(application.id);
    setApplicationStatus(
      APPLICATION_STATUSES.includes(application.status as ApplicationStatus)
        ? (application.status as ApplicationStatus)
        : "신규"
    );
    setApplicationMemo(getApplicationMemo(application));
    setIsApplicationSheetOpen(true);
  }

  function openInquiry(inquiry: AdminInquiry) {
    setSelectedInquiryId(inquiry.id);
    setInquiryStatus(
      INQUIRY_STATUSES.includes(inquiry.status as InquiryStatus)
        ? (inquiry.status as InquiryStatus)
        : "미답변"
    );
    setInquiryMemo(inquiry.admin_memo ?? "");
    setIsInquirySheetOpen(true);
  }

  function selectTemplate(template: MessageTemplate) {
    setSelectedTemplateId(template.id);
    setTemplateTitle(template.title);
    setTemplateBody(template.body);
    setTemplateVariables((template.variables ?? extractVariables(template.body)).join(", "));
  }

  function clearTemplateDraft() {
    setSelectedTemplateId("");
    setTemplateTitle("");
    setTemplateBody("");
    setTemplateVariables("");
  }

  function handleNavigate(view: AdminView) {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  }

  if (!isConfigured) {
    return (
      <main className={styles.shell}>
        <section className={styles.authPanel}>
          <ShieldCheck aria-hidden="true" />
          <h1>The Round Admin</h1>
          <p>`NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정이 필요해요.</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className={styles.shell}>
        <form className={styles.loginPanel} onSubmit={handleLogin}>
          <div>
            <span className={styles.eyebrow}>The Round</span>
            <h1>Admin</h1>
            <p>운영자 계정으로 로그인해주세요.</p>
          </div>
          <label>
            이메일
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@theroundhq.com"
              type="email"
              value={email}
            />
          </label>
          <label>
            비밀번호
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
          {message ? <p className={styles.message}>{message}</p> : null}
          <button disabled={isLoading} type="submit">
            {isLoading ? "확인 중" : "로그인"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main
      className={cx(
        styles.adminApp,
        isMobileSidebarOpen && styles.mobileSidebarOpen
      )}
    >
      <button
        aria-label="Close admin navigation"
        className={styles.mobileBackdrop}
        onClick={() => setIsMobileSidebarOpen(false)}
        type="button"
      />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Link
            aria-label="The Round Admin home"
            className={styles.brandLink}
            href="/admin"
            onClick={() => handleNavigate("dashboard")}
          >
            <Image
              alt=""
              aria-hidden="true"
              className={styles.brandFavicon}
              height={18}
              src="/icon.svg"
              unoptimized
              width={18}
            />
            <span>The Round Admin</span>
          </Link>
        </div>
        <div className={styles.sidebarNav} role="navigation" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                aria-current={activeView === item.view ? "page" : undefined}
                href={item.href}
                key={item.view}
                onClick={() => handleNavigate(item.view)}
                title={item.label}
              >
                <Icon aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className={styles.sidebarFooter}>
          <button
            aria-expanded={isAccountMenuOpen}
            className={styles.accountButton}
            onClick={() => setIsAccountMenuOpen((current) => !current)}
            type="button"
          >
            <span className={styles.avatar} aria-hidden="true">
              {accountInitials}
            </span>
            <span className={styles.accountText}>
              <strong>Operator</strong>
              <span>{accountEmail}</span>
            </span>
            <ChevronUp aria-hidden="true" />
          </button>
          {isAccountMenuOpen ? (
            <div className={styles.accountMenu}>
              <div className={styles.accountMenuHead}>
                <span className={styles.avatar} aria-hidden="true">
                  {accountInitials}
                </span>
                <div>
                  <strong>Operator</strong>
                  <span>{accountEmail}</span>
                </div>
              </div>
              <button onClick={handleLogout} type="button">
                <LogOut aria-hidden="true" />
                로그아웃
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      <section className={styles.contentShell}>
        <header className={styles.topbar}>
          <button
            aria-label="Open admin navigation"
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileSidebarOpen(true)}
            type="button"
          >
            <Menu aria-hidden="true" />
          </button>
          <div className={styles.pageTitle}>
            <h1>{activeNavItem?.label}</h1>
          </div>
          <button
            className={styles.iconButton}
            disabled={isLoading}
            onClick={() => void loadAdminData()}
            type="button"
          >
            <RefreshCw aria-hidden="true" />
            {isLoading ? "동기화 중" : "새로고침"}
          </button>
        </header>

        {message ? <p className={styles.notice}>{message}</p> : null}

        {activeView === "dashboard" ? (
          <section className={styles.viewStack}>
            <div className={styles.metrics}>
              <div>
                <span>총 신청 수</span>
                <strong>{dashboardMetrics.total}</strong>
              </div>
              <div>
                <span>이번 주 신규 신청</span>
                <strong>{dashboardMetrics.thisWeekNew}</strong>
              </div>
              <div>
                <span>등록 수</span>
                <strong>{dashboardMetrics.registered}</strong>
              </div>
              <div>
                <span>재등록율</span>
                <strong>--</strong>
                <small>기수 데이터 확보 후 계산</small>
              </div>
            </div>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <strong>최근 신청 5건</strong>
                <Link href="/admin/applications">전체 보기</Link>
              </div>
              <div className={styles.compactList}>
                {dashboardMetrics.recent.map((application) => (
                  <button
                    key={application.id}
                    onClick={() => {
                      setActiveView("applications");
                      openApplication(application);
                    }}
                    type="button"
                  >
                    <span>
                      <strong>{application.name}</strong>
                      <small>{formatDateTime(application.created_at)}</small>
                    </span>
                    <span className={`${styles.statusBadge} ${getStatusTone(application.status)}`}>
                      {getApplicationStatusLabel(application.status)}
                    </span>
                  </button>
                ))}
                {dashboardMetrics.recent.length === 0 ? (
                  <p className={styles.emptyState}>최근 신청이 없어요.</p>
                ) : null}
              </div>
            </section>
          </section>
        ) : null}

        {activeView === "applications" ? (
          <section className={styles.viewStack}>
            <div className={styles.toolbar}>
              <label>
                기수
                <select
                  value={applicationCohortFilter}
                  onChange={(event) => setApplicationCohortFilter(event.target.value)}
                >
                  <option value="all">전체</option>
                  {cohortOptions.map((cohort) => (
                    <option key={cohort} value={cohort}>
                      {cohort}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                상태
                <select
                  value={applicationStatusFilter}
                  onChange={(event) => setApplicationStatusFilter(event.target.value)}
                >
                  <option value="all">전체</option>
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                신청일 정렬
                <select
                  value={applicationSort}
                  onChange={(event) => setApplicationSort(event.target.value as "desc" | "asc")}
                >
                  <option value="desc">최신순</option>
                  <option value="asc">오래된순</option>
                </select>
              </label>
              <label className={styles.searchField}>
                검색
                <span>
                  <Search aria-hidden="true" />
                  <input
                    onChange={(event) => setApplicationSearch(event.target.value)}
                    placeholder="이름, 연락처"
                    type="search"
                    value={applicationSearch}
                  />
                </span>
              </label>
            </div>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <strong>신청 {visibleApplications.length}건</strong>
                {isLoading ? <span>불러오는 중</span> : null}
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>이름</th>
                      <th>연락처</th>
                      <th>신청일</th>
                      <th>상태</th>
                      <th>기수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleApplications.map((application) => (
                      <tr key={application.id} onClick={() => openApplication(application)}>
                        <td>{formatShortId(application.id)}</td>
                        <td>
                          <button type="button">{application.name}</button>
                        </td>
                        <td>{getPhone(application)}</td>
                        <td>{formatDateTime(application.created_at)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusTone(application.status)}`}>
                            {getApplicationStatusLabel(application.status)}
                          </span>
                        </td>
                        <td>{getCohort(application)}</td>
                      </tr>
                    ))}
                    {visibleApplications.length === 0 ? (
                      <tr>
                        <td className={styles.emptyCell} colSpan={6}>
                          조건에 맞는 신청이 없어요.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}

        {activeView === "inquiries" ? (
          <section className={styles.viewStack}>
            <div className={styles.toolbar}>
              <label>
                상태
                <select
                  value={inquiryStatusFilter}
                  onChange={(event) => setInquiryStatusFilter(event.target.value)}
                >
                  <option value="all">전체</option>
                  {INQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.searchField}>
                검색
                <span>
                  <Search aria-hidden="true" />
                  <input
                    onChange={(event) => setInquirySearch(event.target.value)}
                    placeholder="이름, 연락처, 문의 내용"
                    type="search"
                    value={inquirySearch}
                  />
                </span>
              </label>
            </div>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <strong>문의 {visibleInquiries.length}건</strong>
                {isLoading ? <span>불러오는 중</span> : null}
              </div>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>이름</th>
                      <th>연락처</th>
                      <th>접수일</th>
                      <th>상태</th>
                      <th>문의</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInquiries.map((inquiry) => (
                      <tr key={inquiry.id} onClick={() => openInquiry(inquiry)}>
                        <td>{formatShortId(inquiry.id)}</td>
                        <td>
                          <button type="button">{inquiry.name || "-"}</button>
                        </td>
                        <td>{inquiry.contact}</td>
                        <td>{formatDateTime(inquiry.created_at)}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${getStatusTone(inquiry.status)}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td>{inquiry.message.slice(0, 42)}</td>
                      </tr>
                    ))}
                    {visibleInquiries.length === 0 ? (
                      <tr>
                        <td className={styles.emptyCell} colSpan={6}>
                          조건에 맞는 문의가 없어요.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        ) : null}

        {activeView === "templates" ? (
          <section className={styles.templateGrid}>
            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <strong>템플릿 {templates.length}개</strong>
                <button
                  className={styles.textButton}
                  onClick={clearTemplateDraft}
                  type="button"
                >
                  새 템플릿
                </button>
              </div>
              <div className={styles.templateList}>
                {templates.map((template) => (
                  <button
                    data-selected={template.id === selectedTemplateId || undefined}
                    key={template.id}
                    onClick={() => selectTemplate(template)}
                    type="button"
                  >
                    <strong>{template.title}</strong>
                    <span>{(template.variables ?? extractVariables(template.body)).join(", ") || "변수 없음"}</span>
                  </button>
                ))}
                {templates.length === 0 ? (
                  <p className={styles.emptyState}>
                    템플릿 테이블이 비어 있거나 아직 생성되지 않았어요.
                  </p>
                ) : null}
              </div>
            </section>

            <form className={styles.panel} onSubmit={saveTemplate}>
              <div className={styles.panelHead}>
                <strong>{selectedTemplate ? "템플릿 수정" : "새 템플릿"}</strong>
                <button className={styles.primaryButton} disabled={isSaving} type="submit">
                  <Save aria-hidden="true" />
                  {isSaving ? "저장 중" : "저장"}
                </button>
              </div>
              <div className={styles.formStack}>
                <label>
                  제목
                  <input
                    onChange={(event) => setTemplateTitle(event.target.value)}
                    placeholder="승인 안내"
                    value={templateTitle}
                  />
                </label>
                <label>
                  변수
                  <input
                    onChange={(event) => setTemplateVariables(event.target.value)}
                    placeholder="이름, 기수, 레벨"
                    value={templateVariables}
                  />
                </label>
                <label>
                  내용
                  <textarea
                    onChange={(event) => setTemplateBody(event.target.value)}
                    placeholder="{{이름}}님, The Round {{기수}} 참여 안내드립니다."
                    rows={13}
                    value={templateBody}
                  />
                </label>
              </div>
            </form>
          </section>
        ) : null}
      </section>

      {selectedApplication && isApplicationSheetOpen ? (
        <section className={styles.sheetOverlay} aria-label="신청 상세">
          <button
            className={styles.sheetBackdrop}
            onClick={() => setIsApplicationSheetOpen(false)}
            type="button"
          />
          <aside className={styles.sheet}>
            <div className={styles.sheetHead}>
              <div>
                <span>{formatDateTime(selectedApplication.created_at)}</span>
                <h2>{selectedApplication.name}</h2>
              </div>
              <button onClick={() => setIsApplicationSheetOpen(false)} type="button">
                <X aria-hidden="true" />
              </button>
            </div>

            <div className={styles.detailGrid}>
              <div>
                <span>ID</span>
                <strong>{selectedApplication.id}</strong>
              </div>
              <div>
                <span>연락처</span>
                <strong>{getPhone(selectedApplication)}</strong>
              </div>
              <div>
                <span>이메일</span>
                <strong>{selectedApplication.email || "-"}</strong>
              </div>
              <div>
                <span>기수</span>
                <strong>{getCohort(selectedApplication)}</strong>
              </div>
              <div>
                <span>레벨</span>
                <strong>{selectedApplication.level}</strong>
              </div>
              <div>
                <span>수업 가능 일자</span>
                <strong>{selectedApplication.application_date || "-"}</strong>
              </div>
              <div>
                <span>성별</span>
                <strong>{selectedApplication.gender || "-"}</strong>
              </div>
              <div>
                <span>회화 점수</span>
                <strong>{selectedApplication.speaking_test_score || "-"}</strong>
              </div>
              <div>
                <span>해외 거주</span>
                <strong>{selectedApplication.overseas_experience || "-"}</strong>
              </div>
              <div>
                <span>국제 학교</span>
                <strong>{selectedApplication.international_school || "-"}</strong>
              </div>
            </div>

            <div className={styles.formStack}>
              <label>
                상태
                <select
                  value={applicationStatus}
                  onChange={(event) => setApplicationStatus(event.target.value as ApplicationStatus)}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                운영자 메모
                <textarea
                  onChange={(event) => setApplicationMemo(event.target.value)}
                  rows={6}
                  value={applicationMemo}
                />
              </label>
              <button className={styles.primaryButton} disabled={isSaving} onClick={saveApplication} type="button">
                <Save aria-hidden="true" />
                {isSaving ? "저장 중" : "저장"}
              </button>
            </div>

            <div className={styles.memoBlock}>
              <span>지원 동기</span>
              <p>{selectedApplication.motivation || "-"}</p>
            </div>
            <div className={styles.memoBlock}>
              <span>신청폼 응답 전체</span>
              <p>{selectedApplication.availability || "-"}</p>
            </div>

            <div className={styles.templateCopy}>
              <strong>템플릿 복사</strong>
              {templates.length > 0 ? (
                templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => void copyTemplate(template, selectedApplication)}
                    type="button"
                  >
                    <Clipboard aria-hidden="true" />
                    {template.title}
                  </button>
                ))
              ) : (
                <p>저장된 템플릿이 없어요.</p>
              )}
            </div>

            <HistoryList history={selectedApplication.status_history} />
          </aside>
        </section>
      ) : null}

      {selectedInquiry && isInquirySheetOpen ? (
        <section className={styles.sheetOverlay} aria-label="문의 상세">
          <button
            className={styles.sheetBackdrop}
            onClick={() => setIsInquirySheetOpen(false)}
            type="button"
          />
          <aside className={styles.sheet}>
            <div className={styles.sheetHead}>
              <div>
                <span>{formatDateTime(selectedInquiry.created_at)}</span>
                <h2>{selectedInquiry.name || "이름 없음"}</h2>
              </div>
              <button onClick={() => setIsInquirySheetOpen(false)} type="button">
                <X aria-hidden="true" />
              </button>
            </div>

            <div className={styles.detailGrid}>
              <div>
                <span>ID</span>
                <strong>{selectedInquiry.id}</strong>
              </div>
              <div>
                <span>연락처</span>
                <strong>{selectedInquiry.contact}</strong>
              </div>
              <div>
                <span>유입</span>
                <strong>{selectedInquiry.source || "-"}</strong>
              </div>
              <div>
                <span>상태 변경</span>
                <strong>{formatDateTime(selectedInquiry.status_changed_at)}</strong>
              </div>
            </div>

            <div className={styles.formStack}>
              <label>
                상태
                <select
                  value={inquiryStatus}
                  onChange={(event) => setInquiryStatus(event.target.value as InquiryStatus)}
                >
                  {INQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                운영자 메모
                <textarea
                  onChange={(event) => setInquiryMemo(event.target.value)}
                  rows={6}
                  value={inquiryMemo}
                />
              </label>
              <button className={styles.primaryButton} disabled={isSaving} onClick={saveInquiry} type="button">
                <Save aria-hidden="true" />
                {isSaving ? "저장 중" : "저장"}
              </button>
            </div>

            <div className={styles.memoBlock}>
              <span>문의 내용</span>
              <p>{selectedInquiry.message}</p>
            </div>

            <HistoryList history={selectedInquiry.status_history} />
          </aside>
        </section>
      ) : null}
    </main>
  );
}

function HistoryList({ history }: { history?: StatusHistoryEntry[] | null }) {
  return (
    <div className={styles.historyBlock}>
      <strong>상태 변경 이력</strong>
      {history && history.length > 0 ? (
        <ol>
          {history
            .slice()
            .reverse()
            .map((entry) => (
              <li key={`${entry.at}-${entry.to}`}>
                <span>{formatDateTime(entry.at)}</span>
                <p>
                  {entry.from || "없음"} → {entry.to}
                </p>
              </li>
            ))}
        </ol>
      ) : (
        <p>아직 기록된 상태 변경이 없어요.</p>
      )}
    </div>
  );
}
