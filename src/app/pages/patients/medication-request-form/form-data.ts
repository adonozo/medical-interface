export enum FrequencyFormData {
  timesPerDay = 0,
  mealTime = 1,
  specificTimes = 2
}

export enum DailyFrequencyFormData {
  everyday = 0,
  specificDays = 1,
}

export enum DurationFormData {
  duration = 0,
  period = 1,
  untilNext = 2
}

export const DayOfWeek = [
  {
    name: 'Monday',
    value: 'mon',
    selected: false
  },
  {
    name: 'Tuesday',
    value: 'tue',
    selected: false
  },
  {
    name: 'Wednesday',
    value: 'wed',
    selected: false
  },
  {
    name: 'Thursday',
    value: 'thu',
    selected: false
  },
  {
    name: 'Friday',
    value: 'fri',
    selected: false
  },
  {
    name: 'Saturday',
    value: 'sat',
    selected: false
  },
  {
    name: 'Sunday',
    value: 'sun',
    selected: false
  },
]

export const TimeOfDay = [
  {
    name: 'Before breakfast',
    value: 'ACM',
    selected: false
  },
  {
    name: 'At breakfast',
    value: 'CM',
    selected: false
  },
  {
    name: 'After breakfast',
    value: 'PCM',
    selected: false
  },
  {
    name: 'Before lunch',
    value: 'ACD',
    selected: false
  },
  {
    name: 'At lunch',
    value: 'CD',
    selected: false
  },
  {
    name: 'After lunch',
    value: 'PCD',
    selected: false
  },
  {
    name: 'Before dinner',
    value: 'ACV',
    selected: false
  },
  {
    name: 'At dinner',
    value: 'CV',
    selected: false
  },
  {
    name: 'After dinner',
    value: 'PCV',
    selected: false
  },
]

