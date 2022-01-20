const User = require('../services/User');
const Recovery = require('../services/Recovery');
const jwt = require('jsonwebtoken');
const {secret} = require('../token-config/token-config');
const bcrypt = require('bcrypt');

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

    async delete(req,res){
        let {id} = req.params;
        
        if(!id) return res.sendStatus(400);
        try {
            let rows = await User.delete(id);
            if (rows>0) {
                return res.sendStatus(200);
            } else {
                return res.sendStatus(404);
            }
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async recoverPassword(req,res){
        let {email} = req.body;
        let result = await Recovery.create(email);
        try {
            if (result) {
                return res.sendStatus(200);
            }else{
                return res.sendStatus(404);
            }
        } catch (err) {
            console.log(err);
            return res.sendStatus(500);
        }
    }

    async changePassword(req,res){
        let {token, password} = req.body;
        let validToken = await Recovery.validate(token);

        if (!validToken.status) return res.sendStatus(403); 
        try {
            await User.changePassword(password, validToken.token[0].id, validToken.token[0].token);
            return res.sendStatus(200);
        } catch (err) {
            return res.sendStatus(500);
        }
    }

    async login (req, res){
        let {email, password} = req.body;
        let user = await User.findByEmail(email);
        
        if(!user) return res.sendStatus(404);

        let result = await bcrypt.compare(password, user.password);

        if (!result) return res.sendStatus(401);
        else req.loggedUser = {email: email, role: user.role};
        let token = await jwt.sign({email: email, role: user.role}, secret);
        return res.status(200).json({token: token});
        
    }
}

module.exports = new UsersController();