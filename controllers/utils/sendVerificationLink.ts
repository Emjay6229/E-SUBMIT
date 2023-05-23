import { config } from 'dotenv'
import { Employee } from '../../model/Employee'
import { sendToMail } from './sendToMail'
import crypto from 'crypto'

config();

const domain = process.env.DOMAIN as string
const key = process.env.API_KEY as string

// verify user email
export const sendVerifyLink = async ( mail: string ) => {
    try {
            // verify user email
            const employee: any = await Employee.findOne( { email: mail } )
        
            if( !employee ) {
                throw new Error( "User does not exist")
            }

            const verifyToken = crypto.randomBytes(16).toString("hex");
            employee.verifyToken = verifyToken;
            employee.save();
            
            const messageData = {
                from: 'Purscliq Weekly<purscliq@gmail.com>',
                to: mail,
                subject: 'Confirm Your E-Mail Address',
                html: `<h3>Confirm Your Email</h3>
                <p><a href="http://127.0.0.1:5000/auth/verify/${verifyToken}">click here</a></p>`
            };
            
            sendToMail(domain, key, messageData)
        } 
        catch (err) {
            console.log(err)
        }
    }