import React, { Component } from "react";
import { db, auth } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { Box } from  "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import { Checkbox } from "@mui/material";
import { IconButton } from "@mui/material";
import { CommentIcon } from "@mui/material";
//import { ThirtyFpsRounded } from "@mui/icons-material";

class Files extends Component{
    constructor(){
        super();
        this.state = {
            test: 'Test',
            excelFiles: [],
            array: [1,2,3,4]
        }
    }

    //Functions for changing the state of the page (i.e. the list of documents)

    //Gets the current document list
    getDocList(){
        var user = auth.currentUser;
        var path = "userFields/"+user.uid+"/excel_files";
        const ref = collection(db,path);
        console.log("In GetDocList");

        getDocs(ref)
            .then((snapshot) => {
                snapshot.docs.forEach((doc) =>{
                    this.setState({test: "GetDocList", excelFiles: [...this.state.excelFiles, doc.data()]})
                });
            })
            .catch(err => {
                console.log(err.message);
            })
    }

    //Outputs the current list of documents in the 
    displayDocs(){
        this.setState({
            test: "DisplayDocs",
        })
        this.state.excelFiles.map(file => console.log(file.name));
    }

    //This deletes the current array of excel files for a fresh reload
    deleteDocs(){
        this.setState({
            test: "DeleteDocs",
            excelFiles: []
        })
    }

    renderList(){
        this.state.excelFiles.map(file =>{
            console.log("in renderlist")
            return(
                <ListItemText primary="hello"/>
            )
        })
    }

    render(){
        return(
            <div>
                <h1>{this.state.test}</h1>
                <button onClick={() => this.getDocList()}>GetDocs</button>
                <button onClick={() => this.displayDocs()}>DisplayDocs</button>
                <button onClick={() => this.deleteDocs()}>DeleteDocs</button>
                <List>
                    <ListItem>
                        {this.renderList()}
                    </ListItem>
                </List>
            </div>
        )
    }
}

export default Files

