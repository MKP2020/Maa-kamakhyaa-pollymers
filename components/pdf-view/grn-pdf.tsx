import { TGRNFull } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { useEffect, useRef } from "react";
import { generateIndentPdf } from "@/lib/generate-pdf/indent";
import { format } from "date-fns";
import { Span } from "next/dist/trace";

type TGRNPdfProps = {
  data: TGRNFull;
  visible: boolean;
  onClose: () => void;
};

export default function GRNPdf(props: TGRNPdfProps) {
  const { data, visible, onClose } = props;
  const ref = useRef(null);

  useEffect(() => {
    // if (visible) {
    //   const interval = setInterval(async () => {
    //     const element = document.querySelector("#grn-pdf");
    //     if (!element) {
    //       return;
    //     }
    //     clearInterval(interval);
    //     await generateIndentPdf(ref, data.grnNumber);
    //     onClose();
    //   }, 1000);
    //   return () => {
    //     if (interval) {
    //       clearInterval(interval);
    //     }
    //   };
    // }
  }, [visible, data.grnNumber, onClose]);

  return (
    <Dialog
      onOpenChange={(open) => {
        onClose();
      }}
      open={visible}
    >
      <DialogContent className="w-[100%] max-w-[1080px] h-[300px] max-h-[80vh] text-black">
        <div
          ref={ref}
          id="indent-pdf"
          className="flex-1 bg-white py-8 text-black"
        >
          <div className="container mx-auto p-5 box-border">
            <div className="text-center text-xl font-bold mb-4">
              MAA KAMAKHYAA POLLYMERS
              <br />
              <span className="text-lg">MATERIAL RECEIPT NOTE</span>
            </div>
            <div className="text-right text-base mb-2">No: 896</div>
            <div className="flex flex-1 w-full gap-2 pb-8 border border-black">
              <div className="flex-[0.7] p-2">
                <span className="font-bold">
                  Supplier's Name and Address (Code)
                </span>
                <br />
                <span>{data.poId}</span>
                <span>
                  {data.po.seller.name}
                  <br />
                  {data.po.seller.address.addressLine1}
                  <br />
                  {data.po.seller.address.addressLine2}
                  <br />
                  {data.po.seller.address.district},
                  {data.po.seller.address.city},<br />
                  {data.po.seller.address.state},
                  {data.po.seller.address.pinCode},
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-1 mb-2 gap-2">
                  <div className="flex-1 flex">
                    <span className="font-bold flex-1 text-sm">
                      MRN No:{" "}
                      <span className="font-normal text-sm">
                        {data.grnNumber}
                      </span>
                    </span>
                    <span className="font-bold text-sm">
                      Dt:{" "}
                      <span className="font-normal text-sm">
                        {format(data.receivedDate, "dd/MM/yyyy")}
                      </span>
                    </span>
                  </div>
                  <div className="flex-1 flex">
                    <span className="font-bold flex-1 text-sm">
                      Mlt. Entry Slip No.{" "}
                      <span className="font-normal text-sm">
                        {data.cnNumber}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex mb-2 gap-2">
                  <div className="flex-1">
                    <div className="flex-1 flex gap-2">
                      <span className="font-bold flex-1 text-sm">
                        Indent No.{" "}
                        <span className="font-normal text-sm">
                          {data.po.indent.indentNumber}
                        </span>
                      </span>
                      <span className="font-bold text-sm">
                        Dt:{" "}
                        <span className="font-normal text-sm">
                          {format(data.po.indent.date, "dd/MM/yyyy")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Indenting Dept </span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="flex-1">
                    <span className="font-bold">Purchase Order No. </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Dt. </span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="flex-1">
                    <span className="font-bold">Challan No. </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Dt. </span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="flex-1">
                    <span className="font-bold">L R No. </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Dt. </span>
                  </div>
                </div>
                <div className="flex mb-2">
                  <div className="flex-1">
                    <span className="font-bold">Vehicle No. </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Slip No. </span>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <span className="font-bold">Transporters Name </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold">Weightment Slip No. </span>
                  </div>
                </div>
              </div>
            </div>

            <table className="w-full border-collapse mb-5">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-black p-2">Sl. No.</th>
                  <th className="border border-black p-2">
                    Description of Materials
                  </th>
                  <th className="border border-black p-2">Item Code</th>
                  <th className="border border-black p-2">Unit</th>
                  <th className="border border-black p-2">Quantity Recorded</th>
                  <th className="border border-black p-2">Quantity Rejected</th>
                  <th className="border border-black p-2">Quantity Accepted</th>
                  <th className="border border-black p-2">Value in Rs.</th>
                  <th className="border border-black p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2">{index + 1}</td>
                    <td className="border border-black p-2">
                      {item.item.name}
                    </td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2">
                      {item.item.unit}
                    </td>
                    <td className="border border-black p-2">
                      {item.inStockQuantity}
                    </td>
                    <td className="border border-black p-2">
                      {item.poItem.item.indentedQty -
                        (item.poItem.item.approvedQty || 0)}
                    </td>
                    <td className="border border-black p-2">
                      {item.poItem.item.approvedQty || 0}
                    </td>
                    <td className="border border-black p-2">
                      {item.poItem.price}
                    </td>
                    <td className="border border-black p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between mb-5">
              <div>GST Invoice Received: YES / No</div>
              <div>RG 23A/C Part-II Entry No.:</div>
              <div>Dt.:</div>
              <div>Rejection Note No.:</div>
            </div>

            <div className="flex justify-between">
              <div className="flex-1 text-center">Prepared By</div>
              <div className="flex-1 text-center">Checked By</div>
              <div className="flex-1 text-center">
                Materials Inspected & Approved By
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
