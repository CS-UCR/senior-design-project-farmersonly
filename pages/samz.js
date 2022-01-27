import React, { Component, useState } from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Donut from "../components/donutChart";

import styles from "../styles/samz.module.css";

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

  uploadFile = ({ target: { files } }) => {
    //console.log(files[0]);
    let data = new FormData();
    data.append("file", files[0]);
    
    axios.post("http://localhost:5000/samz/post", data, config).then((res) => {
      this.setState({
        mean: res.data.mean,
        max: res.data.max,
        min: res.data.min,
        std: res.data.std,
        clusters: res.data.clusters,
        message: res.data.message,
        delineationImage: res.data.delineationImage,
        performanceGraphImage: res.data.performanceGraphImage,
      });

      //console.log(res.data.mean);
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
            <div class="col-4">
              <div className={styles.button}>
                <label htmlFor="contained-button-file">
                  <Input
                    accept=".xlsx"
                    id="contained-button-file"
                    onChange={this.uploadFile}
                    type="file"
                  />
                  <Button
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
                    Upload Data
                  </Button>
                </label>
              </div>

              <div>
                <TextField
                  required
                  label="Length"
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  margin="dense"
                  color="primary"
                />
                <TextField
                  required
                  label="Width"
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  margin="dense"
                />
              </div>

              <div>
                <List>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"Mean: " + this.state.mean}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"Min: " + this.state.min}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"Max: " + this.state.max}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"STD: " + this.state.std}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"Clusters: " + this.state.clusters}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ style: ListText }}
                      primary={"Message: " + this.state.message}
                    />
                  </ListItem>
                  <Divider style={{ background: "#BBE1FA" }} />
                  <div className={styles.piechart}>NDVI Range and Mean</div>
                  <div>
                    <Donut pieData={this.state} />
                  </div>
                  <Divider style={{ background: "#BBE1FA" }} />
                </List>
              </div>
            </div>

            <div class="col-3">
              <img
                src={`data:image/jpeg;base64,${this.state.delineationImage}`}
                alt=""
              />
            </div>

            <div class="col-5">
              <img
                src={`data:image/jpeg;base64,${this.state.performanceGraphImage}`}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default samz;
