import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentAssignments = ({ classId }) => {
    const [assignments, setAssignments] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, [classId]);

    const fetchAssignments = async () => {
        const res = await axios.get(`/api/student/assignment/${classId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAssignments(res.data);
    };

    const handleSubmit = async (assignmentId) => {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`/api/student/assignment/${assignmentId}/submit`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFile(null);
        fetchAssignments();
    };

    return (
        <div>
            <h2>Assignments</h2>
            <ul>
                {assignments.map((assignment) => (
                    <li key={assignment._id}>
                        <a href={assignment.fileUrl} download>{assignment.title}</a> - Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        {!assignment.submissions.some(sub => sub.studentId === localStorage.getItem('userId')) && (
                            <div>
                                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                                <button onClick={() => handleSubmit(assignment._id)}>Submit</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentAssignments;