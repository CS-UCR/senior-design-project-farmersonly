
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
    const spawn = require("child_process").spawn;
    const pythonScript = spawn('python', ['./process.py', path+".xlsx"]);
    pythonScript.stdout.on('data', function(data) {
        console.log("before python script")
        console.log(data.toString());
    });
    pythonScript.stderr.on('data', (data)=>
    {
        console.error('stderr: ' + data.toString())
    })
    pythonScript.on('close', (code)=>
    {
        console.error('exited with code:' + code.toString())
    })
    response.send("hello world");
}
module.exports = {
    uploadFile
};