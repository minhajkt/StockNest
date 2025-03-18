export const validateName = (name: string) => {
  if (!name.trim()) return { isValid: false, message: "Name is required." };
  if (name.length < 3)
    return {
      isValid: false,
      message: "Name must be at least 3 characters.",
    };
  return { isValid: true, message: "" };
};

export const validateDescription = (description: string) => {
  if (!description.trim()) return { isValid: false, message: "Desciption is required." };
   if (description.length < 3)
     return {
       isValid: false,
       message: "Description must be at least 3 characters.",
     };
  return { isValid: true, message: "" };
};

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

export const validatePrice = (price: string) => {
  if (!price.trim())
    return { isValid: false, message: "Price is required." };

  const numPrice = Number(price);

  if (isNaN(numPrice)) {
    return { isValid: false, message: "Price must be a valid number." };
  }

  if (numPrice < 0) {
    return { isValid: false, message: "Price must be a positive number." };
  }

  return { isValid: true, message: "" };
};