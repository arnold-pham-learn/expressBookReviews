const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if(username){
    return !(users.filter((u) => u.username === username).length > 0);
  }else{
    return true;
  }
}

const authenticatedUser = (username,password)=>{
//write code to check if username and password match the one we have in records.
  let user = null;
  users.forEach((u) => {
    if(u.username === username && u.password === password){
      user = u;
    }
  })
  return user;
}

regd_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Unable to register user. Missed username or password!"});
  }
  if(!isValid(username)){
    return res.status(404).json({message: `User ${username} already exists!`});
  }

  users.push({
    "username": username,
    "password": password
  });
  return res.status(200).json({message: "User successfully registered. Now you can login"});
})

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message: "Unable to login user. Missed username or password!"});
  }
  let user = authenticatedUser(username, password);
  console.log(user.username);
  if(user){
    let token = jwt.sign({data: password}, 'cpZSR2TaZUlonj5X3EPqg7mxApDKh5wu', {expiresIn: 60*60});
    req.session.authenication = {
      token, username
    };
    return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(404).json({ message: "Invalid Login. Check username and password" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
