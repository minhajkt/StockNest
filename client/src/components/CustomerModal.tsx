import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"

interface customerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  customer: { name: string; address: string; mobile: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  isEditing: boolean
}

const CustomerModal = ({open, onClose, onSubmit, customer, handleChange, error, isEditing} : customerModalProps) => {
    return (
      <>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle sx={{ pb: 0 }}>{isEditing ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
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
              value={customer.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Address"
              name="address"
              value={customer.address}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Mobile"
              name="mobile"
              value={customer.mobile}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>
              {isEditing? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
} 

export default CustomerModal;