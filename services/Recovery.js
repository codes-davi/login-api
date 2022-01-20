const knexBuilder  = require('../dbconfig/connection');
const User = require('./User');
const {v4: uuidv4} = require('uuid');

class Recovery{
    async create(email){        
        let user = await User.findByEmail(email);
        
        if (!user) return false;
        
        try {
            await knexBuilder.insert({
                user_id: user.id,
                used: 0,
                token: uuidv4()
            }).table('pass_recovery');
            return true;
        } catch (err) {
            throw Error(err);
        }
    }

    async validate(token){
        let result = await knexBuilder.select('*').where({token: token}).table('pass_recovery');
        
        if(!result.length > 0 || result[0].used != 0) return {status: false};
        else return {status: true, token: result};
    }

    async setUsed(token) {
        try {
            await knexBuilder.update({ used: 1 }).where({ token: token }).table('pass_recovery');
        } catch (err) {
            throw Error(err);
        }
    }
}

module.exports = new Recovery();