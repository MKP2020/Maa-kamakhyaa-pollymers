import {
  TCategory,
  TInventoryFull,
  TVendors,
  departments,
  fabrics,
  grns,
  indentItems,
  indents,
  purchaseOrderItems,
  purchaseOrders,
  tableList,
} from "./schema";

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

export type TFabric = typeof fabrics.$inferSelect;

export type TNewFabric = typeof fabrics.$inferInsert;

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
  items: TPurchaseOrderItem[];
  seller: TVendors;
};

export type TNewGRN = typeof grns.$inferInsert;

export type TGRN = typeof grns.$inferSelect;

export type TGRNFull = TGRN & {
  items: TInventoryFull[];
};
