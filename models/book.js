const mongoose = require('mongoose');


const BookSchema = new mongoose.Schema({
    isbn : {
        type: String,
        require: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    reckno: {
        type: Number,
        required: true
    },
    issuedBy: {
        type: { memid: mongoose.Schema.Types.ObjectId,
                issueDate: Date
        },
        default: null
    },
    reservedBy: {
        type: { memid: mongoose.Schema.Types.ObjectId,
            reserveDate: Date
    },
        default: null
    }

  });
  
  const Book = mongoose.model("Book", BookSchema);
  
  module.exports = Book;