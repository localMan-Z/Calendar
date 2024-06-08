import { useState } from "react";
import { months, generateCurrentDate } from "./dates";
import { useCalendar } from "./calendarContext";
export default function Dates() {
  const { state } = useCalendar();
  const [truncatedDate, setDate] = useState(0);
  let [completeDate, setCompleteDate] = useState("");

  function parseInput(event) {
    let input = event.target.value;
    const dateRegex = new RegExp(/[/][0-9]{1,2}/, "g");

    if (input.length == 2) {
      Number(input) >= 12 ? (input = `12/`) : (input = `${input}/`);
      const date =
        months[Number(input.substring(0, input.length - 1)) - 1].days;
      setDate(date);
    } else if (input.length == 5) {
      let dayOfTheMonth = Number(input.match(dateRegex)[0].substring(1));
      dayOfTheMonth >= truncatedDate
        ? (dayOfTheMonth = truncatedDate)
        : (dayOfTheMonth = Number(dayOfTheMonth));
      input = `${input.substring(0, 3)}${dayOfTheMonth}/`;
    } else if (input.length >= 10) {
      input = input.slice(0, 10);
      completeDate = input;
      setCompleteDate(completeDate);
      searchForTheDay();
    }
    return input;
  }

  function searchForTheDay() {
    const { current } = generateCurrentDate();
    let yearGap =
      Number(current[3]) > Number(completeDate.substring(6))
        ? Number(current[3]) - Number(completeDate.substring(6))
        : Number(completeDate.substring(6)) - Number(current[3]);

    let lastDayIndex =
      state.month[state.month.length - 1].week[
        state.month[state.month.length - 1].week.length - 1
      ].dayIndex;
    while (yearGap > 0) {
      if (lastDayIndex == 6) {
        lastDayIndex = 0;
      } else {
        lastDayIndex += 1;
      }
      yearGap -= 1;
    }
    console.log(lastDayIndex);
  }
  return {
    parseInput,
  };
}
