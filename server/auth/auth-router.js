const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");

//REGISTER

router.post("/register", validateUser, (req, res) => {
  let user = req.body;
  
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;    
     
       Users.add(user)
        .then(addedUser => {
          const token = signToken(addedUser)
          res.status(201).json({
            user: addedUser,
            token,
            message: "User registered successfully"
          });
        })
        .catch(err => {
          res.status(500).json({errorMessage: err.message});
        });  
       
    })
  

//LOGIN 

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findByUserName(username)
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        const { password, ...restUser } = user;

        res.status(200).json({
          token,
          user: restUser,
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: "Invalid Username or Password" });
      }
    })
    .catch(err => {
      res.status(500).json({
        err,
        message: "Error logging in user"
      });
    });
});


function signToken(user) {
  const payload = {
    username: user.username
  };
  const secret = process.env.JWT_SECRET || "keep it secret";
  const options = {
    expiresIn: "24hr"
  };
  return jwt.sign(payload, secret, options);
}

function validateUser(req, res, next){
  
  Users.findByUserName(req.body.username)
      .then(user => {
        if(user){
          res.status(403).json({message: "Username already exists, please choose a new one."})
        
        }else{
          next();
        }

      })
    
}

module.exports = router;