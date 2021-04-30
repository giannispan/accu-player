const uploadFile = require('../middleware/upload');
const { promises: fs } = require('fs');

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
        console.log(error)
        if (error.code == 'LIMIT_FILE_SIZE') {
            return res.status(400).send({
                message: 'File size cannot be larger than 10MB'
            })
        }
        if (error.code == 'FILE_TYPE') {
            return res.status(400).send({
                message: error.message
            })
        }
        res.status(500).send({
            message: `${error}`
        });
    }
}

const getListFiles = async (req, res) => {

    const directoryPath = __basedir + "/resources/static/assets/uploads/";
    try {
        const fileInfos = await fs.readdir(directoryPath);
        res.status(200).send(fileInfos);
    } catch (err) {
        return res.status(500).send({
            message: 'Unable to find files!'
        });
    }
}

// const getListFilesH

const remove = async (req, res) => {

    const filename = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    try {
        await fs.unlink(directoryPath + filename);
        res.status(200).send({
            message: 'File deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Cound not remove the file.' + error
        });
    }

}

module.exports = {
    upload,
    getListFiles,
    remove
}