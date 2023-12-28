import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const ImageSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.ObjectId,
        ref: "User"
    }
}, { timestamps: true })
ImageSchema.plugin(mongooseAggregatePaginate)
export const Image = mongoose.model("Image", ImageSchema)