import jwt from 'jsonwebtoken';

const validateToken = async (req, res, next) => {
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