import  multer, {diskStorage} from 'multer';
import path from 'path';
import randomstring from 'randomstring';


const fileType = (file, cb) => {
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif'];
    const allowedMime = ['image/jpeg', 'image/png', 'image/gif'];

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedExt.includes(ext) && allowedMime.includes(mime)) {
        cb(null, true);
    } else {
        cb('Error: File must be an image', false);
    }
};

export const upload = multer({
    storage:diskStorage({
        
        destination: './backend/public/profile',
        filename: (req, file, cb) =>{
             
            let p1 = randomstring.generate(4);
            let p2 = randomstring.generate(2);
            let ext = path.extname(file.originalname).toLowerCase();
           
            cb(null, file.fieldname+"-"+p1+p2+p2+ext);
        },
    }),

    limits:{fileSize:1000000*2},
    fileFilter:(req, file, cb)=>{
        fileType(file,cb);
    }

}).single('profile');

