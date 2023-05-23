import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Employee } from '../model/Employee';
import { JwtPayload } from 'jsonwebtoken';
import { decodeToken } from './decodeToken';

export async function isActive(req: Request, res: Response, next: NextFunction) {
    const decoded = decodeToken(req.cookies.jwt) as JwtPayload

    const user: any = await Employee.findOne({ _id: decoded.userId })

    // Check if the user making the request is active
    if (user.isActive ) {
      // If the user is active, allow them to proceed to the next middleware function
      next();
    } else {
      // If the user is not active, return an error response
      res.status(StatusCodes.FORBIDDEN).json({ message: "This account has been deactivated" });
    }
  }
  