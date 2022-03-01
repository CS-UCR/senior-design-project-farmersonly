import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { FileDownload } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';

export default function BasicList() {
    var arr = [];
    arr.push(0);
    arr.push(1);
    console.log(arr);
  return (
    <div>
        <List>
            {arr.map}
        </List>
    </div>
  );
}

<ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon/>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItemButton>
          </ListItem>