const helper = {};

helper.isAuthenticated = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "no autorizado");
    res.redirect("/users/signin");
}

module.exports = helper