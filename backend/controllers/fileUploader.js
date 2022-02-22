const multer = require('multer');
const upload = multer();
const fs = require('fs');

var path;
var filename;
function uploadFile(request, response)
{
    console.log("the width is: "+request.body.width);
    console.log(request.body.length);
    console.log(request.file.filename);
    path = request.file.path;
    fs.renameSync(path, path+".xlsx")
    const spawn = require("child_process").spawn;
    const pythonScript = spawn('python3', ['./process.py', path+".xlsx", request.body.length, request.body.width]);
    var results = "";
    pythonScript.stdout.on('data', function(data) {
        results += data;
        return;
    });
    pythonScript.stderr.on('data', (data)=>
    {
        console.error('stderr: ' + data.toString())
        return;
    })
    pythonScript.on('close', (code)=>
    {
        console.error('exited with code:' + code.toString())
        fs.unlink(path+".xlsx", (err) => { //code to delete file from tmp
            if (err) {
                console.error(err)
                return
            }})
        reponse.send(results);
        return;
    })
}
module.exports = {
    uploadFile
};