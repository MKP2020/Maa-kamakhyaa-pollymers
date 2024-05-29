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

export const RP_TYPE = [
  "Algo Production",
  "RP Mix 1st Production",
  "RP Mix 2nd Production",
  "RP Black(Tape) 1st Production",
  "RP Black(Lam) 1st Production",
  "RP Black(Tape) 2nd Production",
  "RP Black(Lam) 2nd Production",
];

export const RP_TYPE_OBJ: Record<string, number> = {
  "Algo Production": 0,
  "RP Mix 1st Production": 1,
  "RP Mix 2nd Production": 2,
  "RP Black(Tape) 1st Production": 3,
  "RP Black(Lam) 1st Production": 4,
  "RP Black(Tape) 2nd Production": 5,
  "RP Black(Lam) 2nd Production": 6,
};

export const RP_CONSUMED_TYPE_OBJ: Record<string, number> = {
  "0": 10,
  "1": 11,
  "2": 12,
  "3": 23,
  "4": 24,
  "5": 25,
  "6": 26,
};

export const RP_CONSUMED_Table_TITLE: Record<string, string> = {
  "0": "Bhusa Consumed",
  "1": "Agglo Consumed",
  "2": "RP Mix 1st Consumed (Num)",
  "3": "RP Black(Tape) 1st Produced (Num - Kg)",
  "4": "Plant Waste Consumed",
  "5": "RP Black(Tape) 1st Consumed",
  "6": "RP Black(Lam) 1st Consumed",
};

export const RP_PRODUCED_Table_TITLE: Record<string, string> = {
  "0": "Agglo Produced (Num)",
  "1": "RP Mix 1st Produced (Num - Kg)",
  "2": "RP Mix 2nd Produced (Num - Kg)",
  "3": "RP Black(Tape) 1st Produced (Num - Kg)",
  "4": "RP Black(Lam) 1st Produced (Num - Kg)",
  "5": "RP Black(Tape) 2nd Produced (Num - Kg)",
  "6": "RP Black(Lam) 2nd Produced (Num - Kg)",
};

export const RP_PRODUCED_TYPE_OBJ: Record<string, number> = {
  "0": 11,
  "1": 12,
  "2": 23,
  "3": 24,
  "4": 25,
  "5": 26,
  "6": 27,
};

export type TGlobalQuantityType =
  | "Bhusha"
  | "Algo"
  | "RP_Mix_1st"
  | "RP_Mix_2nd"
  | "RP_Black(Tape)_1st"
  | "RP_Black(Lam)_1st"
  | "RP_Black(Tape)_2nd"
  | "RP_Black(Lam)_2nd";

export const GlobalQuantityObj: Record<TGlobalQuantityType, number> = {
  Bhusha: 10,
  Algo: 11,
  RP_Mix_1st: 12,
  RP_Mix_2nd: 23,
  "RP_Black(Tape)_1st": 24,
  "RP_Black(Lam)_1st": 25,
  "RP_Black(Tape)_2nd": 26,
  "RP_Black(Lam)_2nd": 27,
};

export const getIndexByRPType = (type: string) => RP_TYPE_OBJ[type];

export const SHIFT_MAP = { A: "A", B: "B" };

export const isValidShift = (shift: "A" | "B") => !!SHIFT_MAP[shift];

export const getIdForType = (type: TGlobalQuantityType) =>
  GlobalQuantityObj[type];

export const getRpPreviousConsumedId = (type: string) =>
  RP_CONSUMED_TYPE_OBJ[type];

export const getRpProducedId = (type: string) => RP_PRODUCED_TYPE_OBJ[type];
