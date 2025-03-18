import { Router } from "express";
import { loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const authRouter = Router()

authRouter.post("/signup", registerUser);
authRouter.post('/login', loginUser)
authRouter.post('/refresh', refreshToken)
authRouter.get('/profile', authenticateJWT, (req, res) => {
    res.send('hii')
})
authRouter.post('/logout', logoutUser)
export default authRouter;