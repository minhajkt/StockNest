import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box, Button,
 Snackbar, IconButton,
 TablePagination,
 TextField,
 InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { addCustomer, deleteCustomer, editCustomer, getCustomers } from "../services/customerServices";
import { ICustomer } from "../interfaces/interfaces";
import { Close, Search } from '@mui/icons-material'
import CustomerModal from "../components/CustomerModal";
import { validateAddress, validateMobile, validateName } from "../utils/customerValidation";


const Customers = () => {
  const [errors, setError] = useState('')
  const [modalError, setModalError] = useState("");
  const [openModal, setOpenModal] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [newCustomer, setNewCustomer] = useState({name:'', address: "", mobile:''})
  const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allCustomers, setAllCustomers] = useState<ICustomer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      const result = await getCustomers();
      setAllCustomers(result);
      setFilteredCustomers(result);
    } catch (error) {
      setError("Failed to get the customers");
      console.log("failed to fetch result", error);
    }
  };
  useEffect(() => {
    fetchCustomers()
  }, [])

   useEffect(() => {
     if (!search) {
       setFilteredCustomers(allCustomers);
     } else {
       const lowercasedSearch = search.toLowerCase();
       setFilteredCustomers(
         allCustomers.filter(
           (customer) =>
             customer.name.toLowerCase().includes(lowercasedSearch) ||
             customer.address.toLowerCase().includes(lowercasedSearch) ||
             customer.mobile.toString().includes(lowercasedSearch)
         )
       );
     }
   }, [search, allCustomers]);

  const handleAdd = async() => {
    setSelectedCustomer(null);
    setNewCustomer({ name: "", address: "", mobile: "" });
    setOpenModal(true)
  }

  const handleEdit = async(customer: ICustomer) => {
    setSelectedCustomer(customer)
    setNewCustomer({
      name: customer.name,
      address: customer.address,
      mobile: String(customer.mobile),
    });
    setIsEditing(true)
    setOpenModal(true)
  }

  const handleClose = async() =>{
    setSelectedCustomer(null);
    setNewCustomer({ name: "", address: "", mobile: "" });
    setModalError('')
    setOpenModal(false)
  }

  const handleSnackbarClose = async() => {
    setOpenSnackbar(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
    if (modalError) {
      setModalError("");
    }
  };

  const handleSubmit = async() => {
    try {
      setModalError('')
      const nameValidation = validateName(newCustomer.name);
      const addressValidation = validateAddress(newCustomer.address);
      const mobileValidation = validateMobile(newCustomer.mobile);

      if (!nameValidation.isValid) {
        setModalError(nameValidation.message);
        return;
      }
      if (!addressValidation.isValid) {
        setModalError(addressValidation.message);
        return;
      }
      if (!mobileValidation.isValid) {
        setModalError(mobileValidation.message);
        return;
      }

      const formattedCustomer = {
        ...newCustomer, 
        mobile: Number(newCustomer.mobile)
      }
      
      if(isEditing && selectedCustomer) {
        await editCustomer(selectedCustomer._id, formattedCustomer)
        setSnackbarMessage('Customer updated successfully')
      }else {
        await addCustomer(formattedCustomer)
        
          const updatedCustomers = await getCustomers()
          setAllCustomers(updatedCustomers)
          setSnackbarMessage('Customer added successfully')
        }
        fetchCustomers()
        handleClose()
        setOpenSnackbar(true)
    } catch (error) {
      setModalError((error as Error).message || 'An error occured')
    }
  }

  const handleDelete = async (customer: ICustomer) => {
    try {
        await deleteCustomer(customer._id);
        setAllCustomers(allCustomers.filter((c) => c._id !== customer._id));
        setOpenSnackbar(true)
        setSnackbarMessage('Customer deleted successfully')
    } catch (error) {
      console.error('Error deleting customer', error);
      
    }
  };

  return (
    <Box
      sx={{ width: "calc(100% + 240px)", marginLeft: "-240px", boxShadow: 3 }}
    >
      <Box>
        <TableContainer component={Paper}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h5">Customers List</Typography>
            {errors && (
              <Typography variant="body2" color="red">
                {errors}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleAdd}
            >
              Add
            </Button>
          </Box>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: "250px", mb: 2 , pl:2}}
          />
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#ecf0f1" }}>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Mobile</strong>
                </TableCell>
                <TableCell>
                  <strong>Aciton</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.address}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(customer)}
                          sx={{ "&:hover": { backgroundColor: "transparent" } }}
                        >
                          <EditIcon sx={{ fontSize: 16, mr: 1 }} />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(customer)}
                          sx={{ "&:hover": { backgroundColor: "transparent" } }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 0 }}
                    >
                      <Typography variant="body2">
                        You currently don’t have customers
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CustomerModal
        open={openModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        customer={newCustomer}
        handleChange={handleChange}
        error={modalError}
        isEditing={isEditing}
      />

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={2000}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={allCustomers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default Customers;
