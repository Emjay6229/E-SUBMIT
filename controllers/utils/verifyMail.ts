// IMPORT DEPENDENCIES
import { Request, Response } from 'express'
import { StatusCodes} from 'http-status-codes'
import { Employee } from '../../model/Employee'

export const verifyMail = async (req: Request, res: Response) => {
    try {
        const verifyToken = req.params.token;
        const employee = await Employee.findOne( { verifyToken } ).select("firstName lastName userName email isVerified")

        if(!employee) {
            throw new Error("Email Verification failed");
        }

        if (employee.isVerified === true) {
            console.log("Your address has already been verified")
            return res.send("Your address has already been verified")
        }

        employee.isVerified = true;
        await employee.save()
        
        return res.status(StatusCodes.OK).json( {
            message: "Your Address has been verified",
            employee
         })
    } catch( err: any ) {
        console.log(err)
        res.status(StatusCodes.BAD_REQUEST).json( { error: err.message } )
    }
}