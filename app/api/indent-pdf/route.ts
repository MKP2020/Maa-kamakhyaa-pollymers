import { TIndent } from "@/lib/types";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

//       However, this option will stay so when we migrate to full chromium it will work.
chromium.setHeadlessMode = true;

// Optional: If you'd like to disable webgl, true is the default.
chromium.setGraphicsMode = false;

// You may want to change this if you're developing
// on a platform different from macOS.
// See https://github.com/vercel/og-image for a more resilient
// system-agnostic options for Puppeteeer.
const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export async function POST(request: NextRequest) {
  const { data } = (await request.json()) as { data: TIndent };

  const executablePath =
    (await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
    )) || LOCAL_CHROME_EXECUTABLE;

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Indent Book</title>
      <style>
          table {
              width: 100%;
              border-collapse: collapse;
          }
  
          th,
          td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
          }
  
          th {
              background-color: #f2f2f2;
          }
  
          .header {
              text-align: center;
          }
  
          .sub-header {
              display: flex;
              flex-direction: row;
              flex: 1;
              padding-bottom: 20px;
          }
  
          .sub-header-inner {
              flex: 1;
              flex-direction: row;
          }
          .si-no-container {
              width: 200px;
          }
  
          .title {
              font-weight: 700;
          }
          .underline {
              padding-left: 10px;
              padding-right: 10px;
              text-decoration-line: underline;
          }
      </style>
  </head>
  
  <body>
      <div class="header">
          <h1>MAA KAMAKHYAA POLLYMERS</h1>
          <p>
              Industrial Growth Centre, AIIDC Chaygaon, Vill - Chatabari, Kamrup (R),
              Assam - 781124
          </p>
          <h2>INDENT BOOK</h2>
      </div>
      <div class="sub-header">
          <div class="sub-header-inner">
              <div>
                  <span class="title">Indent raised by (Department)</span>
                  <span class="underline">${data.department.name}</span>
                  <span class="title">Department</span>
              </div>
  
             
          </div>
  
          <div class="si-no-container">
  
              <div>
  
                  <span class="title">Sl. No.</span>
                  <span>${data.indentNumber}</span>
  
              </div>
  
              <div>
                  <span class="title">Date</span>
                  <span>${format(data.date, "dd/MM/yyyy")}</span>
              </div>
  
  
          </div>
      </div>
  
      </div>
  
      </div>
      <table>
          <tr>
              <th>Sl. No.</th>
              <th>Particulars of items with specifications (in block letters)</th>
              <th>Quantity Indented (in measure)</th>
              <th>Approved Quantity (in measure)</th>
              <th>Place of use</th>
          </tr>
          ${data.items.map((item, index) => {
            return `<tr>
                <td>${index + 1}</td>
                <td>${item.item.name}</td>
                <td>${item.indentedQty} ${item.item.unit}</td>
                <td>${item.approvedQty} ${item.item.unit}</td>
                <td></td>
              </tr>`;
          })}
      </table>
      <p>
  
      </p>
      
  
              <div style="display: flex; width: 100%; flex-direction: row; border-width: 1px; border-style: solid; padding-top: 80px; padding-bottom: 8px;">
  
                  <div style="flex: 1; text-align: center; text-transform: uppercase;">
                      Section Incharge-HOD
                  </div>
                  <div style="flex: 1; text-align: center; text-transform: uppercase;">
                      Store Incharge
                  </div>
                  <div style="flex: 1; text-align: center; text-transform: uppercase;">
                      Plant Head
                  </div>
                  <div style="flex: 1; text-align: center; text-transform: uppercase;">
                     Director
                  </div>
                 
              </div>
            
          
              <div style="display: flex; flex-direction: row; min-height: 40px; padding: 10px; padding-bottom: 8px;">
                  <span class="title">Note:  ${data.note || ""}</span>
              </div>
         
      </table>
  </body>
  
  </html>`;

  try {
    const browser = await puppeteer.launch({
      executablePath: executablePath,
      args: chromium.args,
      headless: false,
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=generated.pdf",
      },
    });

    //  return NextResponse.json(
    //   {
    //     message: "Error generating PDF",
    //     error: (error as any).message,
    //   },
    //   { status: 500 }
    // );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        message: "Error generating PDF",
        error: (error as any).message,
      },
      { status: 500 }
    );
  }
}
