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

export const getPONumber = (date: Date) => {
  const year = getYear(date);
  return `MKP${year}PO`;
};
export const getGRNNumber = (date: Date) => {
  const year = getYear(date);
  return `MKP${year}GRN`;
};

const ApprovalStatusText: Record<number, string> = {
  // 0: "Pending",
  0: "Approved",
  1: "Disapproved",
};

export const getApprovalStatusText = (index: number | string) => {
  const ind = typeof index === "string" ? Number(index) : index;
  return ApprovalStatusText[ind];
};

const POStatusText: Record<number, string> = {
  0: "Open",
  1: "Closed",
};
export const getPOStatusText = (index: number) => POStatusText[index];

export const SHIFT = ["A", "B"];

export const SHIFT_MAP = { A: "A", B: "B" };

export const isValidShift = (shift: "A" | "B") => !!SHIFT_MAP[shift];
