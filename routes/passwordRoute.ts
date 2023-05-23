import express from 'express'
const router =  express.Router()
import { ResetPassword } from '../controllers/passwordManagement/resetPassword';
import { verifyToken } from '../middleware/authenticate';
import { isVerified } from '../middleware/checkVerified';
import { isActive } from '../middleware/checkActive';

const reset = new ResetPassword ()
const { forgotPassword, changePassword, resetPassword } = reset

router.route("/")
    .post(verifyToken, isVerified, isActive, changePassword)

router.route("/reset")
    .post( forgotPassword )

router.route("/reset/:token")
    .patch( resetPassword ) 

export = router;