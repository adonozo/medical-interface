import { DayCode, TimeCode } from "../../../../@core/models/types";

export type WeeklyTimingsControl = { [day in DayCode]: TimesControl }

export type TimesControl = { [time in TimeCode] : boolean }
