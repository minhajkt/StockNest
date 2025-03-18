export const validateName = (name: string) => {
  if (!name.trim()) return { isValid: false, message: "Name is required." };
  if (name.length < 3)
    return {
      isValid: false,
      message: "Name must be at least 3 characters.",
    };
  return { isValid: true, message: "" };
};

export const validateAddress = (address: string) => {
  if (!address.trim())
    return { isValid: false, message: "Address is required." };
  if (address.length < 3)
    return {
      isValid: false,
      message: "Address must be at least 3 characters.",
    };
  return { isValid: true, message: "" };
};

export const validateMobile = (mobile: string) => {
  if (!mobile.trim())
    return { isValid: false, message: "Mobile is required." };

  if (!/^\d{10}$/.test(mobile)) {
    return { isValid: false, message: "Mobile must be exactly 10 digits." };
  }

  return { isValid: true, message: "" };
};
