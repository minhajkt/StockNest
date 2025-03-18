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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Close, Search } from "@mui/icons-material";
import { IProduct } from "../interfaces/interfaces";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../services/productService";
import ProductModal from "../components/ProductModal";
import { validateName } from "../utils/authValidation";
import {
  validateDescription,
  validatePrice,
  validateQuantity,
} from "../utils/productValidation";

const Products = () => {
  const [errors, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const result = await getProducts();
      setAllProducts(result);
      setFilteredProducts(result);
    } catch (error) {
      setError("Failed to get the Products");
      console.log("failed to fetch result", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredProducts(allProducts);
    } else {
      const lowercasedSearch = search.toLowerCase();
      setFilteredProducts(
        allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercasedSearch) ||
            product.description.toLowerCase().includes(lowercasedSearch) ||
            product.quantity.toString().includes(lowercasedSearch) ||
            product.price.toString().includes(lowercasedSearch)
        )
      );
    }
  }, [search, allProducts]);

  const handleAdd = async () => {
    setSelectedProduct(null);
    setNewProduct({ name: "", description: "", quantity: "", price: "" });
    setOpenModal(true);
  };

  const handleEdit = async (product: IProduct) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      quantity: String(product.quantity),
      price: String(product.price),
    });
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleClose = async () => {
    setSelectedProduct(null);
    setNewProduct({ name: "", description: "", quantity: "", price: "" });
    setModalError("");
    setOpenModal(false);
  };

  const handleSnackbarClose = async () => {
    setOpenSnackbar(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    if (modalError) {
      setModalError("");
    }
  };

  const handleSubmit = async () => {
    try {
      setModalError("");

      const nameValidation = validateName(newProduct.name);
      const descriptionValidation = validateDescription(newProduct.description);
      const quantityValidation = validateQuantity(newProduct.quantity);
      const priceValidation = validatePrice(newProduct.price);

      if (!nameValidation.isValid) {
        setModalError(nameValidation.message);
        return;
      }
      if (!descriptionValidation.isValid) {
        setModalError(descriptionValidation.message);
        return;
      }
      if (!quantityValidation.isValid) {
        setModalError(quantityValidation.message);
        return;
      }
      if (!priceValidation.isValid) {
        setModalError(priceValidation.message);
        return;
      }

      const formattedProduct = {
        ...newProduct,
        quantity: Number(newProduct.quantity),
        price: Number(newProduct.price),
      };
      // console.log("formateed porocut", formattedProduct);
      if (isEditing && selectedProduct) {
        await editProduct(selectedProduct._id, formattedProduct);
        setSnackbarMessage("Product updated successfully");
      } else {
        await addProduct(formattedProduct);

        const updatedProducts = await getProducts();
        setAllProducts(updatedProducts);
        setSnackbarMessage("Product added successfully");
      }
      fetchProducts();
      handleClose();
      setOpenSnackbar(true);
    } catch (error) {
      setModalError((error as Error).message || "An error occured");
    }
  };

  const handleDelete = async (product: IProduct) => {
    try {
      await deleteProduct(product._id);
      setAllProducts(allProducts.filter((p) => p._id !== product._id));
      setOpenSnackbar(true);
      setSnackbarMessage("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product", error);
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
            <Typography variant="h5">Products List</Typography>
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
            placeholder="Search products..."
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
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Decription</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Aciton</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>₹ {product.price}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(product)}
                          sx={{ "&:hover": { backgroundColor: "transparent" } }}
                        >
                          <EditIcon sx={{ fontSize: 16, mr: 1 }} />
                        </IconButton>

                        <IconButton
                          onClick={() => handleDelete(product)}
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
                        You currently don’t have products
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ProductModal
        open={openModal}
        onClose={handleClose}
        onSubmit={handleSubmit}
        product={newProduct}
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
        count={allProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </Box>
  );
};

export default Products;
