import React, { useState, useEffect } from 'react';
import { useParams, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import TeacherSideBar from './TeacherSideBar';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';

import TeacherClassMaterial from '../components/TeacherClassMaterial';
import TeacherAssignments from '../components/TeacherAssignments';

const TeacherDashboard = () => {
    const { classId: routeClassId } = useParams();
    const [open, setOpen] = useState(true);
    const [classes, setClasses] = useState([]);
    const [classId, setClassId] = useState(routeClassId || ''); // Initialize with route param if available

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('/api/teacher/classes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setClasses(res.data);
                if (!routeClassId && res.data.length > 0) {
                    setClassId(res.data[0]._id); // Default to first class if no route param
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, [routeClassId]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar open={open} position='absolute'>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Teacher Dashboard
                    </Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>

            <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                <Toolbar sx={styles.toolBarStyled}>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    <TeacherSideBar />
                </List>
            </Drawer>

            <Box component="main" sx={styles.boxStyled}>
                <Toolbar />

                {/* Class Selection Dropdown */}
                <div>
                    <label>Select Class: </label>
                    <select value={classId} onChange={(e) => setClassId(e.target.value)}>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                </div>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<TeacherHomePage />} />
                    <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                    <Route path="/Teacher/profile" element={<TeacherProfile />} />
                    <Route path="/Teacher/complain" element={<TeacherComplain />} />
                    <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                    <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                    <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                    <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />

                    {/* Dynamic class materials and assignments */}
                    <Route path="/Teacher/class/material" element={<TeacherClassMaterial classId={classId} />} />
                    <Route path="/Teacher/class/assignments" element={<TeacherAssignments classId={classId} />} />

                    <Route path="/logout" element={<Logout />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default TeacherDashboard;

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
};
