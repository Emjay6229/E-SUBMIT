import express from 'express'
const router =  express.Router()

import { makeAdmin, makeHR, makeDev } from '../../controllers/admin/roleManagement'

router.route("/adminRole/:id")
    .patch(makeAdmin)
    
router.route("/hrRole/:id")
    .patch(makeHR)

router.route("/devRole/:id")
    .patch(makeDev)

export = router