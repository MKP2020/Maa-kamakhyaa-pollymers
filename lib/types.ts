import {
  TCategory,
  TInventoryFull,
  TQuantity,
  TVendors,
  TVendorsFull,
  departments,
  grns,
  indentItems,
  indents,
  purchaseOrderItems,
  purchaseOrders,
  tableList,
} from "./schema";
import { grades } from "./schemas/grades";

export type TParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
  params: {
    [key: string]: string | undefined;
  };
};

export type TTableList = typeof tableList.$inferSelect;

export type TDepartment = typeof departments.$inferSelect;

export type TNewDepartment = typeof departments.$inferInsert;

export type TGrade = typeof grades.$inferSelect;

export type TGradeWithQuantity = TGrade & {
  quantity: TQuantity | null;
};

export type TNewGrade = typeof grades.$inferInsert;

export type TIndentItem = typeof indentItems.$inferSelect;

export type TIndentItemFull = TIndentItem & {
  item: TTableList;
  indent: TIndent;
};

export type TNewIndentItem = typeof indentItems.$inferInsert;

export type TIndent = typeof indents.$inferSelect & {
  items: (TIndentItem & {
    item: TTableList;
  })[];
  department: TDepartment;
  category: TCategory;
};

export type TNewIndent = typeof indents.$inferInsert;

export type TNewPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;

export type TPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;

export type TPurchaseOrderItemFull = TPurchaseOrderItem & {
  item: TIndentItemFull;
};

export type TNewPurchaseOrder = typeof purchaseOrders.$inferInsert;

export type TPurchaseOrder = typeof purchaseOrders.$inferSelect & {
  vendor: TVendors;
  items: TPurchaseOrderItemFull[];
  seller: TVendorsFull;
  indent: TIndent;
};

export type TNewGRN = typeof grns.$inferInsert;

export type TGRN = typeof grns.$inferSelect;

export type TGRNFull = TGRN & {
  items: TInventoryFull[];
  po: TPurchaseOrder;
};
