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

const SalesChart = () => {
  const [sales, setSales] = useState<{ product: string; totalPrice: number }[]>(
    []
  );


  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await getSales();

        const salesData = Array.isArray(response) ? response : response.data;

        if (!Array.isArray(salesData)) {
          console.error("Sales data is not an array:", salesData);
          return;
        }

        const groupedData = salesData.reduce<
          { product: string; totalPrice: number }[]
        >((acc, sale) => {
          const existing = acc.find((item) => item.product === sale.product);
          if (existing) {
            existing.totalPrice += sale.price;
          } else {
            acc.push({ product: sale.product, totalPrice: sale.price });
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
        Sales Report
      </Typography>

      {sales.length === 0 ? ( // Show message if no data
        <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
          No sales data available
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sales}>
            <XAxis dataKey="product" />
            <YAxis>
              <Label
                value="Total Price"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip cursor={{ fill: "#f4f4f4" }} />
            <Legend formatter={() => "Products"} />
            <Bar dataKey="totalPrice" fill="#4e57bb" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  )
};

export default SalesChart;
