import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherClassMaterial = ({ classId }) => {
    const [materials, setMaterials] = useState([]);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, [classId]);

    const fetchMaterials = async () => {
        const res = await axios.get(`/api/teacher/class-material/${classId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMaterials(res.data);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('file', file);
        formData.append('classId', classId);
        await axios.post('/api/teacher/class-material', formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTitle('');
        setFile(null);
        fetchMaterials();
    };

    return (
        <div>
            <h2>Class Materials</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Material Title"
                    required
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit">Upload Material</button>
            </form>
            <ul>
                {materials.map((material) => (
                    <li key={material._id}>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">{material.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeacherClassMaterial;