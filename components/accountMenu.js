/* import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { auth } from "../Firebase"
import { onAuthStateChanged } from 'firebase/auth'
import {Navbar, Nav} from 'react-bootstrap'

export default function NestedList() {
  const [open, setOpen] = React.useState(true);

  var name = "Guest"
  var state = "googleSignInButton"

  const handleClick = () => {
    setOpen(!open);
  };

  onAuthStateChanged(auth, user => {
    if (user) {
      // User is signed in.
      console.log("signed in");
      console.log(user.displayName);
      name = user.displayName
      state = "googleSignInButton"
    } 
    else {
      // No user is signed in.
      console.log("signed out");
      state = "signout"
    }
  });

  return (
    <List
      sx={{ width: '100%', maxWidth: 300, bgcolor: 'black'}}
      component="nav"
    >
      <ListItemButton onClick={handleClick}>
        <ListItemText primary = {name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 2 }}>
            <Nav.Link href={state}>Sign In</Nav.Link>
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
} */

/* import { auth } from "../Firebase"
import { onAuthStateChanged } from 'firebase/auth'
import {Navbar, Nav} from 'react-bootstrap'

class acMenu{
    constructor() {
        this.state = {
            user: null,
            loading: true,
        };
    }

    didMount() {
        onAuthStateChanged(auth, user => {
            if (user) {
                this.setState
            } 
            else {
            }
          });
    }
} */