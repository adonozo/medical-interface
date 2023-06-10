export type DayCode = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type TimeCode = 'ACM' | 'CM' | 'PCM' | 'ACD' | 'CD' | 'PCD' | 'ACV' | 'CV' | 'PCV' | 'AC' | 'C' | 'PC';

export type TimeCodeExtended = TimeCode | string;

export type NamedKeyBoolean = {
  name: string,
  key: string,
  selected: boolean
}

export type NamedKeyValues = {
  name: string,
  key: string,
  values: NamedKeyBoolean[]
}
