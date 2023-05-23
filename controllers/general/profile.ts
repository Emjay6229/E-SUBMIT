//IMPORT DEPENDENCIES
import { config } from 'dotenv'
import { Request, Response } from 'express'
import { Employee } from "../../model/Employee"
// import { decodeToken } from "../../middleware/decodeToken"
import { createToken } from "./auth"
import { StatusCodes } from 'http-status-codes';
// import { JwtPayload } from 'jsonwebtoken';
const expires =  process.env.expires as string 
const jwtLife = parseInt(expires)

config();

// GET YOUR PROFILE
export const viewMyProfile = async (req: Request, res: Response) => {
    try {
        // const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload

        // Extract and store user name from the decoded token
        // const loggedInUser = decodedToken.userName;
        const id = req.params.id;

        // Check if the params is same as the logged in user
        // if ( userName !== loggedInUser ) {
        //   return res.send("Unauthorized Request")
        // }

        // Retrieve user profile from database
        const myProfile = await Employee.findOne({_id: id})
            .select( "_id firstName lastName userName email role" );

        res.status(StatusCodes.OK)
            .json( { message: "Retrieving profile", myProfile } );
    } catch(error: any) {
        console.error(error) 
        res.status(StatusCodes.UNAUTHORIZED).json(error.message)
    }
}

// UPDATE/EDIT USER PROFILE [ONLY EMAIL UPDATE IS ACCESSSIBLE FOR EDIT]
export const editMyProfile = async (req: Request, res: Response) => {
    try {
        // const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
        // const loggedInUser = decodedToken.userName;
        const id = req.params.id;

        // if ( userName !== loggedInUser ) {
        //   return res.send("Unauthorized Request")
        // }

        const updatedProfile = await Employee.findOneAndUpdate( { _id: id }, req.body, { 
            new: true, 
            runValidators: true
        }).select("_id firstName lastName email userName role")

        if(!updatedProfile) {
            console.log("Error occurred. Cannot Update profile")
            return res.send("Error occurred. Cannot Update profile")
        }

    console.log(updatedProfile);

    // Create new token that contains updated data
    const token = createToken( updatedProfile.email, updatedProfile.userName, updatedProfile._id );

    res.cookie("jwt", token, { httpOnly: true, maxAge: jwtLife })
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
        const id = req.params.id;

        // if ( userName !== loggedInUser ) {
        //   return res.send("Unauthorized Request")
        // }

        await Employee.findOneAndDelete( { _id: id });
        res.status(200)
            .json({
            Success: "Your account has been deleted"
        })
    } catch (error: any) {
        console.error(error)
        res.status(400)
            .json(error.message)
    }
}