export const getStartDate = (date: string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  // Create a UTC midnight by using UTC setters, not local setHours
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  );
};

export const getEndDate = (date: string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  // Create a UTC midnight by using UTC setters, not local setHours
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
};
