class DefaultController{

    async index(req, res) {

        let hateoas = {
            _links: {

                basic_operations: [{
                    href: 'http://localhost/user',
                    method: 'POST',
                    rel: 'create_user',
                    body: ['name', 'email', 'password'],
                    type: 'json'
                }, {
                    href: 'http://localhost/login',
                    method: 'POST',
                    rel: 'login',
                    body: ['email', 'password'],
                    type: 'json'
                }]

            }
        };

        res.statusCode = 200;
        return res.json(hateoas);
    }

}

module.exports = new DefaultController();