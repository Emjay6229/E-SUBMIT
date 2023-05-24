import mongoose, { Schema, InferSchemaType } from 'mongoose'
type Report = InferSchemaType<typeof Schema>

const reportSchema = new Schema<Report>({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
   author: {
		type: Schema.Types.ObjectId,
		ref: "Employee",
		required: true,
	},
	adminComment: {
		type: [ Schema.Types.ObjectId ],
        ref: "Comment",
	}
},
	{ timestamps: true }
)

export const Report = mongoose.model("Reports", reportSchema)
