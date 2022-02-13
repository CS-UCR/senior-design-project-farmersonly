import React, { Component, useState } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import Donut from "../components/donutChart";
import XLSX from "xlsx";
import styles from "../styles/samz.module.css";
import { Outbound } from "@mui/icons-material";
//import { getOverlayDirection } from "react-bootstrap";

//Firebase imports
import { doc, setDoc, collection, getDoc, addDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase";

const Input = styled("input")({
  display: "none",
});

const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};

const ListText = {
  fontFamily: "Quicksand",
  fontName: "sans-serif",
  color: "#BBE1FA",
};

export class samz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchInProgress: true,
      resultsReceived: false,
      mean: 0,
      max: 0,
      min: 0,
      std: 0,
      clusters: 0,
      message: "Waiting on file upload",
      delineationImage: "0",
      performanceGraphImage: "0",
    };
  }
  process_wb = ()=>{
    console.log("top of test");
    var workbook = XLSX.read("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", 
    {type:'base64', WTF:false});
  
      var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[0]);
      var result = [];
      result.push(csv);
      result.join("\n");
      console.log("after");
      console.log(result);
      XLSX.writeFile(workbook, "test.xlsx")
  
  };
  handleSubmit = (event) =>{
    console.log(event);
    console.log(event.target.file.files[0]);
    let data = new FormData();
    this.state.resultsReceived = false;
    this.state.fetchInProgress = true,
    console.log("results received = " + this.state.resultsReceived);
    var excelFile = event.target.file.files[0];
    function getBase64(file, onLoadCallback) {
      return new Promise(function(resolve, reject) {
          var reader = new FileReader();
          reader.onload = function() { resolve(reader.result); };
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
  }
  var promise = getBase64(excelFile);
  async function saveResults() {
    var promise = getBase64(excelFile);
    var excelFileBase64 = await promise;
    excelFileBase64 = excelFileBase64.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
    
    //Code for uploading to Firestore
    var user = auth.currentUser;

    var path = "userFields/"+user.uid+"/excel_files";
    const ref = doc(collection(db,path));

    setDoc(doc(db, 'userFields', user.uid),{
      displayName: user.displayName
    });

    setDoc(ref, {
      excel: excelFileBase64,
      timestamp: "temp",
      name: "temp"
    });

}
saveResults();

    getBase64(excelFile);
    data.append("file", event.target.file.files[0]);
    data.append("length", event.target.length.value);
    data.append("width", event.target.width.value);
    console.log("in upload")
    console.log(data)
    axios.post("http://localhost:5000/samz/post", data, config).then((res) => {
      this.setState({
        fetchInProgress: false,
        resultsReceived: true,
        mean: res.data.mean,
        max: res.data.max,
        min: res.data.min,
        std: res.data.std,
        clusters: res.data.clusters,
        message: res.data.message,
        delineationImage: res.data.delineationImage,
        performanceGraphImage: res.data.performanceGraphImage,
      });
    });
    event.target.reset();
    event.preventDefault();
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="container">
          <div className="row">
            <div className="col-4">

              <div>
                <form autoComplete="off" name="lengthAndWidth" onSubmit={this.handleSubmit}>
                  <TextField  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} required name="length" label="Length" variant="filled" size="small" sx={{bgcolor: '#e0e0e0'  }} margin="dense"/>
                  <TextField  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} required name="width" label="Width" variant="filled" size="small" sx={{bgcolor: '#e0e0e0' }} margin="dense"/>
                  <label htmlFor="contained-button-file">
                    <Input type="file" required name="file" accept=".xlsx" id="contained-button-file"/>
                    <Button variant="contained" component="span">
                      Choose File
                    </Button>
                  </label>
                  <label htmlFor="contained-button">
                    <Input type="submit" required id="contained-button"/>
                    <Button variant="contained" component="span">
                      Submit
                    </Button>
                  </label>
              </form>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <List>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                  {this.state.resultsReceived && 
                    <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Mean: " + this.state.mean}/>
                  }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Min: " + this.state.min}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Max: " + this.state.max}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"STD: " + this.state.std}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Optimal Zones: " + this.state.clusters}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Input variation: " + this.state.message}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <ListItem>
                {this.state.resultsReceived &&
                  <ListItemText primaryTypographyProps={{ style: ListText }} primary={"Message: " + this.state.message}/>
                }
                </ListItem>
                <Divider style={{ background: "#BBE1FA" }} />
                <div className={styles.piechart}>NDVI Range and Mean</div>
                <div>
                  <Donut pieData={this.state} />
                </div>
                <Divider style={{ background: "#BBE1FA" }} />
              </List>
            </div>

            <div className="col-3">
            {this.state.fetchInProgress ? <CircularProgress/> : <img src={`data:image/jpeg;base64,${this.state.delineationImage}`}/>}
            </div>
            <div className="col-5" >
              {this.state.fetchInProgress ? <CircularProgress/> : <img src={`data:image/jpeg;base64,${this.state.performanceGraphImage}`} className={styles.performanceImg}
              />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default samz;