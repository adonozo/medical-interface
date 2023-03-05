export const timingToString = (timing: string): string => {
  switch (timing) {
    case 'ACM':
      return $localize`before breakfast`;
    case 'CM':
      return $localize`at breakfast`;
    case 'PCM':
      return $localize`after breakfast`;
    case 'ACD':
      return $localize`before lunch`;
    case 'CD':
      return $localize`at lunch`;
    case 'PCD':
      return $localize`after lunch`;
    case 'ACV':
      return $localize`before dinner`;
    case 'CV':
      return $localize`at dinner`;
    case 'PCV':
      return $localize`after dinner`;
    case 'AC':
      return $localize`before meal`;
    case 'C':
      return $localize`with meal`;
    case 'PC':
      return $localize`after meal`;
    default:
      return timing;
  }
}

export function getDateOrDefault(stringDate: string): Date {
  try {
    return new Date(stringDate);
  }
  catch (Exception) {
    return new Date();
  }
}

export function getDefaultDateFrom(time: string): Date {
  const [hour, minutes] = time.split(':');
  const currentDate = new Date();
  currentDate.setHours(+hour, +minutes);
  return currentDate;
}

export const selectedFilter = (daySelected: { day: boolean }): any[] =>
  Object.entries(daySelected)
    .filter(([, isSelected]) => isSelected)
    .map(([day]) => day);
