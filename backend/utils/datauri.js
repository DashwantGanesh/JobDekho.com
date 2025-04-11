import DataUriParser from "datauri/parser.js";    //datauri is a module used to convert files or buffers into Data URIs(links), which are useful for embedding files (such as images) directly in HTML, CSS, or JSON.

import path from "path";

const getDataUri = (file)=>{
    const parser= new DataUriParser();                   //This parser helps in converting a file (buffer data) into a Data URI (Base64-encoded string).
    const extname= path.extname(file.originalname).toString();  //path.extname(file.originalname) extracts the file extension from the original filename.if "image.png", then path.extname(file.originalname) returns ".png".
    return parser.format(extname,file.buffer);  //file.buffer: The actual binary data of the file.
}

export default getDataUri;

// What This Function Does
// Takes an uploaded file as input.

// Extracts the file extension.

// Converts the file's binary buffer into a Base64 Data URI.

// Returns the Data URI.