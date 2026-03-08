import { useEffect, useState } from "react";

type DayStatusKey =
  | "common.goodMorning"
  | "common.goodAfternoon"
  | "common.goodEvening";

export const DayStatusSVG: Record<DayStatusKey, string> = {
  "common.goodMorning": "sun",
  "common.goodAfternoon": "cloud",
  "common.goodEvening": "moon",
};

const getDayStatus = (): DayStatusKey => {
  const hour = new Date().getHours();
  if (hour < 12) return "common.goodMorning";
  if (hour < 18) return "common.goodAfternoon";
  return "common.goodEvening";
};

const getNextChangeTime = (): number => {
  const now = new Date();
  const hour = now.getHours();
  const nextChange = new Date(now);

  if (hour < 12) {
    nextChange.setHours(12, 0, 0, 0);
  } else if (hour < 18) {
    nextChange.setHours(18, 0, 0, 0);
  } else {
    nextChange.setDate(now.getDate() + 1);
    nextChange.setHours(0, 0, 0, 0);
  }

  return nextChange.getTime() - now.getTime();
};

export const useDayStatus = (): DayStatusKey => {
  const [dayStatus, setDayStatus] = useState<DayStatusKey>(getDayStatus());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDayStatus(getDayStatus());
    }, getNextChangeTime());

    return () => clearTimeout(timeout);
  }, []);
  return dayStatus;
};
