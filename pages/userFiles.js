import React, { Component } from "react";
import { db} from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
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
import Divider from "@mui/material/Divider";
//import { ThirtyFpsRounded } from "@mui/icons-material";

class Files extends Component{
    constructor(){
        super();
        this.state = {
            excelFiles: [],
<<<<<<< HEAD
=======
            array: [1,2,3,4],
>>>>>>> 17f813057436573713613c98e082aeaed3f41a5a
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
<<<<<<< HEAD
=======
            console.log("In GetDocList");
>>>>>>> 17f813057436573713613c98e082aeaed3f41a5a
            getDocs(ref)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) =>{
                    this.setState({
<<<<<<< HEAD
                        excelFiles: [...this.state.excelFiles, doc.data()],
                        rendered: true,
                        renderOnce: 1
=======
                        test: "GetDocList", 
                        excelFiles: [...this.state.excelFiles, doc.data()],
                        rendered: true,
                        renederOnce: 1
>>>>>>> 17f813057436573713613c98e082aeaed3f41a5a
                })
                });
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

    //Outputs the current list of documents in the 
    displayDocs(){
        this.setState({
            test: "DisplayDocs",
        })
        //this.state.excelFiles.map(file => console.log(file.name));
    }

    //This deletes the current array of excel files for a fresh reload
    deleteDocs(){
        this.setState({
            test: "DeleteDocs",
            excelFiles: []
        })
    }

<<<<<<< HEAD
    everything(){
        if(!this.state.rendered)
        {
            this.getDocList();
        }
    }

    downloadData = (base64, name) => {
=======
    renderList(){
        this.state.excelFiles.map(file =>{
            console.log("in renderlist")
            return(
                <ListItem key={file.name} primary="hello"/>
            )
        })
    }

    everything(){
        if(!this.state.rendered)
        {
            this.getDocList();
            //this.displayDocs();
            console.log("Everything");
        }
    }

    downloadData = (base64, name) => {
        //console.log("top of test");
        //console.log("the base64" + base64);
        //console.log("name: " + name);
>>>>>>> 17f813057436573713613c98e082aeaed3f41a5a
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
<<<<<<< HEAD

    render(){
        return(
            <div>
                { this.state.rendered ? "" : this.everything() }
=======
    render(){
        return(
            <div>
                {/* <button onClick={() => this.everything()}>GetDocs</button> */}
                { this.state.rendered ? "" : this.everything()}
                <List>
                    {this.state.excelFiles.map(file => (
                    <ListItem key={file.timestamp} className="fileList" >
                        <div >
                            <div style={{ display: 'flex', minHeight:50, minWidth: 200, width: "fit-content", height: "fit-content",  justifyContent: "center",  alignItems:'center'}}>
                                {file.name}
                                <Button onClick={() => this.downloadData(file.excel, file.name)}variant="contained"
                                component="span"
                                style={{
                                    fontFamily: "Quicksand",
                                    fontName: "sans-serif",
                                    backgroundColor: "#0F4C75",
                                    color: "#BBE1FA",
                                    textTransform: "none",
                                }}
                                >Download File</Button> 
                            </div> 
                            <Divider/>  
                        </div>
                    </ListItem>
                ))
                }
                </List>
>>>>>>> 17f813057436573713613c98e082aeaed3f41a5a
            </div>
        )
    }
}

export default Files

