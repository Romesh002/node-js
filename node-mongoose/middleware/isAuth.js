module.exports = (req, res, next) => {
    console.log(req);

    if (!req.session.isLoggedin) {
        return res.redirect('/login')
    }
    next();
}
