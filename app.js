const mongoose = require('mongoose');
const Book = require('./models/book');
const Member = require('./models/member');
const readline = require("readline-sync");
const bookFun = require('./utils/functions/bookFun');
const memberFun = require('./utils/functions/memberFun');

const connect = async () => { 
    await mongoose.connect('mongodb://localhost:27017/lis', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then( () => {
      console.log('Connected to database ')
  }).catch( (err) => {
      console.error(`Error connecting to the database. \n${err}`);
  })
}

const readUserName = async () => {
  console.log("Enter you username : ");
  let clerkUserName = readline.question();
  return clerkUserName;
}

const readPasword = async () => {
  console.log("Enter you Password :")
  let clerkPassword = readline.question();
  return clerkPassword;
}

const readMainMenuChoice = async() => {
  console.log("\n------------ Main Menu -------------")
  console.log("1 - Add Book");
  console.log("2 - Delete Book");
  console.log("3 - Search Book");
  console.log("4 - Issue Book");
  console.log("5 - Return Book");
  console.log("6 - Reserve Book");
  console.log("9 - Add User\n");


  console.log("Enter your choice :");
  let choice = Number(readline.question());
  return choice;
}

const readAddBookDetails = async () => {
  console.log("\n------------ Enter Book Details -------------");
  console.log("Enter ISBN number : ");
  let isbn = readline.question();
  console.log("Enter Book name : ");
  let name = readline.question();
  console.log("Enter Book Author : ");
  let author = readline.question();
  console.log("Enter Reck number : ");
  let reckno = readline.question();
  console.log("------------------------------------------------");

  return {
    isbn : isbn,
    name : name,
    author : author,
    reckno : reckno
  }
}

const readDeleteBookDetails = async () => {
  console.log("\n------------ Enter Book Details -------------");
  console.log("Enter ISBN number of the book to delete : ");
  let isbn = readline.question();
  
  console.log("------------------------------------------------");

  return {
    isbn : isbn
  }
}

const readSearchBookDetails = async () => {
  console.log("\n------------ Enter Book Details -------------");
  console.log("Enter ISBN number of the book to search : ");
  let isbn = readline.question();
  
  console.log("------------------------------------------------");

  return {
    isbn : isbn
  }
}


const readAddMemberDetails = async () => {
  console.log("\n------------ Enter Member Details to add -------------\n");
  console.log("Enter Member Name :");
  let name = readline.question();
  console.log("\n___________________________________________________________");
  console.log("      1 - Undergraduate Student\n      2 - Post Graduate Student\n      3 - Research Scholar\n      4 - Faculty Member\n")
  console.log("Select type of Member to add : \n");
  let choice = Number(readline.question());
  let memtype;
  if(choice === 1) {
    memtype = "ug"
  } else if(choice === 2) {
    memtype = "pg"
  } else if(choice === 3) {
    memtype = "rs"
  } else if(choice === 4) {
    memtype = "fm"
  }

  return {
    name: name,
    memType: memtype
  }
}


const readIssueBookDetails = async () => {
  console.log("\n------------ Enter Book & Member Details -------------");
  console.log("Enter ISBN number of the book to issue : ");
  let isbn = readline.question();
  console.log("Enter Member ID of the member : ");
  let memid = readline.question();
  
  console.log("------------------------------------------------");

  return {
    isbn : isbn,
    memid: memid
  }
}


const readReturnBookDetails = async () => {
  console.log("\n------------ Enter Book & Member Details -------------");
  console.log("Enter ISBN number of the book to return : ");
  let isbn = readline.question();
  console.log("Enter Member ID of the member : ");
  let memid = readline.question();
  
  console.log("------------------------------------------------");

  return {
    isbn : isbn,
    memid: memid
  }
}

const readReserveBookDetails = async () => {
  console.log("\n------------ Enter Book & Member Details -------------");
  console.log("Enter ISBN number of the book to reserve : ");
  let isbn = readline.question();
  console.log("Enter Member ID of the member : ");
  let memid = readline.question();
  
  console.log("------------------------------------------------");

  return {
    isbn : isbn,
    memid: memid
  }
}

const mainMenu = async () => {
  let mainMenuChoice = Number(await readMainMenuChoice());
  switch (mainMenuChoice) {
    case 1:
      let bookDetails = await readAddBookDetails();
      let addBookMsg = await bookFun.addBook(bookDetails.isbn, bookDetails.name, bookDetails.author, bookDetails.reckno);
      console.log(addBookMsg);
      break;
    
    case 2:

      let bookIsbn = await readDeleteBookDetails();
      let deleteBookMsg = await bookFun.deleteBook(bookIsbn.isbn);
      console.log(deleteBookMsg);
      
      break;
    
    case 3:

      let bookIsbnForSearch = await readSearchBookDetails();
      let searchBookMsg = await bookFun.searchBook(bookIsbnForSearch.isbn);
      console.log(searchBookMsg);
    
      break;
    
    case 4:

      let issueBookDetails = await readIssueBookDetails();
      let issueBookMsg = await bookFun.issueBook(issueBookDetails.isbn,issueBookDetails.memid);
      console.log(issueBookMsg);
      
      break;
    
    case 5:

      let returnBookDetails = await readReturnBookDetails();
      let returnBookMsg = await bookFun.returnBook(returnBookDetails.isbn,returnBookDetails.memid);
      console.log(returnBookMsg);
      // console.log("Retured Book");
      
      break;
    
    case 6:

      let reserveBookDetails = await readReserveBookDetails();
      let reserveBookMsg = await bookFun.reserveBook(reserveBookDetails.isbn,reserveBookDetails.memid);
      console.log(reserveBookMsg);
      // console.log("Reserved Book");
      
      break;
    
    case 9:

      let memberInfo = await readAddMemberDetails();
      let addMemberMsg = await memberFun.addMember(memberInfo.name, memberInfo.memType);
      console.log(addMemberMsg);


      // console.log("Added User");
      
      break;

    default:
      console.log("Hit deafult");
      // mainMenuChoice = readMainMenuChoice();
      // break;
  }
}

const main = async () => {
  await connect();

  let clerkUserName = await readUserName();
  while(clerkUserName != 'clerk') {
    console.log("Wrong Username, please try again.")
    clerkUserName = await readUserName();
  }

  let clerkPassword = await readPasword();
  while(clerkPassword != 'clerk') {
    console.log("Wrong Password, please try again.")
    clerkPassword = await readPasword();
  }

  await mainMenu();
  console.log("Enter 0 to exit, anything else to go to main menu");
  let inp = Number(readline.question());
  while(inp != 0) {
    await mainMenu();
    console.log("Enter 0 to exit, anything else to go to main menu");
    inp = Number(readline.question());
  }

} 

main();
