//IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { Employee } from "../../model/Employee"
import { createToken } from "./auth"
import { StatusCodes } from 'http-status-codes'
// import { decodeToken } from "../../middleware/decodeToken"
// import { JwtPayload } from 'jsonwebtoken'
const expires =  process.env.expires as string 
const jwtLife = parseInt(expires)

config();

// GET YOUR PROFILE
export const viewMyProfile = async (req: Request, res: Response) => {
    try {
        // const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
        // const loggedInUser = decodedToken.userName;

        // if ( userName !== loggedInUser ) {
        //   return res.send("Unauthorized Request")
        // }

        const id = req.params.id
    
        const myProfile = await Employee.findOne({_id: id})
            .select( "_id firstName lastName userName email role" );

        return res.status(StatusCodes.OK)
            .json( { message: "Retrieving profile", myProfile } );
    } catch(error: any) {
        console.error(error) 
        res.status(StatusCodes.UNAUTHORIZED).json(error.message)
    }
}

// UPDATE/EDIT USER PROFILE
export const editMyProfile = async (req: Request, res: Response) => {
    try {
        // const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
        // const loggedInUser = decodedToken.userName;

        /* if ( userName !== loggedInUser ) {
                return res.send("Unauthorized Request")
            } 
         */

        const id = req.params.id

        const updatedProfile = await Employee.findOneAndUpdate( { _id: id }, req.body, { 
            new: true, 
            runValidators: true
        }).select("firstName lastName email userName role")

        if(!updatedProfile) {
            console.log("Error occurred. Cannot Update profile")
            return res.send("Error occurred: cannot update profile")
        }

    // Create new token that contains updated data
    const token = createToken( updatedProfile.email, updatedProfile.userName, updatedProfile._id );

    return res.cookie("jwt", token, { httpOnly: true, maxAge: jwtLife })
        .status(StatusCodes.OK)
        .json({ id: updatedProfile._id, 
                userName: updatedProfile.userName, 
                email: updatedProfile.email 
            })
    } catch (error: any) {
        console.error(error)
        res.status(400)
            .json(error.message) 
    }
}

// DELETE USER/ACCOUNT
export const deleteMyProfile = async (req: Request, res: Response) => {
    try {
        // const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
        // const loggedInUser = decodedToken.userName;

        /* if ( userName !== loggedInUser ) {
                return res.send("Unauthorized Request")
            } 
         */
        const id = req.params.id
        await Employee.findOneAndDelete( { _id: id });
        return res.status(200)
            .json({
            Success: "Your account has been deleted"
        })
    } catch (error: any) {
        console.error(error)
        res.status(400)
            .json(error.message)
    }
}