// IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

config()

// SET UP EXPRESS SERVER
const app = express()

// IMPORT MIDDLEWARES
import { verifyToken } from './middleware/authenticate';
import { isVerified } from './middleware/checkVerified';
import { isActive } from './middleware/checkActive';
import { isAdmin } from './middleware/checkAdmin';
import { isHR } from './middleware/checkHR';
import { isDev } from './middleware/checkDeveloper'

// IMPORT ROUTES
import authRoute from './routes/authRoute/authRoute'
import profileRoutes from './routes/generalRoute/profileRoutes'
import reportRoutes from './routes/generalRoute/reportRoutes'
import profileManagmentRoute from './routes/adminRoute/profileManagementRoute'
import reportManagementRoute from './routes/adminRoute/reportManagementRoute'
import roleManagementRoute from './routes/adminRoute/roleManagementRoute'
import hrRoute from './routes/hrRoutes/hrRoutes'
import passwordRoute from './routes/passwordRoute'

// DATABASE CONNECTIONS
import { connectToDatabase } from './config/connect'
// import { disconnectFromDatabase } from './config/connect'

// MIDDLEWARES
app.use(cookieParser())
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

// MOUNT ROUTES
app.use("/api", verifyToken, isVerified, isActive)
app.use("/auth", authRoute)
app.use("/pwd", passwordRoute)
app.use("/api/profile", profileRoutes)
app.use("/api/report", isDev, reportRoutes)
app.use("/api/admin", isAdmin)
app.use("/api/admin/profile", profileManagmentRoute)
app.use("/api/admin/report", reportManagementRoute)
app.use("/api/admin/role", roleManagementRoute)
app.use("/api/hr", isHR, hrRoute)

const { port } = process.env || 5000;

// SERVER CONNECTION
const server = async () => {
    try {
        await connectToDatabase()
        app.listen( port, () => console.log(`Server is running on port ${port}`) )
    } catch (error: any) {
        console.log(error.message)
    }
}

server();