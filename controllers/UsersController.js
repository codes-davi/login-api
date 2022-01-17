const User = require('../services/User');

class UsersController{
    
    async create(req,res){

        let {email, name, password} = req.body;

        if(!email||!password) return res.sendStatus(400);

        try {
            let existsEmail = await User.findEmail(email);
            if (existsEmail) return res.status(409).json('Email already exists');
            await User.create(name, email, password);
            return res.sendStatus(200);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
}

module.exports = new UsersController();