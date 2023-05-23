import { Employee } from "../../model/Employee"
import { Request, Response } from 'express'

export const makeAdmin = async (req:Request, res: Response) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

        if(employee.role === "Admin") {
            return res.status(200).json({ message: `${employee.userName} is already Admin` })
        } 

        employee.role = "Admin"
        employee.save()
        return res.status(200).json({ message: `${employee.userName} has been successfully set to Admin`})
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const makeHR = async ( req: Request, res: Response ) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

        if(employee.role === "HR") {
            return res.status(200).json({ message: `${employee.userName} is already HR` })
        } 

        employee.role = "HR"
        employee.save()
        return res.status(200).json({ message: `${employee.userName} has been successfully set to HR` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}


export const makeDev = async ( req: Request, res: Response ) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

        if(employee.role === "Developer") {
            return res.status(200).json({ message: `${employee.userName} is already a Developer` })
        } 

        employee.role = "Developer"
        employee.save()
        return res.status(200).json({ message: `${employee.userName} has been successfully set to Developer` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}