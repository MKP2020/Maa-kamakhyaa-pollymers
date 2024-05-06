"use server";
import { TIndent } from "@/lib/types";
import { formatDate } from "date-fns";

export const generateIndentHTML = (data: TIndent) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Indented Book</title>
    <style>
      /* Add your CSS styles here */
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1,
      h2 {
        text-align: center;
        margin-bottom: 10px;
        color: #333;
      }
      h1 {
        font-size: 24px;
      }
      h2 {
        font-size: 20px;
      }
      .title-section {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }
      .title-section p {
        margin: 5px 0;
      }

      .title-selection-right {
        display: flex;
        flex-direction: column;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      td {
        background-color: #fff;
      }
      .note {
        margin-top: 20px;
        padding: 10px;
        gap: 10px;
      }
      textarea {
        width: calc(100% - 22px);
        height: 80px;
        resize: none;
        border: none;
        border-radius: 5px;
        padding: 5px;
        outline: none;
        box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>MAA KAMAKHYAA POLLYMERS</h1>
      <h2>Indented Book</h2>
      <div class="title-section">
        <p><strong>Department:</strong> ${data.department.name}</p>
        <div class="title-selection-right">
          <p><strong>SI No:</strong> ${data.indentNumber}</p>
          <p><strong>Date:</strong> ${formatDate(data.date, "dd/MM/yyyy")}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>SI No</th>
            <th>Item</th>
            <th>Indent Quantity</th>
            <th>Approved Quantity</th>
          </tr>
        </thead>
        <tbody>
          <!-- Add your table rows dynamically here -->
          ${data.items.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{item.item.name}</td>
              <td>{item.indentedQty}</td>
              <td>{item.approvedQty || ""}</td>
            </tr>
          ))}
          <!-- Add more rows as needed -->
        </tbody>
      </table>
      <div class="note">
        <label><strong>Note:</strong></label>

        <textarea disabled id="note" rows="5" maxlength="150">${
          data.note || ""
        }</textarea>
      </div>
    </div>
  </body>
</html>
`;
};
