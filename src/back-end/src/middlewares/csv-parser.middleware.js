const csv = require('csv-parser');

function csvToJson(req, res, next) {
    if (req.file && req.file.mimetype === 'text/csv') {
        const results = [];
        const stream = req.file.buffer.toString('utf8');
        const parser = csv();
        parser.on('data', (data) => results.push(data));
        parser.on('end', () => {
            req.body = results;
            console.log(req.body)
            next();
        });
        parser.write(stream);
        parser.end();
    } else {
        next();
    }
}
module.exports = { csvToJson }