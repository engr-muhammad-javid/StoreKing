// middleware/uploadWrapper.js
import multer from 'multer';
import { upload } from './storage.js';

export const handleUpload = (uploadHandler) => {
    return (req, res, next) => {
        uploadHandler(req, res, (err) => {
            if (err instanceof multer.MulterError || typeof err === 'string') {
                return res.status(400).json({ success: false, message: err });
            } else if (err) {
                return res.status(500).json({ success: false, message: 'Unexpected error during upload.' });
            }
            next();
        });
    };
};