import React from "react";
import { db, auth } from "../Firebase";
import { doc, collection, getDocs, query } from "firebase/firestore";
import XLSX from "xlsx";

export default function userFiles() {
    const userDocs = () => { 
        var user = auth.currentUser;
        var path = "userFields/"+user.uid+"/excel_files";
        const ref = collection(db,path);

        getDocs(ref)
            .then((snapshot) => {
                let excelFiles = [];
                snapshot.docs.forEach((doc) =>{
                    excelFiles.push({...doc.data(), id: doc.id })
                });
                for(var i = 0; i < excelFiles.length; i++){
                    //console.log("File ",i,": \n");
                    //console.log("Name: ",excelFiles[i].name);
                    //console.log("Base64 String: ",excelFiles[i].excel);
                    //console.log("Time Stamp: ",excelFiles[i].timestamp);
                    //console.log("ID: ",excelFiles[i].id);
                    var temp = excelFiles[i].excel;
                    var workbook = XLSX.read(
                        temp, {type: 'base64', WTF: false}
                    );
                    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[0]);
                    XLSX.writeFile(workbook, excelFiles[i].name);
                }
            })
            .catch(err => {
                console.log(err.message);
            })
    }
    return (
        <div className="Temp">
            <button onClick={userDocs}>Test Button</button>
        </div>
    )
}