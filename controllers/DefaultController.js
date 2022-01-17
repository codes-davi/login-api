class DefaultController{

    async index(req, res){
        res.send('running');
    }

}

module.exports = new DefaultController();