import { Employee } from "../../model/Employee"
import { Request, Response } from 'express'

// MANAGE EMPLOYEES
// VIEW ALL EMPLOYEE
export const viewAllEmployees = async ( req: Request, res: Response ) => {
    try {
        const employees = await Employee.find()
            .select( "firstName lastName userName email role isVerified isActive" )

        if(!employees) {
            return res.send("Could not retrieve any employee")
        }
        
        return res.status(200)
            .json({ 
                employees, 
                numOfEmployees: employees.length 
            });
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

// VIEW ONE EMPLOYEE
export const viewEmployee = async ( req: Request, res: Response ) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })
            .select( "firstName lastName userName email isActive isVerified role" )

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

       return res.status(200).json(employee);
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const deactivateEmployee = async ( req: Request, res: Response ) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

        if(employee.isActive === false) {
            return res.status(200).json({ message: `${employee.userName} is already inactive` })
        } 

        employee.isActive = false
        await employee.save()

        return res.status(200).json({ message: `${employee.userName} has been successfully deactivated` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}

export const activateEmployee = async ( req: Request, res: Response ) => {
    try {
        const employee = await Employee.findOne({ _id: req.params.id })

        if(!employee) {
            return res.send("Could not retrieve any employee")
        }

        if(employee.isActive === true) {
            return res.status(200).json({ message: `${employee.userName} is already active` })
        } 

        employee.isActive = true
        await employee.save()

        return res.status(200).json({ message: `${employee.userName} has been successfully deactivated` })
    } catch (err: any) {
        console.error(err)
        res.status(404).json(err.message)
    }
}