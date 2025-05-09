const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const FollowSchema = new Schema({

    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User",
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

FollowSchema.plugin(mongoosePaginate);
module.exports = model("Follow", FollowSchema, "follows");
