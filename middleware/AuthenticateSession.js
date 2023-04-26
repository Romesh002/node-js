const jwt = require('jsonwebtoken');

module.exports = AuthenticateSession = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // const token = req.cookies['token']

    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');

        // Get token from array
        const bearerToken = bearer[1];

        // Set the token
        req.token = bearerToken;
        // req.token = token;

        // Verify token
        jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, data) => {
            console.log(data)
            if (err) {
                res.sendStatus(403);
                return;
            }
            req[req.method === 'GET' ? 'query' : 'body'] = { ...req[req.method === 'GET' ? 'query' : 'body'], ...data };
            // if (req.method === 'GET') {
            //     req.query._id = data._id;
            //     req.query._email = data._email;
            //     // req.query.user_id = data.user._id;
            //     // req.query.role = data.user.role;
            // } else if (req.method === 'POST')
            //     req.body._id = data._id;
            // req.body._email = data._email;
            next();
        });
    } else {
        res.sendStatus(403);
        return;
    }
}