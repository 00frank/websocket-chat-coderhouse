const mongoose = require("mongoose");

const messagesCollection = "Messages";

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const messagesModel = mongoose.model(messagesCollection, messagesSchema);
module.exports = messagesModel;
