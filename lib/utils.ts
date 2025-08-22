import { ClassValue, clsx } from "clsx";
import { getYear } from "date-fns";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { User } from "@clerk/nextjs/server";

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

export enum GRADES_TYPES {
  Fabric,
  Tape,
  LaminatedFabric,
  Tarpaulin,
}

const ApprovalStatusText: Record<number, string> = {
  0: "Approved",
  1: "Disapproved",
  2: "Pending",
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
  "0": 33,
  "1": 34,
  "2": 35,
  "3": 36,
  "4": 37,
  "5": 38,
  "6": 39,
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
  "0": 34,
  "1": 35,
  "2": 36,
  "3": 37,
  "4": 38,
  "5": 39,
  "6": 40,
};

export type TGlobalQuantityType =
  | "Bhusha"
  | "Algo"
  | "RP_Mix_1st"
  | "RP_Mix_2nd"
  | "RP_Black(Tape)_1st"
  | "RP_Black(Lam)_1st"
  | "RP_Black(Tape)_2nd"
  | "RP_Black(Lam)_2nd"
  | "Loom_Waste"
  | "Lam_Waste"
  | "Tape_Waste"
  | "Tarp_Waste"
  | "Loom"
  | "Lam"
  | "Tape"
  | "Tarp"
  | "TapeLumps";

export const GlobalQuantityObj: Record<TGlobalQuantityType, number> = {
  Bhusha: 33,
  Algo: 34,
  RP_Mix_1st: 35,
  RP_Mix_2nd: 36,
  "RP_Black(Tape)_1st": 37,
  "RP_Black(Lam)_1st": 38,
  "RP_Black(Tape)_2nd": 39,
  "RP_Black(Lam)_2nd": 40,
  Loom_Waste: 41,
  Lam_Waste: 42,
  Tape_Waste: 43,
  Tarp_Waste: 44,
  Loom: 45,
  Lam: 46,
  Tape: 47,
  Tarp: 48,
  TapeLumps: 50,
};

export const GlobalQuantityStringObj: Record<number, string> = {
  33: "Bhusha",
  34: "Algo",
  35: "RP Mix 1st",
  36: "RP Mix 2nd",
  37: "RP Black(Tape) 1st",
  38: "RP Black(Lam) 1st",
  39: "RP Black(Tape) 2nd",
  40: "RP Black(Lam) 2nd",
  41: "Loom Waste",
  42: "Lam Waste",
  43: "Tape Waste",
  44: "Tarp Waste",
  45: "Loom",
  46: "Lam",
  47: "Tape",
  48: "Tarp",
  50: "Tape Lumps",
};

export const getIndexByRPType = (type: string) => RP_TYPE_OBJ[type];

export const SHIFT_MAP = { A: "A", B: "B" };

export const isValidShift = (shift: "A" | "B") => !!SHIFT_MAP[shift];

export const getIdForType = (type: TGlobalQuantityType) =>
  GlobalQuantityObj[type];

export const getRpPreviousConsumedId = (type: string) =>
  RP_CONSUMED_TYPE_OBJ[type];

export const getRpProducedId = (type: string) => RP_PRODUCED_TYPE_OBJ[type];

export const GRADES = [0, 1, 2, 3];

export const GRADE_TYPES: Record<number, string> = {
  0: "Fabric",
  1: "Tape",
  2: "Laminated Fabric",
  3: "Tarpaulin",
};

export enum UserType {
  Super_Admin,
  Admin,
  Employee,
  Manager,
  Head,
}

export const USER_TYPES = [
  "Super Admin",
  "Admin",
  "Employee",
  "Manager",
  "Head",
];

export const AccessMetrics = {
  "0": ["all"],
  "1": ["all"],
  "2": ["table-list", "indent", "po", "grn", "inventory"],
  "3": ["table-list", "indent", "po", "po-approve", "grn", "inventory"],
  "4": ["washing-unit", "rp", "tape-plant", "loom", "lamination", "tarpaulin"],
};

type TAccessPages =
  | "indent"
  | "department"
  | "grade"
  | "category"
  | "user"
  | "vendor"
  | "po"
  | "grn"
  | "po-approve"
  | "table-list"
  | "washing-unit"
  | "rp"
  | "tape-plant"
  | "loom"
  | "lamination"
  | "tarpaulin"
  | "inventory";

export const canAccessPage = (user: User | null, page: TAccessPages) => {
  if (!user) {
    redirect("/sign-in");
  }

  const role = user.publicMetadata.role as 0 | 1 | 2 | 3 | 4;

  const metrics = AccessMetrics[role];

  if (!metrics.includes("all")) {
    if (metrics === undefined) {
      redirect("/sign-in");
    }

    if (!metrics.includes(page)) {
      redirect("/");
    }
  }
};

