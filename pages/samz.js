import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import axios from 'axios';
import XLSX from 'xlsx';

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
  uploadFile = ({ target: { files } }) =>{
  console.log( files[0] )
  let data = new FormData();
  data.append( 'file', files[0] )
  //let workbook = XLSX.read(data, {type:"file"});
  //let first_sheet_name = workbook.Sheets[0];
  console.log("before sheet");
  //console.log("Sheet Name", first_sheet_name);
  //https://webhook.site/c58f5917-253b-4fc8-8ca6-e93f95196557 for testing 
  axios.post("http://localhost:5000/samz/post", data, config).then(res=>{
    console.log(res);
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
  </div>
  );
  }
}
export default samz;