const AWS = require('aws-sdk');

// Create an S3 client instance
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: 'us-east-2',
});

// Middleware function to handle file uploads to S3
const uploadToS3 = async (req, res, next) => {
    if(!req.file){
        next()
        return
    }

    // Set up the parameters for the S3 upload
    const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `uploads/${req.originalUrl.split("/")[1]}/${Date.now()}.jpg`,
        Body: req.file.buffer,
    };

    try {
        // Perform the upload to S3
        const data = await s3.upload(uploadParams).promise();

        // Update the image_url field in the request body with the S3 key of the uploaded file
        req.body.image_url = data.Key;
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        res.status(400).send({ message: "Something went wrong unexpectedly, Please find the log "});
    }

    // Continue to the next middleware function
    next();
};

const deleteFromS3 = async (key) => {
    // Set up the parameters for the S3 upload
    const deleteParams = {
        Bucket: process.env.S3_BUCKET,
        Key: key
    };

    try {
        // Perform the upload to S3
        const data = await s3.deleteObject(deleteParams).promise();
        return data
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        return error
    }
};

// Function to get a signed URL for a file in S3
const getSignedUrl = async (key) => {
    try {
        // Get the signed URL for the specified S3 key
        return s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Expires: parseInt(process.env.PRESIGNED_LINK_EXPIRE),
        })
    } catch (error) {
        // return bad request
        global.logger.error(error.stack)
        return error;
    }
};

module.exports = { uploadToS3, getSignedUrl, deleteFromS3 };
