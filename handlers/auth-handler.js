const jwt = require('jsonwebtoken');
const {secret} = require('../token-config/token-config');

module.exports = async (req,res,next) =>{
    const authToken = req.headers['authorization'];

    if(!authToken) return res.sendStatus(403);

    const bearer = authToken.split(' ');
    let token = bearer[1];

    jwt.verify(token, secret, (err, data) => {
        
        if (err) return res.sendStatus(401);
        if(data.role == 1){
            req.token = token;
            req.loggedUser = {user: data.user};
            next();
        }
        else return res.sendStatus(403);

    });
};