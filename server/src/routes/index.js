const express = require('express');
const router = express.Router();
const controller = require('../controller/file.controller');

let routes = (app) => {

    router.post('/api/upload', controller.upload);
    router.get('/api/files', controller.getListFiles);
    router.delete('/api/file/:name', controller.remove);

    app.use(router);
}

module.exports = routes;