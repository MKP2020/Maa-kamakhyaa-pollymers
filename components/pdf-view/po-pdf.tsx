import { formatInTimeZone } from "date-fns-tz";
import { useEffect, useRef } from "react";

import { generateIndentPdf } from "@/lib/generate-pdf/indent";
import { generatePoPdf } from "@/lib/generate-pdf/po";
import { TPurchaseOrder } from "@/lib/types";
import { numberToWords } from "@/lib/utils";

import { Dialog, DialogContent } from "../ui/dialog";

type TPoPdfProps = {
  data: TPurchaseOrder;
  visible: boolean;
  onClose: () => void;
};

export default function PoPdf(props: TPoPdfProps) {
  const { data, visible, onClose } = props;
  const ref = useRef(null);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(async () => {
        const element = document.querySelector("#po-pdf");
        if (!element && !ref.current) {
          return;
        }
        clearInterval(interval);
        await generatePoPdf(ref, data.poNumber);
        onClose();
      }, 1000);
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [visible, data.poNumber, onClose]);

  if (!visible) return null;

  let totalAmount = 0;

  for (let index = 0; index < data.items.length; index++) {
    const element = data.items[index];

    totalAmount += element.price * (element.item.approvedQty || 0);
  }

  let totalTax = 0;
  if (data.taxType === "IGST") {
    totalTax = (totalAmount * Number(data.igst)) / 100;
  }
  {
    totalTax =
      (totalAmount * Number(data.cgst)) / 100 +
      (totalAmount * Number(data.sgst)) / 100;
  }

  const totalAmountWithTax = totalAmount + totalTax;

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        onClose();
      }}
      open={visible}
    >
      <DialogContent className="w-[100%] max-w-[1080px] h-[300px] max-h-[80vh] text-black">
        <div ref={ref} id="po-pdf" className="flex-1 bg-white py-8 text-black">
          <div className="container mx-auto p-5 border border-black">
            <div className="text-right  mt-2  mb-4">
              <span className="text-red-400">
                GSTIN - {data.seller.gstNumber}
              </span>
            </div>
            <div className="text-center font-bold text-lg mb-2">
              MAA KAMAKHYAA POLYMERS
              <br />
              PURCHASE ORDER
            </div>
            <div className="text-center font-bold text-lg mb-2">
              PARTY / PURCHASE / STORES / ACCOUNTS / H.O. COPY
            </div>

            <table className="w-full mt-5">
              <tr>
                <th className="text-left py-1 w-1/5"></th>
                <td className="w-2/5"></td>
                <th className="text-left py-1 w-1/5">PO No</th>
                <td className="w-1/5">{data.poNumber}</td>
              </tr>
              <tr>
                <th className="text-left py-1">To</th>
                <td className="py-1 capitalize">
                  {data.seller.name}
                  <br />
                  {data.seller.address.addressLine1}
                  <br />
                  {data.seller.address.addressLine2}
                  <br />
                  {data.seller.address.district}, {data.seller.address.city},{" "}
                  {data.seller.address.state}, {data.seller.address.pinCode},
                </td>
                <th className="text-left py-1">Date</th>
                <td className="py-1">
                  {formatInTimeZone(data.date!, "UTC", "dd/MM/yyyy")}
                </td>
              </tr>
              <tr>
                <th className="text-left py-1">Indent No</th>
                <td className="py-1">{data.indent.indentNumber}</td>
                <th className="text-left py-1">GST No</th>
                <td className="py-1">{data.seller.gstNumber}</td>
              </tr>
            </table>
            <p className="mt-5">Dear Sir,</p>
            <p>
              With reference to your offer we are pleased to issue formal
              Purchase Order for the following items as per specification,
              quality, quantity and Terms & Conditions mentioned below -
            </p>
            <table className="w-full border-collapse mt-5">
              <tr>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  Sl. No.
                </th>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  Material Name & Description
                </th>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  UoM
                </th>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  Quantity
                </th>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  Basic
                </th>
                <th className="border border-black bg-gray-200 py-2 px-4">
                  Value (Rs.)
                </th>
              </tr>
              {data.items.map((item, index) => {
                return (
                  <tr key={index.toString()}>
                    <td className="border border-black py-2 px-4">
                      {index + 1}
                    </td>
                    <td className="border border-black py-2 px-4">
                      {item.item.item.name}
                    </td>
                    <td className="border border-black py-2 px-4">
                      {item.item.item.unit}
                    </td>
                    <td className="border border-black py-2 px-4">
                      {item.quantity}
                    </td>
                    <td className="border border-black py-2 px-4">
                      {item.price}
                    </td>
                    <td className="border border-black py-2 px-4">
                      {item.quantity * item.price}
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td
                  colSpan={5}
                  className="border border-black py-2 px-4 text-right"
                >
                  Taxable Amount
                </td>
                <td className="border border-black py-2 px-4">{totalAmount}</td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  className="border border-black py-2 px-4 text-right"
                >
                  {data.taxType.toUpperCase()} @
                  {data.taxType === "IGST"
                    ? data.igst + "%"
                    : data.sgst + "%+" + data.cgst + "%"}
                </td>
                <td className="border border-black py-2 px-4">{totalTax}</td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  className="border border-black py-2 px-4 text-right"
                >
                  Net Amount
                </td>
                <td className="border border-black py-2 px-4">
                  {totalAmountWithTax}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={6}
                  className="border border-black py-2 px-4 text-center"
                >
                  {numberToWords(totalAmountWithTax) + " Only"}
                </td>
              </tr>
            </table>
            <div className="mt-5">
              <p>Terms and Conditions:</p>
              <ul className="list-disc pl-5">
                <li className="mb-2">Price Basis - EX-WORKS</li>
                <li className="mb-2">
                  Payment - Within 30 days after the receipt of material.
                </li>
                <li className="mb-2">Delivery - Immediate.</li>
                <li className="mb-2">Packing - Standard.</li>
                <li className="mb-2">
                  PO subjects to cancel, if any found defective of materials or
                  does not match with purchase order will be replaced free at
                  party cost.
                </li>
              </ul>
            </div>
            <div className="mt-5">
              <p>N.B- Quantity and Quality verification at our side is final</p>
            </div>
            <div className="flex justify-between mt-10">
              <div className="w-1/3 text-center pt-8">
                <p>
                  <br />
                  Authorised Signatory
                </p>
              </div>
              <div className="w-1/3 text-center">
                <p>Prepared By:</p>
                <p>{data.indent.department.name}</p>
              </div>
            </div>
            <div className="text-center bg-gray-200 p-2 mt-5">
              <p>
                Office @ 923 Jindal House, Fatasil Main Road, Guwahati, Pincode
                : 781009
              </p>
              <p>
                Works @ Industrial Growth Centre, AIIDC Chaygaon, Village -
                Chatabari, Kamrup (R), Assam 781124.
              </p>
              <p>Email: mkpollymers2020@gmail.com</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
