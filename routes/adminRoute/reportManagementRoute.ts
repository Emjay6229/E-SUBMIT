import express from 'express'
const router =  express.Router()

import { viewAllReportForEmployee, viewSingleReport, addCommentToReport } from '../../controllers/admin/reportsManagement'

router.route("/author/:id")
    .get(viewAllReportForEmployee)

router.route("/:reportId")
    .get(viewSingleReport)
    .post(addCommentToReport)

export = router