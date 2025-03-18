import { Box, Divider } from "@mui/material"
import SalesChart from "../components/SalesChart";
import ItemChart from "../components/ItemChart";
import CustomerLedger from "../components/CustomerLedger";

const Home = () => {
  
  return (
    <Box
      sx={{ width: "calc(100% + 240px)", marginLeft: "-240px", boxShadow: 3 }}
    >
      <Box sx={{ mb: 2 }}>
        <SalesChart />
      </Box>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <ItemChart />
      </Box>
      <Divider />

      <Box>
        <CustomerLedger />
      </Box>
    </Box>
  );
}

export default Home