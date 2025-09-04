import multer from 'multer';
// import path from 'path';
// import fs from 'fs';


// set up multer storage engine configuration
// const storageConfig = () => {
//     return multer.diskStorage({
//         destination: (req, file, cb) => {

//             const userId = req.user?.id || 'anonymous';
//             const uploadPath = `../client/src/assets/uploads/users/${userId}`;

//             fs.mkdirSync(uploadPath, { recursive: true });
//             cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//             // cd: the callback function, this used to specify the final filename that will be used to save on the server
//             // const uniqueSuffix = Date.now() + "-" + Math.floor(Math.random() * 1E9)
//             let uniqueSuffix = '';
//             const extension = path.extname(file.originalname);

//             if (file.fieldname === "profileImg") {
//                 uniqueSuffix = file.fieldname + '-' + req.user?.id;
//             };

//             if (['img1', 'img2', 'img3', 'img4'].includes(file.fieldname)) {
//                 uniqueSuffix = file.fieldname + "-" + Math.floor(Math.random() * 1E9);
//             };

//             cb(null, uniqueSuffix + extension);
//         },
//     });
// }

const storage = multer.memoryStorage();

export default multer({ storage });