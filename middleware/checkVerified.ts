import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Employee } from '../model/Employee'
import { decodeToken } from './decodeToken'
import { JwtPayload } from 'jsonwebtoken'

export async function isVerified(req: Request, res: Response, next: NextFunction) {
  try {
        const decoded = decodeToken(req.cookies.jwt) as JwtPayload

        const user: any = await Employee.findOne({ _id: decoded.userId })

        if ( user.isVerified ) {
          next();
        } else {
          res.status(StatusCodes.FORBIDDEN).json({ message: "You are not verified yet" });
        }
  } catch (error: any) {
      console.error(error)
      return res.send(error)
  }
}
  