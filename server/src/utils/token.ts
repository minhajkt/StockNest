import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;


export const generateAccessToken = (data : object) : string => {
    return jwt.sign(data, ACCESS_TOKEN_SECRET, {expiresIn:"15m"})
}

export const generateRefreshToken = (data: object): string => {
  return jwt.sign( data , REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET)
    } catch (error) {
        return null
    }
}

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};
