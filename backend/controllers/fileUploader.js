
//import { getStorage, ref, uploadString } from "firebase/storage"
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
    const spawn = require("child_process").spawn;
    const pythonScript = spawn('python', ['./process.py', path+".xlsx"]);

    /* File upload to Firebase */

    //const storage = getStorage();
    //const storageRef = ref(storage, currentUser.id)

    const contents = fs.readFileSync(path+'.xlsx', {encoding: 'base64'}); //Encode .xlsx file into base64
    
    //console.log(contents);
    pythonScript.stdout.on('data', function(data) {
        console.log(data.toString());
        fs.unlink("./tmp/Optimal_clustered_image_" + JSON.parse(data).randomID + ".png", (err) => { //code to delete file from tmp
            if (err) {
              console.error(err)
              return
            }})
        fs.unlink("./tmp/Performance_Graph_image_" + JSON.parse(data).randomID + ".png", (err) => { //code to delete file from tmp
            if (err) {
                console.error(err)
                return
            }})
        fs.unlink(path+".xlsx", (err) => { //code to delete file from tmp
            if (err) {
                console.error(err)
                return
            }})
        response.send(data);
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
        return;
    })
    //response.send(data);
}
module.exports = {
    uploadFile
};