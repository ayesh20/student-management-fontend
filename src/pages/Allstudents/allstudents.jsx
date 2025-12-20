import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function AllStudents() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL+"/api";

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = students.filter(student =>
                student.StudentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.StudentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.phoneNo?.includes(searchTerm) ||
                student.address?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents(students);
        }
    }, [searchTerm, students]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                toast.error('Please login first');
                navigate('/');
                return;
            }

            const response = await axios.get(`${API_URL}/students/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setStudents(response.data.students);
                setFilteredStudents(response.data.students);
               
            }
        } catch (error) {
            console.error('Fetch students error:', error);
            
            if (error.response) {
                if (error.response.status === 403) {
                    toast.error('Session expired. Please login again');
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    toast.error(error.response.data.message || 'Failed to load students');
                }
            } else {
                toast.error('Unable to connect to server');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, studentName) => {
        if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            
            const response = await axios.delete(
                `${API_URL}/students/delete/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Student deleted successfully!');
                // Remove student from state
                setStudents(students.filter(student => student._id !== id));
            }
        } catch (error) {
            console.error('Delete student error:', error);
            
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to delete student');
            } else {
                toast.error('Unable to connect to server');
            }
        }
    };

    const handleEdit = (student) => {
        navigate('/edit-student', { state: { student } });
    };

    

    const handleBack = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        All Students
                    </h1>
                </div>
                
                
            </div>

            {/* Search Bar */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, phone, or address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-rose-300 border-b-4 border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Student ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Address
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Phone No
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Total attendance
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase tracking-wider border-r-2 border-slate-800">
                                    Payment status
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr 
                                        key={student._id}
                                        className="bg-rose-100 border-b-2 border-slate-800 hover:bg-rose-200 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-slate-800 font-medium border-r-2 border-slate-800">
                                            {student.StudentID}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.StudentName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.address}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.phoneNo}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 text-center border-r-2 border-slate-800">
                                            {student.attendence || 0}
                                        </td>
                                        <td className="px-6 py-4 border-r-2 border-slate-800">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                student.paymentstatus === 'completed' 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                                {student.paymentstatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                                                    title="Edit Student"
                                                >
                                                    <Edit2 className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id, student.StudentName)}
                                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 className="w-5 h-5 text-slate-600 group-hover:text-red-600" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                        {searchTerm ? 'No students found matching your search.' : 'No students added yet. Click "Add New Student" to get started.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <p className="text-slate-700 font-medium">
                    Total Students: <span className="text-blue-600 font-bold">{filteredStudents.length}</span>
                    {searchTerm && filteredStudents.length !== students.length && (
                        <span className="text-slate-500 ml-2">
                            (filtered from {students.length})
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}