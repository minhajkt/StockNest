import express from 'express'
import { connectDB } from './config/db';
import authRouter from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import customerRoutes from './routes/customerRoutes';
import prouductRoutes from './routes/productRoutes';
import salesRoutes from './routes/salesRoutes';

const app = express()

connectDB()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/customer', customerRoutes)
app.use("/api/product", prouductRoutes);
app.use("/api/sale", salesRoutes);

const port = process.env.PORT || 4000;


app.get('/', (req, res) => {
    res.send('Hello world')
})


app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})