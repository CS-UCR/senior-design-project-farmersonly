import React, { Component, useState } from "react";
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import axios from 'axios';
import XLSX from 'xlsx';
import Donut from '../components/donutChart'
//import PerformanceChart from '../components/performance'

import styles from '../styles/samz.module.css'
const Input = styled('input')({
  display: 'none',
});
const config = {
  headers: {
      'content-type': 'multipart/form-data'
  }
}
export class samz extends Component{
  //uploadFile = ({ target: { files } }) =>{
    constructor(props) {
      super(props);
      this.state = {
        mean: 0,
        max: 0,
        min: 0,
        std: 0,
        clusters: 0,
        message: "waiting on data"
      };
    }
    uploadFile = ({ target: { files } }) =>{
    console.log( files[0] )
    let data = new FormData();
    data.append( 'file', files[0] )
    //let workbook = XLSX.read(data, {type:"file"});
    //let first_sheet_name = workbook.Sheets[0];
    //console.log("Sheet Name", first_sheet_name);
    //https://webhook.site/c58f5917-253b-4fc8-8ca6-e93f95196557 for testing 

    //const [mean, setMean] = useState(0);
    axios.post("http://localhost:5000/samz/post", data, config).then(res=> {
      //setMean(res.data.mean)
      this.setState({ 
        mean: res.data.mean, 
        max: res.data.max,
        min: res.data.min,
        std: res.data.std,
        clusters: res.data.clusters,
        message: res.data.message
      })
      console.log(res.data.mean)
      //console.log(res.data.mean);
      //this.setState({maxVal: res.data.max});
      //this.setState({minVal: res.data.min});
      //this.setState({std: res.data.std});
      //this.setState({clusters: res.data.clusters});
    })
  
    }
  render()
  {
  return(
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
    <label htmlFor="contained-button-file">
    <Input accept=".xlsx" id="contained-button-file" onChange={this.uploadFile} type="file" />
    <Button variant="contained" component="span">
      Upload
    </Button>
  </label>
  <List>
      <ListItem>
        <ListItemText primary={'mean: ' + this.state.mean} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={'min: ' + this.state.min} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={'max: ' + this.state.max} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={'std: ' + this.state.std} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={'clusters: ' + this.state.clusters} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={'message: ' + this.state.message} />
      </ListItem>
      <Divider />
  </List>

  <Donut pieData = {this.state}/>
  </div>
  );
  }
}
export default samz;