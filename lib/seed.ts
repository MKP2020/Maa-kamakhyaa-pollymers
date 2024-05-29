// import { createCategory } from "@/actions/category";

import { createQuantity } from "@/actions/quantity";
import { quantity } from "./schemas/quantity";

// const categoriesData = [
//   "Raw Material",
//   "Packing Material",
//   "Consumables",
//   "Capital Goods",
//   "General Stores",
// ];

const quantityData = [
  "bhusa",
  "algo",
  "rap",
  "Mix 1st",
  "Mix 2nd",
  "Tape 1st",
  "Lam 1st",
  "Tape 2nd",
  "Lam 2nd",
];
const createDefaultTables = async () => {
  //   console.log("==================");
  //   console.log("Creating Categories");
  //   console.log("==================");
  //   for (let index = 0; index < categoriesData.length; index++) {
  //     const element = categoriesData[index];
  //     await createCategory(element);
  //   }
  //   console.log("==================");
  //   console.log("Categories Created");
  //   console.log("==================");
  console.log("==================");
  console.log("Creating Globals");
  console.log("==================");

  for (let index = 0; index < quantityData.length; index++) {
    const element = quantityData[index];
    await createQuantity(index);
  }
  console.log("==================");
  console.log("Globals Created");
  console.log("==================");
};

createDefaultTables();
