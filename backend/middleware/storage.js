import  multer, {diskStorage} from 'multer';
import path from 'path';
import randomstring from 'randomstring';


const fileType = (file,cb) =>{
    console.log('filename 1')
    let allow = /jpe|png|jpg|gif/

    let isMatch = allow.test(path.extname(file.originalname).toLowerCase());


    let mime = allow.test(file.mimetype);

    if( mime){
        cb(null, true)
    }else{
        cb('Error: File must be an image', false);
    }
}

export const upload = multer({
    storage:diskStorage({
        destination: './public/profile',
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

