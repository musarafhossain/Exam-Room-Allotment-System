"use client";

import React from 'react';
import {
    Typography,
    Box,
    Grid,
    Stack,
    Paper,
    Divider,
    Button,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import {
    People as PeopleIcon,
    Room as RoomIcon,
    HistoryEdu as ExamIcon,
    AdminPanelSettings as AdminIcon,
    TrendingUp as TrendingUpIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import StatCard from "../../components/admin/StatCard";
import { useAuth } from "../../hooks";

export default function DashboardPage() {
    const { user } = useAuth();
    const theme = useTheme();

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary">
                        Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, <Typography component="span" variant="inherit" fontWeight={700}>{user?.name || "Administrator"}</Typography>. Here's what's happening today.
                    </Typography>
                </Box>
                <Button variant="outlined" endIcon={<ArrowForwardIcon fontSize="small" />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                    View Reports
                </Button>
            </Stack>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Students"
                        value="1,248"
                        icon={<PeopleIcon />}
                        color="primary"
                        trend="+12%"
                        progress={75}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Rooms"
                        value="42"
                        icon={<RoomIcon />}
                        color="success"
                        trend="+5%"
                        progress={90}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Exams"
                        value="156"
                        icon={<ExamIcon />}
                        color="warning"
                        trend="+8%"
                        progress={60}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Total Users"
                        value="8"
                        icon={<AdminIcon />}
                        color="info"
                        trend="Stable"
                        progress={100}
                    />
                </Grid>
            </Grid>

            {/* Recent Activity or Placeholder for more info */}
            <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={700}>Today's Exam Schedule</Typography>
                            <Button size="small" sx={{ textTransform: 'none' }}>View All</Button>
                        </Stack>
                        <Box sx={{ py: 10, textAlign: 'center' }}>
                            <Typography color="text.secondary">Graph or chart could go here for better visuals.</Typography>
                            <ExamIcon sx={{ fontSize: 60, color: 'divider', mt: 2 }} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>System Alerts</Typography>
                        <Stack spacing={2}>
                            {[
                                { title: "Room A101 capacity reached", time: "10 mins ago", severity: "warning" },
                                { title: "New exam scheduled for March 25th", time: "1 hour ago", severity: "info" },
                                { title: "Student list updated", time: "3 hours ago", severity: "success" },
                            ].map((alert, i) => (
                                <Box key={i} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 4, bgcolor: `${alert.severity}.main`, borderRadius: 1 }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>{alert.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{alert.time}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
