import mongoose, { Schema, InferSchemaType } from 'mongoose'

type Comment = InferSchemaType<typeof Schema>

const commentSchema = new Schema<Comment>({
	comment: {
        	type: String,
			required: true,
    	},
   	author: {
		type: Schema.Types.ObjectId,
		ref: "Employee"
	},
	report: {
		type: Schema.Types.ObjectId,
		ref: "Report"
	},
},
	{ timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)
