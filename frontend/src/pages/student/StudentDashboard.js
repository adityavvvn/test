import { useState, useEffect } from 'react';
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
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Logout from '../Logout';
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';

import TeacherClassDetails from './TeacherClassDetails';
import TeacherComplain from './TeacherComplain';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherViewStudent from './TeacherViewStudent';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';

import TeacherClassMaterial from '../components/TeacherClassMaterial';
import TeacherAssignments from '../components/TeacherAssignments';
import axios from 'axios';

const TeacherDashboard = () => {
    const [open, setOpen] = useState(true);
    const { classId } = useParams(); // ✅ Extract classId from URL
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get('/api/classes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setClasses(res.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        fetchClasses();
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
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
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
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
                    <select value={classId} onChange={(e) => window.location.href = `/Teacher/class/material/${e.target.value}`}>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                    {classId && (
                        <>
                            <TeacherClassMaterial classId={classId} />
                            <TeacherAssignments classId={classId} />
                        </>
                    )}
                    <Routes>
                        <Route path="/" element={<TeacherHomePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                        <Route path="/Teacher/dashboard" element={<TeacherHomePage />} />
                        <Route path="/Teacher/profile" element={<TeacherProfile />} />
                        <Route path="/Teacher/complain" element={<TeacherComplain />} />
                        <Route path="/Teacher/class" element={<TeacherClassDetails />} />
                        <Route path="/Teacher/class/student/:id" element={<TeacherViewStudent />} />
                        <Route path="/Teacher/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
                        <Route path="/Teacher/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
                        <Route path="/Teacher/class/material/:classId" element={<TeacherClassMaterial classId={classId} />} />
                        <Route path="/Teacher/class/assignments/:classId" element={<TeacherAssignments classId={classId} />} />
                        <Route path="/logout" element={<Logout />} />
                    </Routes>
                </Box>
            </Box>
        </>
    );
}

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
