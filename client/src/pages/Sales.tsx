import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  IconButton,
  TablePagination,
  TextField,
  InputAdornment,
  SelectChangeEvent,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ICustomer, IProduct, ISales } from "../interfaces/interfaces";
import { Close, Search } from "@mui/icons-material";
import SalesModal from "../components/SalesModal";
import { getCustomers } from "../services/customerServices";
import { getProducts } from "../services/productService";
import { createSale, getSales, handleSendEmail } from "../services/salesServices";
import { handleExportExcel, handleExportPDF, handlePrint } from "../utils/downloadDocs";
import { validateQuantity } from "../utils/salesValidation";

const Sales = () => {
    const [errors, setError] = useState('')
    const [modalError, setModalError] = useState("");
    const [openModal, setOpenModal] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [newSale, setNewSale] = useState({customer: "", product:'', quantity:'', price:''})
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [allSales, setAllSales] = useState<ISales[]>([]);
    const [filteredSales, setFilteredSales] = useState<ISales[]>([]);
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [products, setProducts] = useState<IProduct[]>([])
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [recipient, setRecipient] = useState('')
    const [loading, setLoading] = useState(false)

const work = [{ name: "Print", action: () => handlePrint() },
  { name: "Download Excel", action: () => handleExportExcel(filteredSales) },
  { name: "Download PDF", action: () => handleExportPDF(filteredSales) },
//   { name: "Send as Email", action: () => () } 
]

    const fetchSales = async() => {
        try {
            const result = await getSales()
            setAllSales(result)
        } catch (error) {
            setError('Failed to fetch sales')
            console.error('Failed to fetch sales', error);
        }
    }
    useEffect(() => {
        fetchSales()
    }, [])

    useEffect(() => {
      if (!search) {
        setFilteredSales(allSales);
      } else {
        const lowercasedSearch = search.toLowerCase();
        setFilteredSales(
          allSales.filter(
            (sale) =>
              sale.customer.toLowerCase().includes(lowercasedSearch) ||
              sale.product.toLowerCase().includes(lowercasedSearch) ||
              sale.quantity.toString().includes(lowercasedSearch) ||
              sale.price.toString().includes(lowercasedSearch)
          )
        );
      }
    }, [search, allSales]);

    useEffect(() => {
        const fetchCustomers = async () => {
          try {
            const result = await getCustomers();
            setCustomers(result);
          } catch (error) {
            console.error("Failed to fetch customers", error);
          }
        };
        fetchCustomers()
    }, [])

    const fetchProducts = async () => {
        try {
            const result = await getProducts();
            setProducts(result);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleAdd = async () => {
    setNewSale({customer: "", product:'', quantity:'1', price:''});
    setOpenModal(true);
    };

  const handleClose = async () => {
    setNewSale({customer: "", product:'', quantity:'', price:''});
    setModalError("");
    setOpenModal(false);
  };    

  const handleSnackbarClose = async () => {
    setOpenSnackbar(false);
  };
 
  const handleChange = (
    e:SelectChangeEvent | React.ChangeEvent<{ name: string; value: unknown }> 
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setNewSale((prevSale) => {
      const updatedSale = { ...prevSale, [name]: value };

      if (name === "product") {
        const selectedProduct = products.find((p) => p.name === value);
        if (selectedProduct) {
          updatedSale.price = (
            selectedProduct.price * Number(prevSale.quantity)
          ).toString();
        }
      }

      if (name === "quantity") {
        const selectedProduct = products.find(
          (p) => p.name === prevSale.product
        );
        if (selectedProduct) {
          updatedSale.price = (
            selectedProduct.price * Number(value)
          ).toString();
        }
      }

      return updatedSale;
    });
    if (modalError) {
      setModalError("");
    }
  };

 const handleSubmit = async() => {
    try {
      setModalError('')
      const quantituyValidation = validateQuantity(newSale.quantity);
      if (!quantituyValidation.isValid) {
        setModalError(quantituyValidation.message);
        return;
      }

      const formattedSale = {
        ...newSale, 
        quantity: Number(newSale.quantity),
        price: Number(newSale.price)
      }
      
        await createSale(formattedSale)
        setSnackbarMessage('Sales added successfully')
        fetchProducts()
        fetchSales()
        handleClose()
        setOpenSnackbar(true)

    } catch (error) {
      setModalError((error as Error).message || 'An error occured')
    }
  }

  const sendEmail = async() => {
    if(!recipient) {
        setOpenSnackbar(true)
        setSnackbarMessage('Please enter a recipient address')
        return
    }
    setLoading(true)
    try {
        await handleSendEmail(recipient)
        setOpenSnackbar(true);
        setSnackbarMessage("Email sent successfully");
    } catch (error) {
        setError((error as Error).message || 'Failed to sent email')
    }finally {
        setLoading(false)
    }
  }

  return (
    <Box
      sx={{ width: "calc(100% + 240px)", marginLeft: "-240px", boxShadow: 3 }}
    >
      <Box>
        <TableContainer component={Paper} id="sales-table">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography variant="h5">Sales List</Typography>
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
            placeholder="Search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: "250px", mb: 2, pl: 2 }}
          />
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#ecf0f1" }}>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Product</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell>{sale.date.split("T")[0]}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.product}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>{sale.price}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 0 }}
                    >
                      <Typography variant="body2">
                        You currently don’t have any sales history
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SalesModal
        open={openModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        sale={newSale}
        handleChange={handleChange}
        error={modalError}
        customers={customers.map((c) => c.name)}
        products={products}
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
        count={allSales.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
      <Box sx={{ display: "flex", pl: 2, pb: 0 }}>
        <TextField
          select
          sx={{ width: "20%" }}
          size="small"
          margin="dense"
          label="Actions"
          name="action"
          //   value={sale.product}
          onChange={(e) => {
            const selectedAction = work.find(
              (item) => item.name === e.target.value
            );
            if (selectedAction) {
              selectedAction.action();
            }
          }}
        >
          {work.map((item, index) => (
            <MenuItem key={index} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ pl: 2, pb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <TextField
          sx={{ width: "20%" }}
          size="small"
          margin="dense"
          label="Send as Email"
          name="action"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        ></TextField>
        <Button
          variant="contained"
          size="small"
          sx={{ height: "10%" }}
          onClick={() => {sendEmail(); setRecipient('')}}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20}/> : 'Send'}
        </Button>
      </Box>

      {/* <input
        type="email"
        placeholder="Enter recipient email"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button onClick={sendEmail}>Send Email</button> */}
    </Box>
  );
};

export default Sales;
