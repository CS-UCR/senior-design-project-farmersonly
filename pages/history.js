import React, { Component } from "react";
import { db } from "../Firebase";
import { doc, deleteDoc, collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { List, Typography } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import XLSX from "xlsx";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "../styles/history.module.css";
//import { ThirtyFpsRounded } from "@mui/icons-material";

class Files extends Component{
    constructor(){
        super();
        this.state = {
            excelFiles: [],
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
                let docList = [];
                snapshot.docs.forEach((doc) =>{
                    docList.push({ ...doc.data(), id: doc.id});
                });
                this.setState({
                    excelFiles: [...this.state.excelFiles, ...docList],
                    rendered: true,
                    renderedOnce: 1
                })
            })
            .catch(err => {
                console.log(err.message);
            })
        } 
        else {
            // User is signed out
            // ...
        }
        });

    }

    //This deletes the current array of excel files for a fresh reload
    deleteDocs(id){
        var auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                var user = auth.currentUser;
                var path = "userFields/"+user.uid+"/excel_files";
                const ref = collection(db,path);
                deleteDoc(doc(db, path, id));
                this.clearExcelFiles();//Resets the excel files for the next time it renders, will grab updated list
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
            excelFiles: [],
            rendered: false,
            renderOnce: 0
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
        if(!this.state.rendered){
            this.everything();
            console.log("rendering");
        }
        if( this.state.excelFiles.length > 0 ){
            return(
                <div className={styles.container}>
                <List sx={{width: '100%', bgcolor: '#1b262c'}}>
                    { this.state.rendered ? "" : this.everything() }
                    {this.state.excelFiles.map(file => (
                        <ListItem key={file.id} className="fileList">
                            <ListItemText primary={file.name} sx={{color:'#BBE1FA'}}/>
                            <IconButton onClick={() => this.downloadData(file.excel, file.name)} style={{color: 'white'}}>
                                <DownloadIcon/>
                            </IconButton>
                            <IconButton onClick={() => this.deleteDocs(file.id)} style={{color: 'white'}}>
                                <DeleteIcon/>
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
                </div>
            )
        }
        return(
            <div className={styles.container}>
                    <Box sx={{width: '100%', maxWidth: 360, color: 'white'}}>
                        <Typography variant="body1" gutterBottom>
                            You have no files on record. Please sign in with the icon in the top right corner
                            and click on the About page to learn more on how to use the SAMZ Tool.
                        </Typography>
                    </Box>
            </div>
        )
    }
}

export default Files
