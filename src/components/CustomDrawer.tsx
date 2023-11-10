import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CreateIcon from '@mui/icons-material/Create';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import { useState } from 'react';
import { DataTableUser } from './CustomTableUser';
import SignUp from '../pages/SingUp';
import IconButton from '@mui/material/IconButton';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

enum MENU {
    REGISTER_USER,
    REGISTER_FUENTE,
    TABLE_USER,
    TABLE_FUENTE
}

export const  CustomDrawerPermanent = () => {

    const [showItem, setshowItem] = useState<MENU>(MENU.TABLE_USER);
    const navigate = useNavigate();



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, mr: `${drawerWidth}px` }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Panel Administrativo
          </Typography>
          <Button color="inherit" onClick={() => {
            localStorage.removeItem("token");
            // window.location.href = "/";
            navigate("/", { replace: true });
          }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {
            showItem === MENU.TABLE_USER && <DataTableUser/>
        }
        {
            showItem === MENU.TABLE_FUENTE && <h1>Hola table Fuente</h1>
        }
        {
            showItem === MENU.REGISTER_USER && <SignUp/>
        }
        {
            showItem === MENU.REGISTER_FUENTE && <h1>Hola table Fuente</h1>
        }
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Tabla de Usuarios', 'Tabla de Fuentes'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => {
                    if(text.endsWith('Usuarios')){
                        setshowItem(MENU.TABLE_USER)
                    }else {
                        setshowItem(MENU.TABLE_FUENTE)
                    }
              }}>
                <ListItemIcon>
                  {index % 2 === 0 ? <SupervisedUserCircleIcon /> : <SmartButtonIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider/>
        <List>
          {['Registro de Usuario', 'Registro de Fuentes'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => {
                if(text.endsWith('Usuario')){
                    setshowItem(MENU.REGISTER_USER)
                }else {
                    setshowItem(MENU.REGISTER_FUENTE)
                }
              }}>
                <ListItemIcon>
                  {index % 2 === 0 ? <CreateIcon /> : <CreateNewFolderIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

      </Drawer>
    </Box>
  );
}