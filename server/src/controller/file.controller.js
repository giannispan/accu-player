const uploadFile = require('../middleware/upload');
const fs = require('fs');

const upload = async (req,res) => {
    try {
        await uploadFile(req, res);

        if (req.file === undefined) {
            return res.status(400).send({ message: 'Please choose a file!'})
        }
        res.status(200).send({
            message: 'Uploaded file successfully:' + req.file.originalname
        });
    } catch (error) {
        if (error.code == 'LIMIT_FILE_SIZE') {
            return res.status(400).send({
                message: 'File size cannot be larger than 10MB'
            })
        }
        res.status(500).send({
            message: `${error}`
        });
    }
}

module.exports = {
    upload
}