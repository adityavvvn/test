import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentClassMaterial = ({ classId }) => {
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        fetchMaterials();
    }, [classId]);

    const fetchMaterials = async () => {
        const res = await axios.get(`/api/student/class-material/${classId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMaterials(res.data);
    };

    return (
        <div>
            <h2>Class Materials</h2>
            <ul>
                {materials.map((material) => (
                    <li key={material._id}>
                        <a href={material.fileUrl} download>{material.title}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentClassMaterial;