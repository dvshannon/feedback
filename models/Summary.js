var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SummarySchema = new Schema({
  title: String,
  body: String
});

const Summary = mongoose.model("Summary", SummarySchema);

// export the Summary model
module.exports = Summary;
