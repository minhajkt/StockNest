import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography, MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Box } from "@mui/system";
import { IProduct } from "../interfaces/interfaces";

interface salesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sale: { customer: string; product: string; quantity: string; price: string };
  handleChange: (
    e: React.ChangeEvent<{ name: string; value: unknown }> | SelectChangeEvent
  ) => void;
  error: string;
  customers: string[];
  products: IProduct[];
}

const SalesModal = ({
  open,
  onClose,
  onSubmit,
  sale,
  handleChange,
  error,
  customers,
  products
}: salesModalProps) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ pb: 0 }}>Add New Sale</DialogTitle>
        <Box sx={{ minHeight: 20 }}>
          {error && (
            <Typography variant="body2" color="red" sx={{ pl: 4 }}>
              {error}
            </Typography>
          )}
        </Box>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Customer"
            name="customer"
            value={sale.customer}
            onChange={handleChange}
          >
            {customers.map((customer) => (
              <MenuItem key={customer} value={customer}>
                {customer}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            margin="dense"
            label="Product"
            name="product"
            value={sale.product}
            onChange={handleChange}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Quantity"
              name="quantity"
              value={sale.quantity}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Available Stock"
              name="stock"
              value={
                products.find((p) => p.name === sale.product)?.quantity || "NA"
              }
              onChange={handleChange}
              disabled
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              margin="dense"
              label="Price"
              name="price"
              value={sale.price}
              onChange={handleChange}
              disabled
            />
            <TextField
              margin="dense"
              label="Price Per Item"
              name="price per item"
              value={
                products.find((p) => p.name === sale.product)?.price || "NA"
              }
              onChange={handleChange}
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesModal;
