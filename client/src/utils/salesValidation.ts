export const validateQuantity = (quantity: string) => {
  if (!quantity.trim())
    return { isValid: false, message: "Quantity is required." };

  const numQuantity = Number(quantity);

  if (isNaN(numQuantity)) {
    return { isValid: false, message: "Quantity must be a valid number." };
  }

  if (numQuantity <= 0) {
    return { isValid: false, message: "Quantity must be a positive number." };
  }

  return { isValid: true, message: "" };
};
