// IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import crypto from 'crypto'
import { Employee } from '../../model/Employee'
import { sendToMail } from '../utils/sendToMail'
import { StatusCodes } from 'http-status-codes'

config();

// Mailgun message data parameters
const domain = process.env.DOMAIN as string
const key = process.env.api_key as string

// @ Send email
// This function verifies the user's email, creates a reset token and sends an email containing reset link
export const verifyResetEmailAndSendLink = async ( req: Request, res:Response, email: string ) => {
    try {
         const employee:any = await Employee.findOne( { email } )
         
         if( !employee ) {
         console.log("User does not exist");
         }

         employee.verifyToken = crypto.randomBytes(16).toString("hex");
         employee.tokenExpiration = Date.now() + 600000; // current time in miliseconds + 10 minutes in miliseconds
         await employee.save();

         const messageData = {
             from: 'Purscliq Weekly <jon@gmail.com>',
             to: email,
             subject: 'PASSWORD RESET LINK',
             html: `<h3> You requested to Change your password. Here is the link to reset your password <h3> <br>
             <a href=http://127.0.0.1:5000/pwd/reset/${employee.verifyToken}> Reset Password </a>
             <p>If this isn't you, kindly ignore this mail.</p>`
         };
         
         sendToMail(domain, key, messageData)
    } catch (error: any) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).send("Error occured: Could not send password link")
    }
}
