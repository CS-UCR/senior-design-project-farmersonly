import React, { Component } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import XLSX from "xlsx";
import Divider from "@mui/material/Divider";

import styles from "../styles/history.module.css";

class Files extends Component {
  constructor() {
    super();
    this.state = {
      test: "Test",
      excelFiles: [],
      array: [1, 2, 3, 4],
      rendered: false,
      renderOnce: 0,
    };
  }

  getDocList() {
    var auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        var user = auth.currentUser;
        var path = "userFields/" + user.uid + "/excel_files";
        const ref = collection(db, path);
        console.log("In GetDocList");
        getDocs(ref)
          .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
              this.setState({
                test: "GetDocList",
                excelFiles: [...this.state.excelFiles, doc.data()],
                rendered: true,
                renederOnce: 1,
              });
            });
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else {
        // User is signed out
        // ...
      }
    });
  }

  //Outputs the current list of documents in the
  displayDocs() {
    this.setState({
      test: "DisplayDocs",
    });
    this.state.excelFiles.map((file) => console.log(file.name));
  }

  //Deletes the current array of excel files for a fresh reload
  deleteDocs() {
    this.setState({
      test: "DeleteDocs",
      excelFiles: [],
    });
  }

  renderList() {
    this.state.excelFiles.map((file) => {
      console.log("in renderlist");
      return <ListItem key={file.name} primary="hello" />;
    });
  }

  everything() {
    if (!this.state.rendered) {
      this.getDocList();
      //this.displayDocs();
      console.log("Everything");
    }
  }

  downloadData = (base64, name) => {
    //console.log("top of test");
    //console.log("the base64" + base64);
    //console.log("name: " + name);
    var workbook = XLSX.read(base64, { type: "base64", WTF: false });

    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[0]);
    var result = [];
    result.push(csv);
    result.join("\n");
    console.log("after");
    console.log(result);
    XLSX.writeFile(workbook, name);
  };
  render() {
    return (
      <div className={styles.container}>
        {this.state.rendered ? "" : this.everything()}
        <div>
          <h1 className={styles.historyTitle}>File History</h1>
        </div>
        <Grid>
          <Grid item xs={2}>
            <List>
              {this.state.excelFiles.map((file) => (
                <div key={file.timestamp}>
                  <ListItem className="fileList">
                    <div className={styles.historyList}>
                      <div className={styles.historyText}>{file.name}</div>
                      <div>
                        <Button
                          onClick={() =>
                            this.downloadData(file.excel, file.name)
                          }
                          variant="contained"
                          component="span"
                          style={{
                            fontFamily: "Quicksand",
                            fontName: "sans-serif",
                            backgroundColor: "#0F4C75",
                            color: "#BBE1FA",
                            textTransform: "none",
                          }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                </div>
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Files;
