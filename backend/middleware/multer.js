//Multer is a middleware for handling multipart/form-data, primarily used for uploading files in Node.js with Express.

import multer from "multer";

const storage=multer.memoryStorage();

export const singleUpload=multer({storage}).single("file");    //{/*here the  name should same as name given in form submit type */}
//this singleUpload middle ware should be provided wherever there is need of file upload