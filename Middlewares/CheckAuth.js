import jwt from "jsonwebtoken"

export const CheckAuth = (req, res, next) => {
    try {
        var token = req.headers.authorization.split(" ");
        var decoded = jwt.verify(token[1], "test");
        req.userData = decoded;
        next(); 
    } catch (err) {
        console.log("error");
        res.status(401).json({
            message: "Authentication Failed"
        });
    }
}
