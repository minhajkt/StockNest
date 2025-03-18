import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";


interface productModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  product: { name: string; description: string; quantity: string, price: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  isEditing: boolean;
}


const ProductModal = ({open, onClose, onSubmit, product, handleChange, error, isEditing} : productModalProps) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ pb: 0 }}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <Box sx={{ minHeight: 20 }}>
          {error && (
            <Typography variant="body2" color="red" sx={{ pl: 4 }}>
              {error}
            </Typography>
          )}
        </Box>
        <DialogContent sx={{ pt: 0 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Quantity"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Price"
            name="price"
            value={product.price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={onSubmit}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductModal;
