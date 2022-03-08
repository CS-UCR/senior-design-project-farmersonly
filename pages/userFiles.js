import React, { Component } from "react";
import { db, auth } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from 'firebase/auth'
import { Box } from  "@mui/material";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { ThirtyFpsRounded } from "@mui/icons-material";

class Files extends Component{
    constructor(){
        super();
        this.state = {
            test: 'Test',
            excelFiles: []
        }
    }

    //Functions for changing the state of the page (i.e. the list of documents)

    //Gets the current document list
    getDocList(){
        var path = "userFields/"+"mUHiJWAAcPMjLL5sRVSxfjMX2202"+"/excel_files";
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
                <ListItemText primary={"hello"}/>
            )
        })
    }

    everything(){
        this.getDocList();
        this.displayDocs();
        console.log("Everything");
    }

    render(){
        return(
            <div>
                <button onClick={() => this.everything()}>Everything</button>
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