import axios from 'axios';

// Server url
const url = 'http://localhost:5000/api/';

class FileService {

    // Upload file 
    static upload(file) {
        
        let formData = new FormData();
        formData.append("file", file);
        return axios.post(`${url}upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    // Get files
    static getFiles() {
        return axios.get(`${url}files`);
    }

    // Remove file
    static removeFile(file) {
        return axios.delete(`${url}files/${file}`);
    }
}

export default FileService;