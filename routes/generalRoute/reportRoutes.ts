import express from 'express'
import { createReport, viewSpecificReport, viewMyReports, filterReportByDate } from '../../controllers/general/reports'

const router =  express.Router()
// "/" === "/report"
router.route('/')
    .get( viewMyReports )
    .post( createReport )

router.route('/:reportId')
    .get( viewSpecificReport )
    
router.route('/date')
    .get(filterReportByDate)

// router.route('/date')
//     .get(filterReportByAuthor)

export = router