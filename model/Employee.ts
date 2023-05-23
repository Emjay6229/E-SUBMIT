import mongoose, { Schema, InferSchemaType } from 'mongoose'
import validator from 'validator'

type Employee = InferSchemaType<typeof Schema>

const employeeSchema = new Schema<Employee>({
    firstName: {
      type: String,
      required: [true, "This field is required"],
      trim: true
    },

    lastName: {
      type: String,
      required: [true, "This field is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [ validator.isEmail, "invalid Email address" ],
    },

    password: {
      type: String,
      required: [true, "This field is required"],
      trim: true,
      minlength: [6, "Minimun password character is 6"]
    },

    userName:  {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
        type: Boolean,
        default: false
      }, 
  
    role: {
        type: String,
        enum : {
           values: ['Developer', 'HR', 'Admin'],
           message: '{VALUE} is not supported'
          },
        default: 'Developer'
      },

    verifyToken: String,
    tokenExpiration: Date
  },

  { timestamps : true, strict: true }
)

export const Employee = mongoose.model("Employee", employeeSchema)

