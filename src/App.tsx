import month from "./future";
import { baseWeeks, days, actualDays, generateCurrentDate } from "./dates";
import "./App.css";
import { useEffect } from "react";
import { useCalendar, CalendarAction } from "./calendarContext";

let exportingIndex: {
  week: { date: number; day: string; dayIndex: number }[];
  weekIndex: string;
}[];
const { current } = generateCurrentDate();

function App() {
  const { state, dispatch } = useCalendar();
  const handleDispatch = (
    weekIndex: number,
    currentDay: string,
    currenta: string[],
    generateNewMonth: boolean
  ) => {
    const actionType: CalendarAction["type"] = generateNewMonth
      ? "CONSTRUCT_NEW_MONTH"
      : "CONSTRUCT_CALENDAR";
    dispatch({
      type: actionType,
      payload: {
        weekIndex,
        currentDay,
        currenta,
      },
    });
  };
  useEffect(() => {
    baseWeeks.forEach((_, weekIndex) => {
      days.forEach((_, dayIndex) => {
        handleDispatch(weekIndex, actualDays[dayIndex], current, false);
      });
    });
  }, []);

  function toggleMonth(adjective: string) {
    let contextualMonth;
    state.previousMonth != undefined
      ? (contextualMonth = state.presentDay)
      : (contextualMonth = current);
    exportingIndex = state.month;

    const [day, monthInCalendar, date, weekIndex] = month(
      adjective,
      contextualMonth,
      exportingIndex
    );
    handleDispatch(
      Number(weekIndex),
      String(day),
      [day, monthInCalendar, date].map(String),
      true
    );
  }
  function extractDate(
    monthState: {
      month: {
        week: { date: number; day: string; dayIndex: number }[];
        weekIndex: string;
      }[];
    },
    dayIndex: number,
    weekIndex: number
  ) {
    for (let i = 0; i < actualDays.length; i++) {
      if (dayIndex == monthState.month[weekIndex]?.week[i]?.dayIndex) {
        return monthState.month[weekIndex].week[i].date;
      }
    }
  }
  return (
    <div className="App">
      <div className="navBar">
        <div className="currentDay">{state.presentDay[0]}</div>
        <div className="currentDate">{state.presentDay[2]}</div>
        <div className="currentMonth">{state.presentDay[1]}</div>
        <button
          className="prev"
          onClick={() => {
            toggleMonth("previous");
          }}
        >
          Prev
        </button>
        <button className="next" onClick={() => toggleMonth("next")}>
          Next
        </button>
      </div>
      <div className="calendarDates">
        <div id="dayColumn">
          {actualDays.map((day, index) => (
            <div key={index} id={day}>
              {day}
            </div>
          ))}
        </div>

        {baseWeeks.map((week, weekIndex) => (
          <div key={weekIndex} id={week} className="week">
            {days.map((day, dayIndex) => (
              <div key={dayIndex} className={`${day} ${actualDays[dayIndex]}`}>
                {extractDate(state, dayIndex, weekIndex)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
