import multer from 'multer';
import path from 'path';
import randomstring from 'randomstring';
import fs from 'fs';

// File type filter
const allowedImageTypes = /jpeg|jpg|png|gif/;

const checkFileType = (file, cb) => {
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only images are allowed (jpg, jpeg, png, gif).');
    }
};

// Main export
export const dynamicUpload = (folderName = 'others', fieldName = 'image', maxCount = 1) => {
    // Ensure folder exists
    const uploadPath = `./backend/public/${folderName}`;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname).toLowerCase();
            const rand = randomstring.generate(6);
            cb(null, `${fieldName}-${rand}${ext}`);
        }
    });

    const upload = multer({
        storage: storage,
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    });

    if (maxCount === 1) {
        return upload.single(fieldName);
    } else {
        return upload.array(fieldName, maxCount);
    }
};
