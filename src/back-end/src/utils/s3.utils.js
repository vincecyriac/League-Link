const AWS = require('aws-sdk')
const { BadRequest } = require('../utils/errors.utils');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: 'us-east-2'
})

const uploadToS3 = async (req, res, next) => {
    const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: `uploads${req.originalUrl}/${Date.now()}.jpg`,
        Body: req.file.buffer,
    }
    await s3.upload(uploadParams, (err, data) => {
        if (err) {
            throw new BadRequest(err,400)
        } else {
            req.body.image_url = data.Key
            next()
        }
    })
}

const getSignedUrl = async(key) => {
    const url = await s3.getSignedUrl('getObject', {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Expires: parseInt(process.env.PRESIGNED_LINK_EXPIRE)
    })
    return url
}

module.exports = { uploadToS3, getSignedUrl }