function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).send("Youre not authorized to access this");
        }
        next();
    }
}
module.exports=authorize;
