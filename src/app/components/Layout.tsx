import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Terminal,
  FileEdit,
  CheckSquare,
  User,
  LogOut,
  Menu as MenuIcon,
} from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Terminal', icon: <Terminal />, path: '/' },
    { text: 'Nano Editor', icon: <FileEdit />, path: '/nano' },
    { text: 'Vazifalar', icon: <CheckSquare />, path: '/tasks' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Box className="p-4 bg-slate-800 text-white">
        <Typography variant="h6">Linux CLI</Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="min-h-screen flex flex-col bg-slate-50">
      <AppBar position="static" className="bg-slate-800">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Terminal className="w-8 h-8 mr-2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Linux CLI O'rganish
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' } }} className="gap-2 mr-4">
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={Link}
                to={item.path}
                startIcon={item.icon}
                className={location.pathname === item.path ? 'bg-slate-700' : ''}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <User />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Chiqish
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" className="flex-1 p-4">
        <Outlet />
      </Box>
    </Box>
  );
}
