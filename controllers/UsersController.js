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

    async index(req,res){
        try {
            let users = await User.findAll();
            res.json(users);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async findOne(req,res){
        let {id} = req.params;
        try {
            let user = await User.findById(id);
            if(user) return res.json(user);
            else return res.sendStatus(404);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    async edit(req,res){
        let {id, name, email, role} = req.body;
        let editUser = {};
        
        if(!id || (!name && !email)) return res.sendStatus(400);

        editUser.name = name;
        editUser.id = id;
        
        try {
            let user = await User.findById(parseInt(id));

            if (!user) return res.status(404).json('User not found');

            if (email) {
                let existsEmail = await User.findEmail(email);
                if (existsEmail) {
                    return res.status(400).json('Email not available');
                } else if (email != user.email) {
                    editUser.email = email;
                }
            }
            
            if (role) editUser.role = role;
            
            await User.update(editUser);

            return res.sendStatus(200);
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        
    }
}

module.exports = new UsersController();