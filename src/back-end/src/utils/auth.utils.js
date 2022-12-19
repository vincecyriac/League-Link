const { sign } = require("jsonwebtoken");

const generateToken = (userData) => {
    const accessToken = sign(
        {
            id: userData.id,
            password: userData.password
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
    );
    const refreshToken = sign(
        {
            id: userData.user_id,
            password: userData.password
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
    );
    return { 
        accessToken: accessToken, 
        refreshToken: refreshToken,
        userId : userData.user_id,
        email : userData.email
    }
}

module.exports = { generateToken }