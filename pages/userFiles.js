import React from "react";
import { db, auth } from "../Firebase";
import { doc, collection, getDocs, query } from "firebase/firestore";
import { BookSharp } from "@mui/icons-material";

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
                    console.log("File ",i,": \n");
                    console.log("Name: ",excelFiles[i].name);
                    console.log("Base64 String: ",excelFiles[i].excel);
                    console.log("Time Stamp: ",excelFiles[i].timestamp);
                    console.log("ID: ",excelFiles[i].id);
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