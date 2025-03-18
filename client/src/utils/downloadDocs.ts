import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ISales } from "../interfaces/interfaces";

export const handlePrint = () => {
  window.print();
};

export const handleExportExcel = (sales: ISales[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    sales.map(({ date, customer, product, quantity, price }) => ({
      Date: date ? date.split("T")[0] : "N/A",
      Customer: customer,
      Product: product,
      Quantity: quantity,
      Price: price,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");
  XLSX.writeFile(workbook, "Sales_Report.xlsx");
};

type TableRow = [string, string, string, string, string]; 
export const handleExportPDF = (sales: ISales[]) => {
  const doc = new jsPDF();
  doc.text("Sales Report", 14, 10);

  const tableColumn = ["Date", "Customer", "Product", "Quantity", "Price"];
  const tableRows: TableRow[] = []

  sales.forEach(({ date, customer, product, quantity, price }) => {
    const saleData = [
      date ? date.split("T")[0] : "N/A",
      customer,
      product,
      quantity.toString(),
      price.toString(),
    ] as TableRow;
    tableRows.push(saleData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("Sales_Report.pdf");
};