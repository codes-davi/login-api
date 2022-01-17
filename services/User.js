const knexBuilder  = require('../dbconfig/connection');
const bcrypt = require('bcrypt');

class User{

    async create(name, email, password){
        try {
            let hash = await bcrypt.hash(password, 10);
            await knexBuilder.insert({name, email, password: hash, role: 0}).table('users');
        } catch (err) {
            throw Error(err);
        }
    }

    async findEmail(email){
        try {
            let row = await knexBuilder.select('*').from('users').where({email: email});
            if (row.length > 0) return true;
            else return false;
        } catch (err) {
            throw Error(err);
        }
    }

    async findAll(){
        try {
            let result = await knexBuilder.select(['id', 'name', 'email','role']).table('users');
            if (result.length > 0) return result;
            else return undefined;
        } catch (err) {
            throw Error(err);
        }
    }

    async findById(id){
        try {
            let result = await knexBuilder.select(['id', 'name', 'email','role']).where({id:id}).table('users');
            if (result.length > 0) return result[0];
            else return undefined;
        } catch (err) {
            throw Error(err);
        }
    }
}

module.exports = new User();