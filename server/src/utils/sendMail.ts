import nodemailer from "nodemailer";
import multer from 'multer';
import fs from 'fs'

const upload = multer({ dest: "uploads/" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chronocraft17@gmail.com",
    pass: "ofsz uupc mphi nbht",
  },
});


export const sendSalesReportEmail = async (to: string, pdfBuffer:Buffer) => {
  
  const mailOptions = {
    from: "chronocraft17@gmail.com",
    to,
    subject: "Sales Report",
    text: "Sales Report is attached here.",
    attachments: [
      {
        filename: "Sales_Report.pdf",
        // path: pdfPath,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    // fs.unlink(pdfPath, (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //   } else {
    //     // console.log("PDF deleted successfully:", pdfPath);
    //   }
    // });
    // console.log(`Email sent to: ${to}`);
    return { success: true, message: "Email sent successfully!" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
};