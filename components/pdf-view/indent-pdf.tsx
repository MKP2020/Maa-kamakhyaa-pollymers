import { TIndent } from "@/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { useEffect, useRef } from "react";
import { generateIndentPdf } from "@/lib/generate-pdf/indent";
import { format } from "date-fns";

type TIndentPdfProps = {
  data: TIndent;
  visible: boolean;
  onClose: () => void;
};

export default function IndentPdf(props: TIndentPdfProps) {
  const { data, visible, onClose } = props;
  const ref = useRef(null);

  useEffect(() => {
    if (visible) {
      const interval = setInterval(async () => {
        const element = document.querySelector("#indent-pdf");
        console.log("element", element);
        if (!element) {
          return;
        }

        clearInterval(interval);

        await generateIndentPdf(ref, data.indentNumber);
        onClose();
      }, 1000);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [visible, data.indentNumber, onClose]);

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
          <div className="text-center">
            <h1 className="text-xl font-bold">MAA KAMAKHYAA POLLYMERS</h1>
            <p>
              Industrial Growth Centre, AIIDC Chaygaon, Vill - Chatabari, Kamrup
              (R), Assam - 781124
            </p>
            <h2 className="text-lg font-semibold">INDENT BOOK</h2>
          </div>
          <div className="flex flex-row justify-between pb-5">
            <div className="flex-1">
              <div>
                <span className="font-bold">Indent raised by (Department)</span>
                <span className="underline px-2">{data.department.name}</span>
                <span className="font-bold">Department</span>
              </div>
            </div>
            <div className="w-52">
              <div>
                <span className="font-bold text-black">Sl. No.</span>
                <span>{data.indentNumber}</span>
              </div>
              <div>
                <span className="font-bold text-black">Date</span>
                <span>{format(data.date, "dd/MM/yyyy")}</span>
              </div>
            </div>
          </div>
          <table className="w-full flex-1 border-collapse border border-black">
            <thead className="bg-gray-200">
              <tr>
                <th className="border text-black border-black px-2 py-1 text-left">
                  Sl. No.
                </th>
                <th className="border text-black border-black px-2 py-1 text-left">
                  Particulars of items with specifications (in block letters)
                </th>
                <th className="border text-black border-black px-2 py-1 text-left">
                  Quantity Indented (in measure)
                </th>
                <th className="border text-black border-black px-2 py-1 text-left">
                  Approved Quantity (in measure)
                </th>
                <th className="border text-black border-black px-2 py-1 text-left">
                  Place of use
                </th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => {
                return (
                  <tr key={index.toString()}>
                    <td className="border text-black text-center border-black px-2 py-1">
                      {index + 1}
                    </td>
                    <td className="border text-black text-center border-black px-2 py-1">
                      {item.item.name}
                    </td>
                    <td className="border text-black text-center border-black px-2 py-1">
                      {item.indentedQty} {item.item.unit}
                    </td>
                    <td className="border text-black text-center border-black px-2 py-1">
                      {item.approvedQty} {item.item.unit}
                    </td>
                    <td className="border text-black text-center border-black px-2 py-1"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex w-full flex-row border border-black mt-20 py-2 pt-10">
            <div className="flex-1 text-black text-center uppercase">
              Section Incharge-HOD
            </div>
            <div className="flex-1 text-black text-center uppercase">
              Store Incharge
            </div>
            <div className="flex-1 text-black text-center uppercase">
              Plant Head
            </div>
            <div className="flex-1 text-black text-center uppercase">
              Director
            </div>
          </div>

          <div className="flex flex-row border  border-black border-t-0 min-h-10 p-2">
            <span className="font-bold">Note {data.note}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
