import jwt from 'jsonwebtoken';

const validateToken = (req, res, next) => {
    const [type, token] = req.headers.authorization?.split(' ') || [];

    if (!type || !token) {
        res.status(401);
        throw new Error("Unauthorized");
    }

    if (type !== 'Bearer') {
        res.status(403);
        throw new Error("Invalid Request");
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
        );
        req.user = payload;
    } catch {
        res.status(401);
        throw new Error("Unauthorized");
    }

    next();
};

export default validateToken;