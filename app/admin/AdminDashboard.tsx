"use client";

import { createClient, type Session } from "@supabase/supabase-js";
import {
  Download,
  LogOut,
  RefreshCw,
  Save,
  Search,
  ShieldCheck
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  APPLICATION_STATUSES,
  applicationStatusLabels,
  type ApplicationStatus
} from "@/lib/applications";
import { applicationDateOptions, levelOptions } from "@/lib/content";
import styles from "./AdminDashboard.module.css";

type AdminApplication = {
  admin_note?: string | null;
  application_date?: string | null;
  availability?: string | null;
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
  status: ApplicationStatus;
};

type AdminListResponse = {
  applications?: AdminApplication[];
  message?: string;
  ok?: boolean;
  viewerEmail?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function getPhone(application: AdminApplication): string {
  return application.phone || application.contact || "-";
}

function getEmail(application: AdminApplication): string {
  return application.email || "-";
}

function includesSearch(application: AdminApplication, search: string): boolean {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return true;
  }

  return [
    application.name,
    getPhone(application),
    getEmail(application),
    application.level,
    application.application_date,
    application.speaking_test_score,
    application.availability
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(keyword));
}

function escapeCsv(value: string | null | undefined): string {
  const text = value ?? "";

  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(applications: AdminApplication[]) {
  const headers = [
    "접수일",
    "이름",
    "전화번호",
    "이메일",
    "성별",
    "수업 가능 일자",
    "레벨",
    "회화 점수",
    "해외 거주",
    "국제 학교",
    "상태",
    "관리자 메모",
    "지원 동기"
  ];
  const rows = applications.map((application) => [
    formatDateTime(application.created_at),
    application.name,
    getPhone(application),
    getEmail(application),
    application.gender ?? "",
    application.application_date ?? "",
    application.level,
    application.speaking_test_score ?? "",
    application.overseas_experience ?? "",
    application.international_school ?? "",
    applicationStatusLabels[application.status] ?? application.status,
    application.admin_note ?? "",
    application.motivation ?? ""
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsv(cell)).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `the-round-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [viewerEmail, setViewerEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("new");
  const [adminNote, setAdminNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const visibleApplications = useMemo(
    () => applications.filter((application) => includesSearch(application, search)),
    [applications, search]
  );
  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedId) ?? visibleApplications[0],
    [applications, selectedId, visibleApplications]
  );
  const counts = useMemo(() => {
    return applications.reduce(
      (accumulator, application) => {
        accumulator.total += 1;
        accumulator[application.status] += 1;
        return accumulator;
      },
      {
        accepted: 0,
        contacted: 0,
        level_check_scheduled: 0,
        new: 0,
        rejected: 0,
        total: 0,
        waitlist: 0
      } satisfies Record<ApplicationStatus | "total", number>
    );
  }, [applications]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setApplications([]);
      setSelectedId("");
      setViewerEmail("");
      return;
    }

    void loadApplications(session);
  }, [session, statusFilter, levelFilter, dateFilter]);

  useEffect(() => {
    if (!selectedApplication) {
      setAdminNote("");
      setSelectedStatus("new");
      return;
    }

    setAdminNote(selectedApplication.admin_note ?? "");
    setSelectedStatus(selectedApplication.status);
  }, [selectedApplication]);

  async function loadApplications(currentSession = session) {
    if (!currentSession) {
      return;
    }

    const params = new URLSearchParams();

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    if (levelFilter !== "all") {
      params.set("level", levelFilter);
    }

    if (dateFilter !== "all") {
      params.set("applicationDate", dateFilter);
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/applications?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`
        },
        cache: "no-store"
      });
      const result = (await response.json()) as AdminListResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "신청 목록을 불러오지 못했어요.");
      }

      const nextApplications = result.applications ?? [];
      setApplications(nextApplications);
      setViewerEmail(result.viewerEmail ?? currentSession.user.email ?? "");

      if (nextApplications.length > 0) {
        setSelectedId((current) =>
          nextApplications.some((application) => application.id === current)
            ? current
            : nextApplications[0].id
        );
      } else {
        setSelectedId("");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "신청 목록을 불러오지 못했어요."
      );
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

  async function handleSave() {
    if (!session || !selectedApplication) {
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/applications/${selectedApplication.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adminNote,
          status: selectedStatus
        })
      });
      const result = (await response.json()) as {
        application?: AdminApplication;
        message?: string;
        ok?: boolean;
      };

      if (!response.ok || !result.ok || !result.application) {
        throw new Error(result.message || "신청 정보를 저장하지 못했어요.");
      }

      setApplications((current) =>
        current.map((application) =>
          application.id === result.application?.id ? result.application : application
        )
      );
      setMessage("저장했어요.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "신청 정보를 저장하지 못했어요."
      );
    } finally {
      setIsSaving(false);
    }
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
    <main className={styles.adminShell}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>The Round Admin</span>
          <h1>신청 운영</h1>
        </div>
        <div className={styles.headerActions}>
          <span>{viewerEmail || session.user.email}</span>
          <button className={styles.iconButton} onClick={() => void loadApplications()} type="button">
            <RefreshCw aria-hidden="true" />
            새로고침
          </button>
          <button className={styles.iconButton} onClick={handleLogout} type="button">
            <LogOut aria-hidden="true" />
            로그아웃
          </button>
        </div>
      </header>

      <section className={styles.metrics} aria-label="신청 현황">
        <div>
          <span>전체</span>
          <strong>{counts.total}</strong>
        </div>
        <div>
          <span>새 신청</span>
          <strong>{counts.new}</strong>
        </div>
        <div>
          <span>레벨 체크</span>
          <strong>{counts.level_check_scheduled}</strong>
        </div>
        <div>
          <span>확정</span>
          <strong>{counts.accepted}</strong>
        </div>
      </section>

      <section className={styles.toolbar} aria-label="신청 필터">
        <label>
          상태
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">전체</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {applicationStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          레벨
          <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
            <option value="all">전체</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label>
          날짜
          <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
            <option value="all">전체</option>
            {applicationDateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.searchField}>
          검색
          <span>
            <Search aria-hidden="true" />
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="이름, 연락처, 이메일"
              type="search"
              value={search}
            />
          </span>
        </label>
        <button
          className={styles.exportButton}
          onClick={() => downloadCsv(visibleApplications)}
          type="button"
        >
          <Download aria-hidden="true" />
          CSV
        </button>
      </section>

      {message ? <p className={styles.notice}>{message}</p> : null}

      <section className={styles.workspace}>
        <div className={styles.listPane}>
          <div className={styles.listHead}>
            <strong>신청자 {visibleApplications.length}명</strong>
            {isLoading ? <span>불러오는 중</span> : null}
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>접수</th>
                  <th>이름</th>
                  <th>레벨</th>
                  <th>날짜</th>
                  <th>연락처</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((application) => (
                  <tr
                    data-selected={selectedApplication?.id === application.id || undefined}
                    key={application.id}
                    onClick={() => setSelectedId(application.id)}
                  >
                    <td>{formatDateTime(application.created_at)}</td>
                    <td>
                      <button type="button">{application.name}</button>
                    </td>
                    <td>{application.level}</td>
                    <td>{application.application_date ?? "-"}</td>
                    <td>{getPhone(application)}</td>
                    <td>
                      <span className={styles.statusPill}>
                        {applicationStatusLabels[application.status] ?? application.status}
                      </span>
                    </td>
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
        </div>

        <aside className={styles.detailPane}>
          {selectedApplication ? (
            <>
              <div className={styles.detailHead}>
                <div>
                  <span>{formatDateTime(selectedApplication.created_at)}</span>
                  <h2>{selectedApplication.name}</h2>
                </div>
                <button disabled={isSaving} onClick={handleSave} type="button">
                  <Save aria-hidden="true" />
                  {isSaving ? "저장 중" : "저장"}
                </button>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>전화번호</span>
                  <strong>{getPhone(selectedApplication)}</strong>
                </div>
                <div>
                  <span>이메일</span>
                  <strong>{getEmail(selectedApplication)}</strong>
                </div>
                <div>
                  <span>성별</span>
                  <strong>{selectedApplication.gender ?? "-"}</strong>
                </div>
                <div>
                  <span>수업 가능 일자</span>
                  <strong>{selectedApplication.application_date ?? "-"}</strong>
                </div>
                <div>
                  <span>레벨</span>
                  <strong>{selectedApplication.level}</strong>
                </div>
                <div>
                  <span>회화 점수</span>
                  <strong>{selectedApplication.speaking_test_score ?? "-"}</strong>
                </div>
                <div>
                  <span>해외 거주</span>
                  <strong>{selectedApplication.overseas_experience ?? "-"}</strong>
                </div>
                <div>
                  <span>국제 학교</span>
                  <strong>{selectedApplication.international_school ?? "-"}</strong>
                </div>
              </div>

              <label className={styles.fieldBlock}>
                상태
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value as ApplicationStatus)}
                >
                  {APPLICATION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {applicationStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className={styles.fieldBlock}>
                관리자 메모
                <textarea
                  onChange={(event) => setAdminNote(event.target.value)}
                  placeholder="연락 내용, 레벨 체크 일정, 특이사항을 남겨요."
                  rows={7}
                  value={adminNote}
                />
              </label>

              <div className={styles.memoBlock}>
                <span>지원 동기</span>
                <p>{selectedApplication.motivation || "-"}</p>
              </div>

              <div className={styles.memoBlock}>
                <span>기존 상세 요약</span>
                <p>{selectedApplication.availability || "-"}</p>
              </div>

              <div className={styles.detailMeta}>
                <span>유입: {selectedApplication.source ?? "-"}</span>
                <span>알림 성공: {formatDateTime(selectedApplication.notified_at)}</span>
                <span>알림 오류: {selectedApplication.notification_error ?? "-"}</span>
              </div>
            </>
          ) : (
            <p className={styles.emptyDetail}>신청자를 선택해주세요.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
