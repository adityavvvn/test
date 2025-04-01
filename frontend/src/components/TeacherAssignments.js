import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherAssignments = ({ classId }) => {
    const [assignments, setAssignments] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, [classId]);

    const fetchAssignments = async () => {
        const res = await axios.get(`/api/teacher/assignment/${classId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAssignments(res.data);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('classId', classId);
        formData.append('dueDate', dueDate);
        await axios.post('/api/teacher/assignment', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTitle('');
        setFile(null);
        setDueDate('');
        fetchAssignments();
    };

    return (
        <div>
            <h2>Assignments</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Assignment Title"
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type="submit">Upload Assignment</button>
            </form>
            <ul>
                {assignments.map((assignment) => (
                    <li key={assignment._id}>
                        <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">{assignment.title}</a> - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        <ul>
                            {assignment.submissions.map((sub) => (
                                <li key={sub._id}>
                                    Submitted by Student {sub.studentId}: <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherAssignments;