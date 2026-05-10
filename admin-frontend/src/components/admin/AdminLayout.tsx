"use client";

import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Button,
  Menu,
  MenuItem,
  Container,
  Paper,
  Divider,
  ListItemIcon
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH } from './Sidebar';
import Footer from '../common/Footer';
import { useAuth } from '../../hooks';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const currentDrawerWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    logout();
    router.push("/login");
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Subtle bottom shadow
          zIndex: (theme) => theme.zIndex.drawer - 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            {/* Title can be dynamic based on route if needed */}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              onClick={handleProfileMenuOpen}
              sx={{
                ml: 1,
                py: 0.5,
                px: 1,
                borderRadius: 2,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ 
                  width: 36, 
                  height: 36, 
                  bgcolor: 'rgba(26, 115, 232, 0.1)', 
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  opacity: 0.9
                }}>
                  <AccountCircleIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                    {user?.name || "User"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 500 }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Stack>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { mt: 1.5, minWidth: 180, borderRadius: 2, boxShadow: '0px 5px 15px rgba(0,0,0,0.1)' }
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">My Profile</Typography>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon sx={{ color: 'error.main' }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Logout</Typography>
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          pb: { xs: 10, md: 10 }, // Extra padding for fixed footer
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          mt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ p: 0, minHeight: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
        </Container>

        {/* Fixed Footer with Glassmorphism */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            width: { md: `calc(100% - ${currentDrawerWidth}px)`, xs: '100%' },
            zIndex: theme.zIndex.appBar - 1,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
