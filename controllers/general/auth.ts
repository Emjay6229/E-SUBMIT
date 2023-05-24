//IMPORT DEPENDENCIES
import { config } from 'dotenv' 
import { Request, Response} from 'express'
import { ReasonPhrases, StatusCodes} from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Employee } from '../../model/Employee'
import { sendVerifyLink } from '../utils/sendVerificationLink'
// import { ObjectId } from 'mongoose'

config();

const { secretKey } = process.env
const expires =  process.env.expires as string 
const jwtLife = parseInt(expires)

// TOKEN CREATION FUNCTION
export const createToken = ( email:string, userName:string, userId: any ) => {
    const payload: JwtPayload = { email, userName, userId }
    if(!secretKey){
        throw new Error(' token key is undefined')
    }
    return jwt.sign( payload, secretKey, { expiresIn: jwtLife })
}

export class Authenticate {
// REGISTER METHOD
    public register = async (req: Request, res: Response ) => {
        try {
            const { firstName, lastName, userName, email, password } = req.body
            const securePassword = await bcrypt.hash(password, bcrypt.genSaltSync(10))
            const userCount = await Employee.countDocuments({});
            const checkMail = await Employee.findOne({ email }).select('-_id email')
            const checkUserName = await Employee.findOne({ userName }).select('-_id email')
            
            if( checkMail || checkUserName ) {
                return res.send( "This user is already registered." )
            }

            // instantiate an employee object from the Employee model
            const employee = new Employee({ firstName, lastName, userName, email, password: securePassword })

            // Ensures First User to register is an ADMIN
            if(userCount === 0) {
                employee.role = "Admin"
            }

            // save employee to database
            await employee.save();
    
            // send link for email verification
            sendVerifyLink(email)
            
           return res.status(StatusCodes.OK).json({
                Success: "ACCOUNT CREATED SUCCESSFULLY!", 
                employee
            })
        } catch (error: any) {
            console.error(error.message)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }
}

// USER LOGIN METHOD
    public login = async ( req: Request, res:Response) => {
        try {
            const { email, password } = req.body;
            const employee = await Employee.findOne({ email })

            if ( !employee ) {
                return res.send("This User does not exist")
            }

            // Compares inputted password with user's existing password
            const isPasswordMatch = await bcrypt.compare( password, employee.password )

            if ( !isPasswordMatch  ) {
                return res.send( "Incorrect Credentials" )
            }

            const token = createToken( employee.email, employee.userName, employee._id )
            console.log("Login successful!");

            return res.cookie("jwt", token, { httpOnly: true, domain: "127.0.0.1", maxAge: jwtLife })
                .status(StatusCodes.OK)
                .redirect(301, `/api/profile/${employee._id}`)
            } catch(error: any) {
                console.error(error) 
                return res.status(StatusCodes.NOT_FOUND).json(ReasonPhrases.NOT_FOUND)
            }
        }

    // USER SIGNOUT METHOD
    public signOut = async (req: Request, res:Response) => {
        try {
            // set maxage to 1 milisecond.
            return res.cookie("jwt", "", { maxAge: 1 })
                .status(StatusCodes.OK)
                .send("You have been successfully Logged Out")
        } catch (error) {
            console.error(error)
            return res.status(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST)
        }
    }
}