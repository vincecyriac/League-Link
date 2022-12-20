const { sign } = require("jsonwebtoken");

const generateToken = (userData) => {
    const accessToken = sign(
        {
            email: userData.email,
            id : userData.id,
            password: userData.password,
            type : 0
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
    );
    const refreshToken = sign(
        {
            email: userData.email,
            password: userData.password,
            type : 1
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
    );
    return { 
        userId : userData.id,
        email : userData.email,
        accessToken: accessToken, 
        refreshToken: refreshToken
    }
}

module.exports = { generateToken }