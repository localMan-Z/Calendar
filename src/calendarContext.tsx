import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { baseWeeks, months, actualDays } from "./dates";

interface Calendar {
  initialDay: string[];
  presentDay: string[];
  month: {
    week: { date: number; day: string; dayIndex: number }[];
    weekIndex: string;
  }[];
  previousMonth: object;
}
interface QueriedMonth {
  month: {
    week: { date: number; day: string; dayIndex: number }[];
    weekIndex: string;
  }[];
}
interface constructCalendar {
  type: "CONSTRUCT_CALENDAR";
  payload: {
    weekIndex: number;
    currentDay: string;
    currenta: string[];
  };
}

interface constructNewMonth {
  type: "CONSTRUCT_NEW_MONTH";
  payload: {
    weekIndex: number;
    currentDay: string;
    currenta: string[];
  };
}

interface constructQueriedMonth {
  type: "CONSTRUCT_QUERIED_MONTH";
  payload: {
    currenta: string[];
  };
}

const calendar: Calendar = {
  initialDay: [],
  presentDay: [],
  month: [],
  previousMonth: {},
};
const queriedMonth: QueriedMonth = {
  month: [],
};
function calendarReducer(state: Calendar, action: CalendarAction): Calendar {
  let newMonth;

  switch (action.type) {
    case "CONSTRUCT_CALENDAR":
      newMonth = constructCalendar(action.payload.currenta);

      return {
        initialDay: action.payload.currenta,
        presentDay: action.payload.currenta,
        month: newMonth,
        previousMonth: {},
      };

    case "CONSTRUCT_NEW_MONTH":
      newMonth = constructCalendar(action.payload.currenta);
      return {
        initialDay: state.initialDay,
        presentDay: alignDates(
          state.initialDay,
          newMonth,
          action.payload.currenta
        ),
        month: newMonth,
        previousMonth: state.month,
      };

    default:
      return state;
  }
}

function alternateReducer(
  state: QueriedMonth,
  action: CalendarAction
): QueriedMonth {
  let month;
  switch (action.type) {
    case "CONSTRUCT_QUERIED_MONTH":
      month = constructCalendar(action.payload.currenta);

      return {
        month: month,
      };
    default:
      return state;
  }
}
function constructCalendar(
  // _weekIndex: number,
  // _currentDay: string,
  currenta: string[]
) {
  let week = assignDates(currenta, false);
  const cWeek = week.week;
  let month = [];
  month.push(cWeek);
  const availableWeeks = Math.ceil(
    (Number(week.week[week.week.length - 1].date) - 7) / 7
  );

  for (let i = 0; i <= availableWeeks; i++) {
    const date =
      week.baseIndex < 6
        ? week.week[week.week.length - 1].date - week.baseIndex - 1
        : week.week[week.week.length - 1].date - 7;
    const day = week.baseIndex < 6 ? "Sun" : week.dayOfTheWeek;
    const current = [day, week.month, date];
    const intermediateWeek = assignDates(current.map(String), true);
    const a = intermediateWeek.week;
    month.push(a);
    week = intermediateWeek;
  }
  month = month
    .filter((week) => week.length != 0)
    .reverse()
    .map((week, weekIndex) => {
      return {
        week,
        weekIndex: baseWeeks[weekIndex],
      };
    });
  return month;
}

function assignDates(currenta: string[], lastDayGenerated: boolean) {
  function remainingDays() {
    let windowOfAvailableDays, days;
    for (const month of months) {
      if (month.month == currenta[1]) {
        days = month.days;
        windowOfAvailableDays = Number(days) - Number(currenta[2]);
      }
    }
    return { days, windowOfAvailableDays };
  }
  const days = !lastDayGenerated ? remainingDays().days : currenta[2];
  let baseIndex = actualDays.indexOf(currenta[0]);
  let workingDate = Number(currenta[2]);
  while (workingDate < Number(days)) {
    workingDate += 1;
    baseIndex == 6 ? (baseIndex = 0) : (baseIndex += 1);
  }
  const lastDay = actualDays[baseIndex];

  const currentWeekData = Array.from({ length: 7 }, (_, i) => {
    return {
      date: Number(days) - i,
      day: actualDays[baseIndex - i],
      dayIndex: actualDays.indexOf(actualDays[baseIndex - i]),
    };
  })
    .filter((days) => days.date >= 1)
    .filter((days) => days.day != undefined)
    .reverse();
  return {
    baseIndex,
    dayOfTheWeek: lastDay,
    month: currenta[1],
    week: currentWeekData,
  };
}

function alignDates(
  initialDay: string[],
  currentMonth: {
    week: { date: number; day: string; dayIndex: number }[];
    weekIndex: string;
  }[],
  currenta: string[]
) {
  const day: string[] = [];
  for (const week of currentMonth) {
    for (let i = 0; i < week.week.length; i++) {
      if (Number(initialDay[2]) == week.week[i].date) {
        day.push(week.week[i].day, currenta[1], String(week.week[i].date));
        return day;
      }
    }
  }
}

const calendarContext = createContext<{
  state: Calendar;
  dispatch: React.Dispatch<CalendarAction>;
}>({
  state: calendar,
  dispatch: () => undefined,
});

const newMonthContext = createContext<{
  altState: QueriedMonth;
  altDispatch: React.Dispatch<CalendarAction>;
}>({
  altState: queriedMonth,
  altDispatch: () => undefined,
});

export type CalendarAction =
  | constructCalendar
  | constructNewMonth
  | constructQueriedMonth;

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(calendarReducer, calendar);
  const [altState, altDispatch] = useReducer(alternateReducer, queriedMonth);
  return (
    <calendarContext.Provider value={{ state, dispatch }}>
      <newMonthContext.Provider value={{ altState, altDispatch }}>
        {children}
      </newMonthContext.Provider>
    </calendarContext.Provider>
  );
};

export const useCalendar = () => useContext(calendarContext);
export const useQuery = () => useContext(newMonthContext);
