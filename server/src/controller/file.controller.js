const uploadFile = require('../middleware/upload');
const fs = require('fs');

const upload = async (req, res) => {
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

const getListFiles = (req, res) => {

    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send({
                message: 'Unable to find files!'
            })
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file
            });
        });
        res.status(200).send(fileInfos);
    });
}

const remove = (req, res) => {

    const filename = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    fs.unlink(directoryPath + filename, (err) => {
        if (err) {
            return res.status(500).send({
                message: 'Cound not remove the file.' + err
            });
        }

        res.status(200).send({
            message: 'File deleted successfully'
        });
    });

}

module.exports = {
    upload,
    getListFiles,
    remove
}