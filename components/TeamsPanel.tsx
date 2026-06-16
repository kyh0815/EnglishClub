"use client";

import { useEffect, useState } from "react";
import { landingContent } from "@/lib/content";

type TeamStatus = {
  capacity: number;
  count: number | null;
  isClosed: boolean;
  status: "모집 중" | "모집 마감" | "준비중";
};

type StatusResponse = {
  ok?: boolean;
  teams?: Record<string, TeamStatus>;
};

export default function TeamsPanel() {
  const [teamStatuses, setTeamStatuses] = useState<Record<string, TeamStatus>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      try {
        const response = await fetch("/api/status", { cache: "no-store" });
        const result = (await response.json()) as StatusResponse;

        if (isMounted && result.ok && result.teams) {
          setTeamStatuses(result.teams);
        }
      } catch {
        if (isMounted) {
          setTeamStatuses({});
        }
      }
    }

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="teams-list rv d1">
      {landingContent.teams.map((team) => {
        const status = teamStatuses[team.englishName];
        const isClosed = status?.isClosed ?? false;
        const displayStatus = status?.status ?? team.status;
        const displayCapacity = status ? `${status.capacity}명` : team.capacity;

        return (
          <div className="trow" key={team.name}>
            <div className="tl">
              <span className="team-title-sub">{team.englishName}</span>
              <h3>
                <span className="team-title-main">{team.name}</span>
              </h3>
              <div className="desc">{team.description}</div>
            </div>
            <div className="meta" aria-label={`${team.name} ${displayCapacity} ${displayStatus}`}>
              <span className={isClosed ? "stat-dot is-closed" : "stat-dot"} />
              {displayCapacity} · {displayStatus}
            </div>
          </div>
        );
      })}
    </div>
  );
}
