const jwt=require('jsonwebtoken');

const verify=(req,res,next)=>{

    var authHeader=req.headers["authorization"];
    if(!authHeader || !authHeader.startsWith("Bearer "))
    {
        return res.status(401).send("No token Provided");
    }
    try{
        var token=authHeader.split(' ')[1];
        var validate=jwt.verify(token,process.env.JWT_SECRET,{
            issuer:process.env.JWT_ISSUER,
            audience:process.env.JWT_AUDIENCE
        });
        req.user=validate;
        next();
    }
    catch{
        res.status(401).send("Appalae po saathanae");
    }
};

module.exports=verify;