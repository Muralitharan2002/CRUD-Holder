const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    try {
        const cookieToken = req.cookies.UserToken;
        console.log(cookieToken)

        if (cookieToken) {
            jwt.verify(cookieToken, process.env.SECRETE_KEY, (err, data) => {
                if (err) {
                    console.log("jwtAuthenticate verification failed", err);
                    return res.json({ message: "jwtAuthenticate verification failed" });
                } else {
                    req.user = data;
                    next();
                }
            })
        } else {
            console.log("jwtAuthenticate verification token missing");
            return res.json({ message: "jwtAuthenticate verification token missing" });
        }
    } catch (err) {
        console.log(err);
    }

};


const authenticateAdminJWT = (req, res, next) => {
    try {
        const cookieToken = req.cookies.UserToken;
        console.log(cookieToken)

        if (cookieToken) {
            jwt.verify(cookieToken, process.env.ADMIN_SECRETE_KEY, (err, data) => {
                if (err) {
                    console.log("jwtAuthenticate verification failed", err);
                    return res.json({ message: "jwtAuthenticate verification failed" });
                } else {
                    req.user = data;
                    next();
                }
            })
        } else {
            console.log("jwtAuthenticate verification token missing");
            return res.json({ message: "jwtAuthenticate verification token missing" });
        }
    } catch (err) {
        console.log(err);
    }

};

module.exports = { authenticateJWT, authenticateAdminJWT }

