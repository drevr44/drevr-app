import React,
{
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

/* ================= Types ================= */

export type TripType = "one_way" | "round_trip";

export type VehicleCategory =
  | "اقتصادي"
  | "سيدان"
  | "SUV"
  | "فان";

export type DailyStatus =
  | "PENDING"
  | "COMPLETED"
  | "NO_SHOW"
  | "CANCELLED";

export type DailyLog = {
  dayNumber: number;
  date?: string;
  status: DailyStatus;
};

export type DriverInfo = {
  id?: string;
  name: string;
  rating: number;
  car: string;
  model: string;
  plate: string;
  avatar: string;
};

export type BookingDraft = {
  from?: string;
  to?: string;
  tripType?: TripType;
  vehicleCategory?: VehicleCategory;
  date?: string;
  days?: number;
  departTime?: string;
  returnTime?: string;
  price?: number;
  driver?: DriverInfo;
  selectedDates?: string[];
  dailyLogs?: DailyLog[];
};

/* ================= Context Types ================= */

type BookingsContextType = {
  draft: BookingDraft | null;
  startDraft: (initial?: BookingDraft) => void;
  updateDraft: (patch: BookingDraft) => void;
  clearDraft: () => void;

  setSelectedDates: (dates: string[]) => void;
  updateDayStatus: (
    dayNumber: number,
    status: DailyStatus
  ) => void;
};

/* ================= Context ================= */

const BookingsContext =
  createContext<BookingsContextType | undefined>(
    undefined
  );

/* ================= Provider ================= */

export function BookingsProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [draft, setDraft] =
    useState<BookingDraft | null>(null);

  const startDraft = (initial?: BookingDraft) => {
    setDraft(initial ?? {});
  };

  const updateDraft = (patch: BookingDraft) => {
    setDraft((prev) => ({
      ...(prev ?? {}),
      ...patch,
    }));
  };

  const clearDraft = () => setDraft(null);

  /* ================= Selected Dates (🔥 FIXED) ================= */

  const setSelectedDates = (dates: string[]) => {

    // ✅ ترتيب الأيام تصاعدي دائماً
    const sorted = [...dates].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // ✅ إعادة بناء dailyLogs دائماً
    const logs: DailyLog[] = sorted.map(
      (date, index) => ({
        dayNumber: index + 1,
        date,
        status: "PENDING",
      })
    );

    setDraft((prev) => ({
      ...(prev ?? {}),
      selectedDates: sorted,
      days: sorted.length,
      date: sorted[0],
      dailyLogs: logs,
    }));
  };

  /* ================= Update Daily Status ================= */

  const updateDayStatus = (
    dayNumber: number,
    status: DailyStatus
  ) => {
    setDraft((prev) => {
      if (!prev?.dailyLogs) return prev;

      const updatedLogs = prev.dailyLogs.map((d) =>
        d.dayNumber === dayNumber
          ? { ...d, status }
          : d
      );

      return {
        ...prev,
        dailyLogs: updatedLogs,
      };
    });
  };

  const value = useMemo(
    () => ({
      draft,
      startDraft,
      updateDraft,
      clearDraft,
      setSelectedDates,
      updateDayStatus,
    }),
    [draft]
  );

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

/* ================= Hook ================= */

export function useBookings() {
  const context = useContext(BookingsContext);
  if (!context)
    throw new Error(
      "useBookings must be used inside BookingsProvider"
    );
  return context;
}