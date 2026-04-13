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
  IconButton
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
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

export const DRAWER_WIDTH = 280;
export const COLLAPSED_DRAWER_WIDTH = 88;

interface SidebarProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Student Rooms', icon: <RoomIcon />, path: '/admin/student-rooms' },
  { text: 'Teacher Rooms', icon: <TeacherIcon />, path: '/admin/teacher-rooms' },
  { text: 'Subjects', icon: <BookIcon />, path: '/admin/subjects' },
  { text: 'Papers', icon: <DescriptionIcon />, path: '/admin/papers' },
  { text: 'Floors', icon: <LayersIcon />, path: '/admin/floors' },
  { text: 'Buildings', icon: <ApartmentIcon />, path: '/admin/buildings' },
];

export default function Sidebar({ mobileOpen, onDrawerToggle, isCollapsed, onToggleCollapse }: SidebarProps) {
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
        minHeight: 64
      }}>
        {!isCollapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap' }}>
            EXAM ALLOTMENT
          </Typography>
        )}
        
        {isMobile ? (
          <IconButton onClick={onDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          <IconButton onClick={onToggleCollapse} sx={{ color: 'text.secondary' }}>
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ px: isCollapsed ? 1.5 : 2, py: 3 }}>
        {MENU_ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) onDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 0 : 2,
                  height: 48,
                  bgcolor: active ? 'primary.lighter' : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: active ? 'primary.lighter' : 'rgba(0,0,0,0.04)',
                    color: active ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: active ? 'primary.main' : 'inherit', 
                  minWidth: isCollapsed ? 0 : 40,
                  mr: isCollapsed ? 0 : 0,
                  justifyContent: 'center'
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
            </ListItem>
          );
        })}
      </List>
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
            borderRight: '1px solid', 
            borderColor: 'divider',
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
