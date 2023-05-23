//IMPORT DEPENDENCIES
import { Request, Response } from 'express'
import { Report } from '../../model/Report';
import { decodeToken } from "../../middleware/decodeToken"
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';


// MANAGE REPORT
// create and submit report 
export const createReport = async (req: Request, res: Response) => {
    try {
      const { title, description } = req.body;
      const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
      const report = new Report({ 
        title, author: decodedToken.userId, description, 
      });

      // Submit created report to database
      await report.save();
      res.status(201).json(report);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }

  // View all Report
  export const viewMyReports = async (req: Request, res: Response) => {
    try {
      const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
      const reports = await Report.find({ author: decodedToken.userId })
        .populate({ path: "author",  select: "firstName lastName userName email _id"})
        .populate("adminComment")

      console.log(reports)

      if (!reports) {
        console.log("Reports could not be retrieved")
        return res.status(StatusCodes.NOT_FOUND).send('Report not found');
      }

      res.status(StatusCodes.OK).json({ reports, numOfReports: reports.length });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }

// get report by report id
export const viewSpecificReport = async (req: Request, res: Response) => {
    try {
      const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload
      const report = await Report.findOne({ author: decodedToken.userId, _id: req.params.reportId })
        .populate({ path: "author",  select: "firstName lastName userName email _id"})
        .populate("adminComment")

      console.log(report)

      if (!report) {
        console.log("Report could not be retrieved")
        return res.status(StatusCodes.NOT_FOUND).send('Report not found');
      }
		
      res.status(200).json(report);
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }

 // filter report by date
export const filterReportByDate = async (req: Request, res: Response) => {
    try {
        let { startDate, endDate } = req.query as { startDate: string, endDate: string };
        const decodedToken = decodeToken(req.cookies.jwt) as JwtPayload

        let queryObject: any = {
          author: decodedToken.userId
        }

        if (startDate) {
          queryObject.createdAt = { $gte: new Date(startDate) }
        }

        if(startDate && endDate) {
            queryObject.createdAt = { 
              $gte: new Date(startDate), 
              $lte: new Date(endDate)
            }
        }

        const reports = await Report.find(queryObject)

        if (!reports) {
          console.log("Report could not be retrieved")
          return res.status(StatusCodes.NOT_FOUND).send('Report not found');
        }
      
        res.status(200).json({ reports, numOfReports: reports.length });
      } catch (error: any) {
        console.error(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
      }
  }

