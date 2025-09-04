import jwt from 'jsonwebtoken';

const validateToken = async (req, res, next) => {
    // const token;
    // const authHeader = req.headers.authorization || req.headers.Authorization;

    // if (authHeader && authHeader.startsWith("Bearer")) {
    //     token = authHeader.split(" ")[1];
    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //         if (err) {
    //             res.status(401);
    //             throw new Error("User is not authorized");
    //         }
    //         // console.log(decoded);
    //         req.user = decoded.user;
    //         next();
    //     });
    // }

    const token = req.cookies['accessToken'];

    if(!token) {
        res.status(401).json({ status: 401 , message: 'unauthorized' });
        return false;
    }

    try {
        const validate = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );
        req.user = validate;
    } catch(err) {
        console.log(err);
        res.clearCookie("accessToken");
        res.status(401).json({ status: 401, message: "your session expired, please log in again" });
    }

    next();
};

export default validateToken;