import express from 'express'
const router =  express.Router()

import { viewAllEmployees, 
    viewEmployee, 
    deactivateEmployee, 
    activateEmployee
} from '../../controllers/admin/profileManagement'

router.route("/data")
    .get( viewAllEmployees )

router.route("/:id")
    .get( viewEmployee )

router.route("/deactivate/:id")
    .patch( deactivateEmployee )

router.route("/activate/:id")
    .patch( activateEmployee )

export = router;