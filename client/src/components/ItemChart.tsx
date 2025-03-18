import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useEffect, useState } from "react";
import { getSales } from "../services/salesServices";
import { Box, Typography } from "@mui/material";

const ItemChart = () => {
  const [sales, setSales] = useState<{ product: string; quantity: number }[]>(
    []
  );


  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await getSales()

        const salesData = Array.isArray(response) ? response : response.data;

        if (!Array.isArray(salesData)) {
          console.error("Sales data is not an array:", salesData);
          return;
        }

         const groupedData = salesData.reduce<{ product: string; quantity: number }[]>((acc, sale) => {
           const existing = acc.find((item) => item.product === sale.product);
           if (existing) {
             existing.quantity += sale.quantity;
           } else {
             acc.push({ product: sale.product, quantity: sale.quantity });
           }
           return acc;
         }, []);
        setSales(groupedData);
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}
      >
        Item Report
      </Typography>
      {sales.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
          No Item data available
        </Typography>
      ) : (
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sales}>
          <XAxis dataKey="product" />
          <YAxis allowDecimals={false}>
          <Label
            value="Quantity sold"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle"  }}
          />
        </YAxis>
          <Tooltip cursor={{ fill: "#f4f4f4" }} />
          <Legend formatter={() => "Products"} />
          <Bar dataKey="quantity" fill="#4e57bb" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
        )}
    </Box>
  );
};

export default ItemChart;
