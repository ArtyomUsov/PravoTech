export enum Priority {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2',
  P3 = 'P3',
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  [Priority.P0]: 0,
  [Priority.P1]: 1,
  [Priority.P2]: 2,
  [Priority.P3]: 3,
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.P0]: 'Критично',
  [Priority.P1]: 'Срочно',
  [Priority.P2]: 'Планово',
  [Priority.P3]: 'Инфо',
}