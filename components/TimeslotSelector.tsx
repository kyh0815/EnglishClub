"use client";

import { useMemo, useState } from "react";

const timeslots = [
  {
    id: "tue-evening",
    day: "Tue",
    time: "19:30",
    title: "Tuesday Evening",
    description: "퇴근 후 가볍게 참여하기 좋은 저녁 시간"
  },
  {
    id: "thu-evening",
    day: "Thu",
    time: "19:30",
    title: "Thursday Evening",
    description: "주중 흐름을 이어가기 좋은 평일 저녁"
  },
  {
    id: "sat-morning",
    day: "Sat",
    time: "10:30",
    title: "Saturday Morning",
    description: "주말을 영어 대화로 시작하는 오전 시간"
  },
  {
    id: "sat-afternoon",
    day: "Sat",
    time: "14:00",
    title: "Saturday Afternoon",
    description: "점심 이후 여유롭게 참여할 수 있는 시간"
  }
];

export default function TimeslotSelector() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedSlots = useMemo(
    () => timeslots.filter((slot) => selectedIds.includes(slot.id)),
    [selectedIds]
  );

  function toggleSlot(slotId: string) {
    setSelectedIds((current) =>
      current.includes(slotId)
        ? current.filter((id) => id !== slotId)
        : [...current, slotId]
    );
  }

  return (
    <div className="timeslot-panel rv d1">
      <div className="timeslot-grid" aria-label="참여 가능한 시간표">
        {timeslots.map((slot) => {
          const isSelected = selectedIds.includes(slot.id);

          return (
            <button
              type="button"
              className={isSelected ? "timeslot-card is-selected" : "timeslot-card"}
              aria-pressed={isSelected}
              key={slot.id}
              onClick={() => toggleSlot(slot.id)}
            >
              <span className="timeslot-kicker">{slot.day}</span>
              <strong>{slot.time}</strong>
              <span className="timeslot-title">{slot.title}</span>
              <span className="timeslot-desc">{slot.description}</span>
            </button>
          );
        })}
      </div>
      <div className="timeslot-summary" aria-live="polite">
        {selectedSlots.length > 0 ? (
          <>
            <span>선택한 시간</span>
            <div className="timeslot-chips">
              {selectedSlots.map((slot) => (
                <span key={slot.id}>
                  {slot.day} {slot.time}
                </span>
              ))}
            </div>
          </>
        ) : (
          <span>가능한 시간을 하나 이상 선택해보세요.</span>
        )}
      </div>
    </div>
  );
}
