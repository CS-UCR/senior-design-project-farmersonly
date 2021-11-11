
const multer = require('multer');
const upload = multer();
const fs = require('fs');

var path;
var filename;
function uploadFile(request, response)
{
    console.log(request.file.filename);
    path = request.file.path;
    fs.renameSync(path, path+".xlsx")
    /*fs.unlink(path, (err) => { //code to delete file from tmp
        if (err) {
          console.error(err)
          return
        }})*/
    response.send("hello world");
}
module.exports = {
    uploadFile
};