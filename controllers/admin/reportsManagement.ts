// IMPORT DEPENDENCIES
import {config} from 'dotenv'
import { Report } from "../../model/Report"
import { Request, Response } from 'express'
import { sendToMail } from "../utils/sendToMail"
import { decodeToken } from '../../middleware/decodeToken'
import { JwtPayload } from 'jsonwebtoken'
import { Comment } from "../../model/Comment"

config()

// Message data parameters
const domain = process.env.DOMAIN as string
const key = process.env.API_KEY as string

// view all reports for a specific employee
export const viewAllReportForEmployee = async(req: Request, res: Response) => {
    try {
        const report = await Report.find({ author: req.params.id })
            .populate({ path: "author",  select: "firstName lastName userName email role"})
            .populate({ path: "adminComment", select: "comment author" })
            
        res.status(200).json(report)
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// view a single a Report
export const viewSingleReport = async(req: Request, res: Response) => {
    try {
        console.log(req.params.reportId)
        const report = await Report.findOne({ _id: req.params.reportId })
            .populate({ path: "author",  select: "firstName lastName userName email role" })
            .populate({ path: "adminComment", select: "comment author" })

            console.log(report)

        res.status(200).json(report)
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// add comments to Reports
export const addCommentToReport = async(req: Request, res: Response) => {
    try{
        const { comment } = req.body;
        const decoded = decodeToken(req.cookies.jwt) as JwtPayload
        const report = await Report.findOne({ _id: req.params.reportId })
            .populate({ path: "author", select: "firstName lastName userName email role" })
            .populate({ path: "adminComment",  select: "comment author" })

        if(!report) {
            return res.send("Could not retrieve any report")
        }

        const reportComment = new Comment( {
            comment, author: report.author._id, report: report._id
        })

        report.adminComment = reportComment._id

        // console.log(employee)
        await reportComment.save()
        await report.save()
    
        const messageData = {
            from: decoded.email,
            to: report.author.email,
            subject: 'COMMENT ON YOUR REPORT',
            html: `<p>A comment has been added to your report by ${decoded.userName}</p>`
        };

        sendToMail(domain, key, messageData)

        return res.status(200).json({
            New_Comment: reportComment.comment,
            CommentId: reportComment._id
        })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}
