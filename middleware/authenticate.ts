import { config } from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
// import { CustomRequest } from '../controllers/auth'

config()

const { secretKey } = process.env

// Define an interface to extend the Request type
interface tokenRequest {
    token?: any;
  }

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt

        if (!secretKey) {
            throw new Error("Cannot access secret Key")
        }
        
        const decodedToken = jwt.verify( token, secretKey ) as JwtPayload;
        (req as tokenRequest).token = decodedToken
        next();
    } catch (err:any) {
        throw new Error( "An error occured with token verification")
    }   
}