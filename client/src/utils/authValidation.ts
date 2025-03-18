export const validateEmail = (email: string) => {
  if (!email) return { isValid: false, message: "Email is required." };
  if (!/\S+@\S+\.\S+/.test(email))
    return { isValid: false, message: "Enter a valid email." };
  return { isValid: true, message: "" };
};

export const validatePassword = (password: string) => {
  if (!password) return { isValid: false, message: "Password is required." };
  if (password.length < 4)
    return {
      isValid: false,
      message: "Password must be at least 4 characters.",
    };
  return { isValid: true, message: "" };
};

export const validateName = (name: string) => {
    if (!name) return { isValid: false, message: "Name is required." };
    if (name.length < 3)
      return {
        isValid: false,
        message: "Name must be at least 3 characters.",
      };
    return { isValid: true, message: "" };
}