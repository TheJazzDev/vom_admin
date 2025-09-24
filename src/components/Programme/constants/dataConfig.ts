export interface DayConfig {
  label: string;
  placeholder: string;
  helpText: string;
  dayNumber?: number | number[];
  badgeText: string;
  badgeColor: string;
}

export const DAY_CONFIGS: Record<DayType, DayConfig> = {
  sunday: {
    label: "Date (Sundays Only)",
    placeholder: "Pick a Sunday",
    helpText: "Only Sundays are available for selection",
    dayNumber: 0,
    badgeText: "Sunday",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  monday: {
    label: "Date (Mondays Only)",
    placeholder: "Pick a Monday",
    helpText: "Only Mondays are available for selection",
    dayNumber: 1,
    badgeText: "Monday",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  tuesday: {
    label: "Date (Tuesdays Only)",
    placeholder: "Pick a Tuesday",
    helpText: "Only Tuesdays are available for selection",
    dayNumber: 2,
    badgeText: "Tuesday",
    badgeColor: "bg-cyan-100 text-cyan-700",
  },
  wednesday: {
    label: "Date (Wednesdays Only)",
    placeholder: "Pick a Wednesday",
    helpText: "Only Wednesdays are available for selection",
    dayNumber: 3,
    badgeText: "Wednesday",
    badgeColor: "bg-green-100 text-green-700",
  },
  thursday: {
    label: "Date (Thursdays Only)",
    placeholder: "Pick a Thursday",
    helpText: "Only Thursdays are available for selection",
    dayNumber: 4,
    badgeText: "Thursday",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  friday: {
    label: "Date (Fridays Only)",
    placeholder: "Pick a Friday",
    helpText: "Only Fridays are available for selection",
    dayNumber: 5,
    badgeText: "Friday",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  saturday: {
    label: "Date (Saturdays Only)",
    placeholder: "Pick a Saturday",
    helpText: "Only Saturdays are available for selection",
    dayNumber: 6,
    badgeText: "Saturday",
    badgeColor: "bg-purple-100 text-purple-700",
  },
  weekday: {
    label: "Date (Weekdays Only)",
    placeholder: "Pick a weekday",
    helpText: "Only Monday through Friday are available",
    dayNumber: [1, 2, 3, 4, 5],
    badgeText: "Weekday",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  weekend: {
    label: "Date (Weekends Only)",
    placeholder: "Pick a weekend",
    helpText: "Only Saturday and Sunday are available",
    dayNumber: [0, 6],
    badgeText: "Weekend",
    badgeColor: "bg-rose-100 text-rose-700",
  },
  any: {
    label: "Date",
    placeholder: "Pick a date",
    helpText: "Select any date",
    badgeText: "Any Day",
    badgeColor: "bg-gray-100 text-gray-700",
  },
};
