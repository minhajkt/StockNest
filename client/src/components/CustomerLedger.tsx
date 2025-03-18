import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { getCustomerLedger } from "../services/salesServices";

const CustomerLedger = () => {
  const [ledger, setLedger] = useState<
    {
      _id: string;
      totalAmount: number;
      totalQuantity: number;
      //   transactions: any[];
    }[]
  >([]);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const data = await getCustomerLedger();
        setLedger(data);
      } catch (error) {
        console.error("Failed to fetch customer ledger", error);
      }
    };

    fetchLedger();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", my: 2, fontWeight: "bold" }}
      >
        Customer Ledger
      </Typography>

      {ledger.length > 0 ? ( // ✅ Check before rendering table
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#ecf0f1" }}>
              <TableCell>
                <b>Customer</b>
              </TableCell>
              <TableCell align="right">
                <b>Total Quantity</b>
              </TableCell>
              <TableCell align="right">
                <b>Total Amount (₹)</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ledger.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer._id}</TableCell>
                <TableCell align="right">{customer.totalQuantity}</TableCell>
                <TableCell align="right">
                  ₹ {customer.totalAmount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "gray", my: 3 }}
        >
          No Customer data available
        </Typography>
      )}
    </TableContainer>
  );
};


export default CustomerLedger;
