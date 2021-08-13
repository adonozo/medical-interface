export const timingToString = (timing: string): string => {
  switch (timing) {
    case 'ACM':
      return 'before breakfast';
    case 'CM':
      return 'at breakfast';
    case 'PCM':
      return 'after breakfast';
    case 'ACD':
      return 'before lunch';
    case 'CD':
      return 'at lunch';
    case 'PCD':
      return 'after lunch';
    case 'ACV':
      return 'before dinner';
    case 'CV':
      return 'at dinner';
    case 'PCV':
      return 'after dinner';
    case 'AC':
      return 'before meal';
    case 'C':
      return 'with meal';
    case 'PC':
      return 'after meal';
    default:
      return timing;
  }
}
