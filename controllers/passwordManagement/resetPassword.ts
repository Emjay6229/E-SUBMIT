// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Employee } from '../../model/Employee'
import { verifyResetEmailAndSendLink } from './sendPasswordLink';
import { decodeToken } from '../../middleware/decodeToken';
import { JwtPayload } from 'jsonwebtoken';

config();

// verify user email and send list
export class ResetPassword {
    public forgotPassword = async (req:Request, res:Response) => {
        try {
                const { email } = req.body;
                verifyResetEmailAndSendLink( req, res, email )
            } catch (err) {
                console.log(err)
            }
        }

    public changePassword = async (req: Request, res: Response) => {
        try {
          const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
          const email = decodedToken.email
          verifyResetEmailAndSendLink(req, res, email)
        } catch(error: any) {
          console.log(error)
          res.status(201).json(error.message)
        }
      }

// Update password in the database
    public resetPassword = async (req:Request, res:Response) => {
        const { token } = req.params;
        const { newPassword, confirmPassword  } = req.body;
        const employee: any = await Employee.findOne( { resetToken: token } );

        try {
            if (!token || token !== employee.verifyToken) {
                throw new Error ("A valid reset token is needed")
            }
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords must match")
            }
            
            const verifyPassword = await bcrypt.compare(newPassword, employee.password)

            if (verifyPassword) {
                throw new Error ("You cannot use an old password")
            }

            const securePass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));
            
            const updatedPassword = await Employee.findOneAndUpdate({ verifyToken: token }, { password: securePass }, 
                { new: true, runValidators: true }).select("firstName lastName email password")

            res.status(201).json(updatedPassword);
            console.log("Password has been successfully reset")
            
        } catch(err: any) {
            console.log(err)
            res.status(201).json(err.message)
        }
    }
}