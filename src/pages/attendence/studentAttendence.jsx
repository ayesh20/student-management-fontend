import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function StudentAttendance() {
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [existingAttendance, setExistingAttendance] = useState([]);
    
    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchExistingAttendance();
        }
    }, [selectedDate]);

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
                
                // Initialize attendance data
                const initialData = {};
                response.data.students.forEach(student => {
                    initialData[student._id] = {
                        status: 'present',
                        remarks: ''
                    };
                });
                setAttendanceData(initialData);
            }
        } catch (error) {
            console.error('Fetch students error:', error);
            
            if (error.response?.status === 403) {
                toast.error('Session expired. Please login again');
                setTimeout(() => navigate('/'), 2000);
            } else {
                toast.error('Failed to load students');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingAttendance = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            const response = await axios.get(`${API_URL}/attendance/date/${selectedDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setExistingAttendance(response.data.attendance);
                
                // Update attendance data with existing records
                const updatedData = { ...attendanceData };
                response.data.attendance.forEach(record => {
                    updatedData[record.studentId] = {
                        status: record.status,
                        remarks: record.remarks || ''
                    };
                });
                setAttendanceData(updatedData);
            }
        } catch (error) {
            // If no attendance found, that's okay - we'll start fresh
            console.log('No existing attendance for this date');
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status: status
            }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks: remarks
            }
        }));
    };

    const handleMarkAll = (status) => {
        const updatedData = {};
        students.forEach(student => {
            updatedData[student._id] = {
                status: status,
                remarks: attendanceData[student._id]?.remarks || ''
            };
        });
        setAttendanceData(updatedData);
        toast.success(`Marked all students as ${status}`);
    };

    const handleSubmit = async () => {
        setSaving(true);

        try {
            const token = localStorage.getItem('authToken');
            
            // Prepare bulk attendance records
            const attendanceRecords = students.map(student => ({
                studentId: student._id,
                status: attendanceData[student._id].status,
                remarks: attendanceData[student._id].remarks
            }));

            const response = await axios.post(
                `${API_URL}/attendance/mark-bulk`,
                {
                    attendanceRecords: attendanceRecords,
                    date: selectedDate
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || 'Attendance saved successfully!');
                
                // Show detailed results
                const results = response.data.results;
                if (results.failed.length > 0) {
                    toast.error(`${results.failed.length} records failed to save`);
                }
            }
        } catch (error) {
            console.error('Save attendance error:', error);
            
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to save attendance');
            } else {
                toast.error('Unable to connect to server');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'absent':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'late':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getStatusStats = () => {
        const stats = { present: 0, absent: 0, late: 0 };
        Object.values(attendanceData).forEach(data => {
            stats[data.status]++;
        });
        return stats;
    };

    const stats = getStatusStats();

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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Mark Attendance
                        </h1>
                        <p className="text-slate-600 text-sm mt-1">
                            Total Students: {students.length}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Attendance
                        </>
                    )}
                </button>
            </div>

            {/* Date Selection & Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Select Date
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Quick Mark Actions */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Quick Actions
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleMarkAll('present')}
                                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                All Present
                            </button>
                            <button
                                onClick={() => handleMarkAll('absent')}
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                All Absent
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-2xl font-bold text-green-600">{stats.present}</span>
                        </div>
                        <p className="text-sm text-slate-600">Present</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
                        </div>
                        <p className="text-sm text-slate-600">Absent</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-2xl font-bold text-yellow-600">{stats.late}</span>
                        </div>
                        <p className="text-sm text-slate-600">Late</p>
                    </div>
                </div>
            </div>

            {/* Attendance List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-blue-100 border-b-2 border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">
                                    Student ID
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">
                                    Remarks
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr 
                                    key={student._id}
                                    className={`${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} border-b border-slate-200 hover:bg-blue-50 transition-colors`}
                                >
                                    <td className="px-6 py-4 text-slate-800 font-medium">
                                        {student.StudentID}
                                    </td>
                                    <td className="px-6 py-4 text-slate-800">
                                        {student.StudentName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleStatusChange(student._id, 'present')}
                                                className={`p-2 rounded-lg transition-all ${
                                                    attendanceData[student._id]?.status === 'present'
                                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-green-50'
                                                }`}
                                                title="Present"
                                            >
                                                <CheckCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student._id, 'absent')}
                                                className={`p-2 rounded-lg transition-all ${
                                                    attendanceData[student._id]?.status === 'absent'
                                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-red-50'
                                                }`}
                                                title="Absent"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student._id, 'late')}
                                                className={`p-2 rounded-lg transition-all ${
                                                    attendanceData[student._id]?.status === 'late'
                                                        ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500'
                                                        : 'bg-slate-100 text-slate-400 hover:bg-yellow-50'
                                                }`}
                                                title="Late"
                                            >
                                                <Clock className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={attendanceData[student._id]?.remarks || ''}
                                            onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                                            placeholder="Add remarks (optional)"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-800"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {students.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No students found</p>
                    <p className="text-slate-400 text-sm mt-2">Add students first to mark attendance</p>
                </div>
            )}
        </div>
    );
}