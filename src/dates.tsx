const days = [
  "firstDay",
  "secondDay",
  "thirdDay",
  "fourthDay",
  "fifthDay",
  "sixthDay",
  "seventhDay",
];
const actualDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const baseWeeks = [
  "firstWeek",
  "secondWeek",
  "thirdWeek",
  "fourthWeek",
  "fifthWeek",
  "overlappingWeek",
];
const months = [
  { month: "Jan", days: 31 },
  { month: "Feb", days: 29 },
  { month: "Mar", days: 31 },
  { month: "Apr", days: 30 },
  { month: "May", days: 31 },
  { month: "Jun", days: 30 },
  { month: "Jul", days: 31 },
  { month: "Aug", days: 31 },
  { month: "Sep", days: 30 },
  { month: "Oct", days: 31 },
  { month: "Nov", days: 30 },
  { month: "Dec", days: 31 },
];
function generateCurrentDate() {
  const date = new Date();
  const current = [...String(date).split(" ")].splice(0, 6).map(String);
  // const current = ["Sun", "Jul", "31", "2024", "16:11:00", "GMT+05:30"];
  //
  return { current };
}
export { days, baseWeeks, actualDays, months, generateCurrentDate };
