const { sign } = require("jsonwebtoken");

// Function to generate a JSON web token
const generateToken = (userData) => {
    try {
        // Create an access token that expires in 1 hour
        const accessToken = sign(
            {
                email: userData.email,
                id: userData.id,
                password: userData.password,
                type: 0,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        // Create a refresh token that expires in 1 day
        const refreshToken = sign(
            {
                email: userData.email,
                password: userData.password,
                type: 1,
            },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        );

        // Return the user ID, email, access token, and refresh token
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    } catch (error) {
        // If an error occurred, return the error message
        return { error: error.message };
    }
};

module.exports = { generateToken };
