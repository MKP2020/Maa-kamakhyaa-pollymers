import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getYear } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIndentNumber = (date: Date) => {
  const year = getYear(date);
  return `MKP${year}IN`;
};

const ApprovalStatusText: Record<number, string> = {
  0: "Pending",
  1: "Approved",
  2: "Disapproved",
};

export const getApprovalStatusText = (index: number) =>
  ApprovalStatusText[index];

const POStatusText: Record<number, string> = {
  0: "Open",
  1: "Closed",
};
export const getPOStatusText = (index: number) => POStatusText[index];
