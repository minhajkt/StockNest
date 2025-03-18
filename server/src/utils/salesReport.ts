import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import fs from "fs";
import path from "path";
import { ISale } from "../models/Sales";

export const generateSalesReportPDF = async (
  salesData: ISale[]
): Promise<Buffer> => {
  if (salesData.length === 0) {
    throw new Error("No sales data available");
  }

  const doc = new jsPDF();
  doc.text("Sales Report", 14, 10);

  const tableColumn = ["Date", "Customer", "Product", "Quantity", "Price"];
  const tableRows = salesData.map(
    ({ date, customer, product, quantity, price }) => [
      new Date(date).toISOString().split("T")[0], 
      customer,
      product,
      quantity.toString(),
      price.toString(),
    ]
  );

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  });

  const pdfBinary = doc.output("arraybuffer");

  const pdfBuffer = Buffer.from(new Uint8Array(pdfBinary));

  return pdfBuffer;
  // const reportsDir = path.join(__dirname, "../reports");
  // if (!fs.existsSync(reportsDir)) {
  //   fs.mkdirSync(reportsDir, { recursive: true });
  // }

  // const filePath = path.join(
  //   __dirname,
  //   "../reports",
  //   `Sales_Report_${Date.now()}.pdf`
  // );
  // doc.save(filePath);

  // return filePath;
};
