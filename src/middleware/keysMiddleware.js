const dotenv = require('dotenv');
dotenv.config();

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = process.env.KEYS_PATH;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const deviceId = req.params.id;
        let fileName;

        switch (file.fieldname) {
            case 'certificate':
                fileName = `${deviceId}_certificate.pem.key`;
                break;
            case 'private_key':
                fileName = `${deviceId}_private_key.pem.key`;
                break;
            case 'public_key':
                fileName = `${deviceId}_public_key.pem.key`;
                break;
            case 'ca':
                fileName = `${deviceId}_ca.pem`;
                break;
            default:
                fileName = `${deviceId}_${file.fieldname}${path.extname(file.originalname)}`;
        }

        cb(null, fileName);
    }
});

const upload = multer({ storage });

module.exports = upload;
