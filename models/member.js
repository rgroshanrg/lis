const mongoose = require('mongoose');


const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    memid: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: ""
    },
    issuedBooks: [mongoose.Schema.Types.ObjectId],
    reservedBooks: [mongoose.Schema.Types.ObjectId]

  });
  
  const Member = mongoose.model("Member", MemberSchema);
  
  module.exports = Member;