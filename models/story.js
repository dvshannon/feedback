const mongoose = require('mongoose');
// saves a reference to the schema
const Schema = mongoose.Schema;

const StorySchema = new Schema ({
    headline: {
        type: String,
        required: true
    },
    summaries: {
        type: Schema.Types.ObjectId,
        ref: "Summary"
    },
    url: {
        type: String,
        required: true
    }
})

const Story = mongoose.model("Story", StorySchema);

// Export the Story model
module.exports = Story;
