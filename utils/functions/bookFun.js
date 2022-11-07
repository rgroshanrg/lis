const mongoose = require('mongoose');
const Book = require('../../models/book');
const Member = require('../../models/member');
const LIMITS = require('../limits');

const addBook = async (isbn, name, author, reckno) => {
    let bookSchemaFields = {
        isbn: isbn,
        name: name,
        author: author,
        reckno: Number(reckno)
    }
    try {
        let newBook = await new Book(bookSchemaFields).save();
        return "Book added successfully!";
    } catch(err) {
        return "Error while adding the Book, please review all the parameters"
    }
}

const deleteBook = async (isbn) => {
    try {
        await Book.deleteOne({isbn: isbn});
        return "Book deleted successfully!";
    } catch(err) {
        return "Error while deleting the Book, please review all the parameters"
    }
}

const searchBook = async (isbn) => {
    try {
        var book = await Book.findOne({isbn: isbn});
        var issuedBy;
        var reservedBy;

        if(book.issuedBy != null) {
            let user = await Member.findOne({_id: book.issuedBy.memid});
            issuedBy = {
                username: user.name,
                memid: user.memid,
                date: book.issuedBy.issueDate
            }
        }

        if(book.reservedBy != null) {
            let user = await Member.findOne({_id: book.reservedBy.memid});
            reservedBy = {
                username: user.name,
                memid: user.memid,
                date: book.reservedBy.reserveDate
            }
        }
        var msg = "\n\n---------------------- Searched Book Details -------------------------\nBookName: " + book.name + "\nISBN: " + 
                book.isbn + "\nAuthor: " + book.author + "\nRack Number: " + String(book.reckno) + "\n\n";
        if(issuedBy) {
            msg += "Issued By: \n" + "      Name: " + issuedBy.username + "\n      Member Id: " + issuedBy.memid +
                "\n      Issue Date:" + String(issuedBy.date) + "\n\n"
        }
        if(reservedBy) {
            msg += "Reserved By: \n" + "      Name: " + reservedBy.username + "\n      Member Id: " + reservedBy.memid +
                "\n      Reserve Date:" + String(reservedBy.date) + "\n\n"
        }

        return msg;
    } catch(err) {
        return "Error while searching the Book, please review all the parameters"
    }
}

const issueBook = async (isbn, memid) => {
    try {
        var book = await Book.findOne({isbn : isbn});
        if(book.issuedBy != null) {
            throw "Error while issuing the Book, book is already issued by someone"
        }

        let user = await Member.findOne({memid: memid});

        if((user.type == 'ug' && (user.issuedBooks.length >= LIMITS.UG.count)) ||
           (user.type == 'pg' && (user.issuedBooks.length >= LIMITS.PG.count)) ||
           (user.type == 'rs' && (user.issuedBooks.length >= LIMITS.RS.count)) ||
           (user.type == 'fm' && (user.issuedBooks.length >= LIMITS.FM.count))) {

            throw "Issuing quota for the particular member has exceeded";
        }

        if(book.reservedBy != null) {
            if(String(book.reservedBy.memid) !== String(user._id)) {
                throw "Error while issuing the Book, book is reserved by someone"
            }
            let tbook = await Book.findOneAndUpdate({isbn: isbn}, {reservedBy: null});
            await Member.findOneAndUpdate({memid: memid}, {$pull : {reservedBooks: book._id}});
        }

        

        let issue = {
            memid: user._id,
            issueDate: new Date
        };

        await Book.findOneAndUpdate({isbn: isbn}, {issuedBy: issue});
        user.issuedBooks.push(book._id);
        await user.save();
        return "Book Successfully Issued to : " + user.name;
    } catch(err) {
        return err;
    }
}

const returnBook = async (isbn, memid) => {
    try {
        let book = await Book.findOne({isbn: isbn});
        let startDate = book.issuedBy.issueDate;

        let user = await Member.findOne({memid: memid});
        // console.log(user._id);
        // console.log(book.issuedBy.memid);
        if(String(book.issuedBy.memid) !== String(user._id)) {
            return "Error while returning the book, book is not issued by this member.."
        }

        book.issuedBy = null;
        await book.save();

        await Member.findOneAndUpdate({memid: memid}, {$pull : {issuedBooks: book._id}});


        let fine = 0;
        let timeDifference = Math.abs((new Date) - startDate);
        let noOfDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
        if(user.type == 'ug' || user.type == 'pg')
            noOfDays -= 30;
        else if(user.type == 'rs')
            noOfDays -= 90;
        else if(user.type == 'fm')
            noOfDays -= 180;
        
        if(noOfDays >= 0) {
            fine = noOfDays * 1;
        }

        return "Return successful. Total fine: " + fine + "\n";

    } catch(err) {
        return "Error while returning the book, please review all the parameters";
    }
}

const reserveBook = async (isbn, memid) => {
    try {
        var user = await Member.findOne({memid: memid});
        var book = await Book.findOne({isbn: isbn});
        if(book.reservedBy != null) {
            return "Book is Already reserved by someone."
        }
        if(book.issuedBy == null) {
            return "Book is open for Issuing, no need for reserve."
        }
        book.reservedBy = {
            memid: user._id,
            reserveDate: new Date
        }
        user.reservedBooks.push(book._id);
        await book.save();
        await user.save();

        return "Reserved successfully."

    } catch(err) {
        return "Error while reserving the book, please review all the parameters";
    }
}

module.exports = {
    addBook,
    deleteBook,
    searchBook,
    issueBook,
    returnBook,
    reserveBook
}