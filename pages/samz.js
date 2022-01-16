import React, { Component, useState } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import axios from "axios";
import Donut from "../components/donutChart";

import styles from "../styles/samz.module.css";
//import { getOverlayDirection } from "react-bootstrap";
const Input = styled("input")({
  display: "none",
});
const config = {
  headers: {
    "content-type": "multipart/form-data",
  },
};
export class samz extends Component {
  //uploadFile = ({ target: { files } }) =>{
    constructor(props) {
      super(props);
      this.state = {
        mean: 0,
        max: 0,
        min: 0,
        std: 0,
        clusters: 0,
        message: "Waiting on file upload",
        delineationImage:"0",
        performanceGraphImage:"0"
      };
    }
    uploadFile = ({ target: { files } }) =>{
    console.log( files[0] )
    let data = new FormData();
    data.append("file", files[0]);
    //let workbook = XLSX.read(data, {type:"file"});
    //let first_sheet_name = workbook.Sheets[0];
    //console.log("Sheet Name", first_sheet_name);
    //https://webhook.site/c58f5917-253b-4fc8-8ca6-e93f95196557 for testing

    //const [mean, setMean] = useState(0);
    axios.post("http://localhost:5000/samz/post", data, config).then((res) => {
      //setMean(res.data.mean)
      this.setState({
        mean: res.data.mean,
        max: res.data.max,
        min: res.data.min,
        std: res.data.std,
        clusters: res.data.clusters,
        message: res.data.message,
        delineationImage: res.data.delineationImage,
        performanceGraphImage: res.data.performanceGraphImage
      })
      console.log(res.data.mean)
      //console.log(res.data.mean);
      //this.setState({maxVal: res.data.max});
      //this.setState({minVal: res.data.min});
      //this.setState({std: res.data.std});
      //this.setState({clusters: res.data.clusters});
    });
  };
  render() {
    return (
      <div className={styles.container}>
        <div class="container">
          <div class="row">
            <div class="col">
              <div className={styles.button}>
                <label htmlFor="contained-button-file">
                  <Input
                    accept=".xlsx"
                    id="contained-button-file"
                    onChange={this.uploadFile}
                    type="file"
                  />
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-4" className="Statistics">
              <List>
                <Divider />
                <ListItem>
                  <ListItemText primary={"Mean: " + this.state.mean} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={"Min: " + this.state.min} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={"Max: " + this.state.max} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={"STD: " + this.state.std} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={"Clusters: " + this.state.clusters} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary={"Message: " + this.state.message} />
                </ListItem>
                <Divider />
                <p className={styles.piechart}>NDVI Range and Mean</p>
                <div className={styles.donut}>
                  <Donut pieData={this.state} />
                </div>
                <Divider />
              </List>

              {/* <p className={styles.piechart}>NDVI Range and Mean</p>
            
            </div> */}
            </div>

            <div class="col-3">
              <img src={`data:image/jpeg;base64,${this.state.delineationImage}`} alt="" />
            </div>

            <div class="col-5">
            <img src={`data:image/jpeg;base64,${this.state.performanceGraphImage}`} alt="" />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
export default samz;
