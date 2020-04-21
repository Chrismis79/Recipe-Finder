const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if(token){
        const secret = process.env.JWT_SECRET || "keep it secret";
        jwt.verify(token, secret, function(err, decodedToken){
            if(err){
                res.status(401).json({message: "Invalid token"});
            }else{
                req.user = decodedToken;
                next();
            }
        })
    }else{
        res.status(400).json({message: "Please try to login again"})
    }
};