const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PublicationSchema = new Schema({
  text:{
    type: String,
    required: true
  },
  file:{
    type: String,
    default: ""
  },
  user:{
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
  created_at:{
    type: Date,
    default: Date.now
  }
});

PublicationSchema.plugin(mongoosePaginate);

module.exports = model("Publication", PublicationSchema, "publications");
