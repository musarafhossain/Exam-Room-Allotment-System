"use client";

import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Room as RoomIcon,
  SupervisorAccount as TeacherIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Book as BookIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
  Apartment as ApartmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from 'hooks';

export const DRAWER_WIDTH = 280;
export const COLLAPSED_DRAWER_WIDTH = 88;

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Student Rooms', icon: <RoomIcon />, path: '/student-rooms' },
  { text: 'Teacher Rooms', icon: <TeacherIcon />, path: '/teacher-rooms' },
  { text: 'Subjects', icon: <BookIcon />, path: '/subjects' },
  { text: 'Papers', icon: <DescriptionIcon />, path: '/papers' },
  { text: 'Floors', icon: <LayersIcon />, path: '/floors' },
  { text: 'Buildings', icon: <ApartmentIcon />, path: '/buildings' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Sidebar({ mobileOpen, onDrawerToggle, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Box sx={{ 
        p: isCollapsed ? 2 : 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isCollapsed ? 'center' : 'space-between',
        minHeight: 92,
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component="img"
            src="/assets/images/logo.png"
            onClick={isCollapsed ? onToggleCollapse : undefined}
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: isCollapsed ? 'pointer' : 'default',
              '&:hover': {
                transform: isCollapsed ? 'scale(1.1)' : 'none'
              },
              ...(isCollapsed && { width: 40, height: 40 })
            }}
          />
          {!isCollapsed && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1.1, letterSpacing: -0.5 }}>
                EXAM
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: 1, display: 'block', textTransform: 'uppercase' }}>
                Allotment
              </Typography>
            </Box>
          )}
        </Stack>

        {!isCollapsed && (
          <IconButton 
            onClick={onToggleCollapse} 
            sx={{ 
              color: 'text.secondary',
              bgcolor: 'rgba(0,0,0,0.03)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ px: 0, py: 3 }}>
        {MENU_ITEMS.map((item) => {
          const active = item.path === '/' 
            ? pathname === '/' 
            : pathname === item.path || pathname.startsWith(item.path + '/');
            
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.text : ""} placement="right" arrow>
                <ListItemButton
                  onClick={() => {
                    router.push(item.path);
                    if (isMobile) onDrawerToggle();
                  }}
                  sx={{
                    borderRadius: 0,
                    borderTopRightRadius: 24,
                    borderBottomRightRadius: 24,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: 0,
                    mr: 2,
                    height: 48,
                    position: 'relative',
                    bgcolor: active ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
                    color: active ? 'primary.main' : 'text.secondary',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: active ? 'rgba(26, 115, 232, 0.12)' : 'rgba(0,0,0,0.04)',
                      color: active ? 'primary.main' : 'text.primary',
                    },
                    ...(active && {
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        width: 4,
                        height: '100%',
                        bgcolor: 'primary.main',
                      }
                    })
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: active ? 'primary.main' : 'inherit', 
                    minWidth: isCollapsed ? '100%' : 64,
                    display: 'flex',
                    justifyContent: 'center',
                    mr: 0
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        variant: 'body2', 
                        fontWeight: active ? 600 : 500,
                        sx: { whiteSpace: 'nowrap' }
                      }} 
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', pb: 2 }}>
        <Divider sx={{ mb: 2, mx: 2 }} />
        <ListItem disablePadding>
          <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" arrow>
            <ListItemButton
              onClick={() => {
                logout();
                router.push('/login');
              }}
              sx={{
                borderRadius: 0,
                borderTopRightRadius: 24,
                borderBottomRightRadius: 24,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: 0,
                mr: 2,
                height: 48,
                color: 'error.main',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.08)',
                  color: 'error.dark',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: isCollapsed ? '100%' : 64,
                display: 'flex',
                justifyContent: 'center',
              }}>
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    variant: 'body2', 
                    fontWeight: 600 
                  }} 
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </Box>
    </Box>
  );

  const currentWidth = isCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: currentWidth }, 
        flexShrink: { md: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none', boxShadow: 10 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: currentWidth, 
            borderRight: 'none', 
            boxShadow: '4px 0 12px rgba(0,0,0,0.05)', // Right side shadow
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
