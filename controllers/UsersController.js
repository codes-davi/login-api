class UsersController{
    
    async create(req,res){

        let {email, name, password} = req.body;

        if(!email||!password) return res.sendStatus(400);

        res.send(req.body);
    }
}

module.exports = new UsersController();