import {
  AppBar,
  Button,
  Drawer,
  hexToRgb,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHamburger, FaSun, FaMoon, FaHammer } from 'react-icons/fa';
// window.ipcRenderer  = window.electron.ipcRenderer
import { useLocation } from 'react-router-dom';

// eslint-disable-next-line import/prefer-default-export
export function Navbar({ toggleTheme, isDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [buildDrawerOpen, setBuildDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();


  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };
  const toggleBuildDrawer = (open: boolean) => {
    setBuildDrawerOpen(open);
  };
  const openDevTools = () => {
    console.log("example command: lilypad('cd ~/; ls')")
    window.electron.ipcRenderer.sendMessage('open-dev-tools');
  };
  const menuItems = (
    <div style={{zIndex:"10000 !important"}}>
      <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton>
          <Typography>Run</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/module-list"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Modules</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/code"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Code</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/notebook"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Notebook</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/flow"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Flow</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/gen"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Media</Typography>
        </IconButton>
      </NavLink>

      {/* <NavLink
        to="/files"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Files</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/compute"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Compute</Typography>
        </IconButton>
      </NavLink> */}
       <NavLink
        to="/gradio"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Gradio</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/data"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Data</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/agent"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Agent</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/ipfs"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Files</Typography>
        </IconButton>
      </NavLink>
      <NavLink
        to="/transactions"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Transactions</Typography>
        </IconButton>
      </NavLink>
      {/* <NavLink
        to="/ipfs"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Logs</Typography>
        </IconButton>
      </NavLink> */}
      <IconButton onClick={openDevTools}>
        <Typography>Terminal</Typography>
      </IconButton>
      <NavLink
        to="/account"
        style={{ zIndex: 10000, textDecoration: 'none', color: 'inherit' }}
      >
        <IconButton>
          <Typography>Account</Typography>
        </IconButton>
      </NavLink>
      {/* {isDarkMode ? (
        <Button onClick={toggleTheme}>
          <FaSun style={{ color: 'yellow' }} />
        </Button>
      ) : (
        <Button onClick={toggleTheme} style={{ color: 'blue' }}>
          <FaMoon />
        </Button>
      )} */}
    </div>
  );
  const validPaths = [
    '/code',
    '/gradio',
    '/notebook',
    '/flow',
    '/gen',
    '/ipfs',
    '/agent',
  ];
  return (
    // position="aboslute"
    <AppBar style={{position:'fixed',bottom:0, top: "calc(100% - 65px)", height:65}}>
    {/* // <div  style={{position:'fixed',zIndex:1000000, top:0, width:"100%", height:100}}> */}
      <Toolbar>
        {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
          LP: 32
        </Typography> */}
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => toggleDrawer(true)}>
              <FaHamburger />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClick={() => toggleDrawer(false)}
            >
              <List>
                <ListItem>{menuItems}</ListItem>
              </List>
            </Drawer>
          </>
        ) : (
          menuItems
        )}
        { location.hash.length>0 && validPaths.some(path => location.pathname.startsWith(path)) ? (
          <IconButton
            style={{ position: 'fixed', right: 5, bottom: 15 }}
            color="inherit"
            onClick={() => toggleBuildDrawer(true)}
            // disabled={location.pathname === '/code'}
          >
            <FaHammer fill='white'  />
          </IconButton>
        ) : null}

        <Drawer

          anchor="right"
          open={buildDrawerOpen}
          onClick={() => toggleBuildDrawer(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                {/* Other content can go here */}
            </div>
            <List>
            <ListItem>
              <Button
                onClick={() => {
                  alert("BUILD "+location.hash.substring(1));
                  // window.electron.ipcRenderer.sendMessage('run-shell-command', 'lilypad build');
                }}
              >Build Lilypad Module</Button>
            </ListItem>
            <ListItem>
              <Button>Publish Docker Image to IFS</Button>
            </ListItem>
            <ListItem>
              <Button>Publish Module to Github</Button>
            </ListItem>
            {/* <ListItem>
              <Button>Run Module on Lilypad</Button>
            </ListItem> */}
          </List>
        </div>

        </Drawer>
      </Toolbar>
      {/* // </div> */}
    </AppBar>
  );
}
