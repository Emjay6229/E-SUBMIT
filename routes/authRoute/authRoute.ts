import express from 'express'
const router =  express.Router()
import { Authenticate } from '../../controllers/general/auth';
import { verifyMail } from '../../controllers/utils/verifyMail'
// import {body, validationResult} from 'express-validator';

const authenticate = new Authenticate()
const {register, login, signOut } = authenticate

router.route("/signup")
    .post( /*body('email').isEmail().normalizeEmail(),*/ register )

router.route("/signin")
    .post( login )

router.route("/signout")
    .post( signOut )
    
router.route("/verify/:token")
    .post( verifyMail )

export = router;