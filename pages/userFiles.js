import React, { Component } from "react";
import { db} from "../Firebase";
import { collection, connectFirestoreEmulator, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Box } from  "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { Checkbox } from "@mui/material";
import { IconButton } from "@mui/material";
import { CommentIcon } from "@mui/material";
import Button from "@mui/material/Button";
import XLSX from "xlsx";
import DownloadIcon from '@mui/icons-material/Download';
import Divider from "@mui/material/Divider";
import Container from '@mui/material/Container';
import DeleteIcon from '@mui/icons-material/Delete';
//import { ThirtyFpsRounded } from "@mui/icons-material";

class Files extends Component{
    constructor(){
        super();
        this.state = {
            excelFiles: [],
            excelIDs: [],
            rendered: false,
            renderOnce: 0
        }
    }

    //Functions for changing the state of the page (i.e. the list of documents)

    //Gets the current document list
    
    getDocList(){
        var auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            var user = auth.currentUser;
            var path = "userFields/"+user.uid+"/excel_files";
            const ref = collection(db,path);
            getDocs(ref)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) =>{
                    this.setState({
                        excelFiles: [...this.state.excelFiles, doc.data()],
                        excelIDs: [...this.state.excelIDs, doc.id],
                        rendered: true,
                        renderOnce: 1
                })
                });
            })
            .catch(err => {
                console.log(err.message);
            })
            this.excelIDs.map(id => console.log(id));
        } 
        else {
            // User is signed out
            // ...
        }
        });

    }

    //Outputs the current list of documents in the 
    displayDocs(){
        this.setState({
            test: "DisplayDocs",
        })
        this.state.excelFiles.map(file => console.log(file.name));
    }

    //This deletes the current array of excel files for a fresh reload
    deleteDocs(file){
        var auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                var user = auth.currentUser;
                var path = "userFields/"+user.uid+"/excel_files";
                const ref = collection(db,path);
                const q = query(ref, where("timestamp", "==", `${timestamp}`));
                const querySnapshot = getDocs(q);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc);
                });
                //this.clearExcelFiles();
            }
        });
    }

    everything(){
        if(!this.state.rendered)
        {
            this.getDocList();
        }
    }

    clearExcelFiles(){
        this.setState({
            excelFiles: []
        })
    }

    downloadData = (base64, name) => {
        var workbook = XLSX.read(
          base64,
          { type: "base64", WTF: false }
        );
    
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[0]);
        var result = [];
        result.push(csv);
        result.join("\n");
        console.log("after");
        console.log(result);
        XLSX.writeFile(workbook, name);
      };

    
    render(){
        return(
                <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    { this.state.rendered ? "" : this.everything() }
                    { this.state.excelFiles.map(file => (
                        <ListItem key={file.timestamp} className="fileList">
                            <ListItemText primary={file.name}/>
                            <IconButton onClick={() => this.downloadData(file.excel, file.name)}>
                                <DownloadIcon/>
                            </IconButton>
                            <IconButton onClick={() => this.deleteDocs(file)}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
        )
    }
}

export default Files