export function numberToWordsIndian(
  n: number | string,
  options?: {
    // If true, speak fractional digits individually: "Point Three Four"
    spellFractionDigits?: boolean;
    // If provided, format like currency: "Rupees Two Hundred Thirty Four and Paise Thirty Four"
    currency?: { major: string; minor: string }; // e.g., { major: "Rupees", minor: "Paise" }
  }
) {
  const { spellFractionDigits = true, currency } = options || {};

  // Normalize input
  const num = Number(n);
  if (!isFinite(num)) throw new Error("Invalid number");
  if (num === 0) return currency ? `${currency.major} Zero` : "Zero";

  const negative = num < 0;
  const abs = Math.abs(num);

  // Split integer and fractional parts
  const [intStr, fracStrRaw] = abs.toString().split(".");
  const intPart = Number(intStr);
  const fracStr = (fracStrRaw || "").replace(/0+$/, ""); // trim trailing zeros for cleaner wording

  // Core dictionaries
  const lessThan20 = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  // Extendable scales for Indian system
  const scales = ["", "Thousand", "Lakh", "Crore", "Arab", "Kharab"];

  function twoDigits(n: number): string {
    if (n === 0) return "";
    if (n < 20) return lessThan20[n];
    const t = Math.floor(n / 10);
    const r = n % 10;
    return tens[t] + (r ? " " + lessThan20[r] : "");
  }

  function threeDigits(n: number): string {
    if (n === 0) return "";
    if (n < 100) return twoDigits(n);
    const h = Math.floor(n / 100);
    const r = n % 100;
    return lessThan20[h] + " Hundred" + (r ? " " + twoDigits(r) : "");
  }

  // Integer part to words (Indian grouping: 3, then 2-2-2...)
  function intToWordsIndian(n: number): string {
    if (n === 0) return "Zero";

    const parts: number[] = [];
    const last3 = n % 1000;
    parts.push(last3);
    n = Math.floor(n / 1000);

    while (n > 0) {
      parts.push(n % 100); // 2-digit groups
      n = Math.floor(n / 100);
    }

    const words: string[] = [];
    for (let i = parts.length - 1; i >= 0; i--) {
      const chunk = parts[i];
      if (!chunk) continue;

      if (i === 0) {
        words.push(threeDigits(chunk));
      } else {
        const segWord = twoDigits(chunk);
        const scale = scales[i] || ""; // guard for very large numbers
        if (segWord) words.push(scale ? `${segWord} ${scale}` : segWord);
      }
    }

    return words.join(" ").trim();
  }

  const intWords = intToWordsIndian(intPart);

  // Fraction handling
  let result: string;
  if (currency) {
    // Currency phrasing: Major for integer, Minor for fractional (two digits typical for paise)
    const major = `${currency.major} ${intWords}`;
    if (!fracStr) {
      result = major;
    } else {
      // Use up to two digits for currency minor units; pad if needed
      const paise2 = (fracStr + "0").slice(0, 2);
      const paiseNum = Number(paise2);
      const minorWords = intToWordsIndian(paiseNum);
      result = `${major} and ${currency.minor} ${minorWords}`;
    }
  } else {
    // Plain numeric phrasing
    if (!fracStr) {
      result = intWords;
    } else if (spellFractionDigits) {
      const digitWords = fracStr
        .split("")
        .map((d) => lessThan20[Number(d)])
        .join(" ");
      result = `${intWords} Point ${digitWords}`; // e.g., "Two Hundred Thirty Four Point Three Four"
    } else {
      // Speak fractional as a number (not digit-by-digit)
      const fracNum = Number(fracStr);
      const fracWords = intToWordsIndian(fracNum);
      result = `${intWords} Point ${fracWords}`;
    }
  }

  return negative ? `Minus ${result}` : result;
}

export function numberToWords(_num: number) {
  let num = Number(_num.toFixed(0));

  if (num === 0) return "Zero";

  const lessThan20 = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const scales = ["", "Thousand", "Lakh", "Crore"];

  function twoDigits(n: number): string {
    if (n === 0) return "";
    if (n < 20) return lessThan20[n];
    const t = Math.floor(n / 10);
    const r = n % 10;
    return tens[t] + (r ? " " + lessThan20[r] : "");
  }

  function threeDigits(n: number): string {
    if (n === 0) return "";
    if (n < 100) return twoDigits(n);
    const h = Math.floor(n / 100);
    const r = n % 100;
    return lessThan20[h] + " Hundred" + (r ? " " + twoDigits(r) : "");
  }

  // Split number per Indian system: last 3 digits, then groups of 2
  const parts: number[] = [];
  const last3 = num % 1000;
  parts.push(last3);
  num = Math.floor(num / 1000);

  while (num > 0) {
    parts.push(num % 100); // next 2-digit group
    num = Math.floor(num / 100);
  }

  // parts: [units(0-999), thousand(0-99), lakh(0-99), crore(0-99), ...]
  const words: string[] = [];

  for (let i = parts.length - 1; i >= 0; i--) {
    const chunk = parts[i];
    if (!chunk) continue;

    if (i === 0) {
      // units segment (0..999)
      words.push(threeDigits(chunk));
    } else {
      // higher segments are 0..99 (two-digit)
      const segWord = twoDigits(chunk);
      const scale = scales[i] || ""; // guard if number exceeds defined scales
      if (segWord) words.push(segWord + (scale ? " " + scale : ""));
    }
  }

  return words.join(" ").trim();
}
