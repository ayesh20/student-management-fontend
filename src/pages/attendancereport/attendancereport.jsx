import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp, Download, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function AttendanceReport() {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        studentStats: [],
        totalRecords: 0
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [overallStats, setOverallStats] = useState({
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        averageAttendance: 0
    });

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL+"/api";

    useEffect(() => {
        fetchAttendanceReport();
    }, [dateRange]);

    const fetchAttendanceReport = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                toast.error('Please login first');
                navigate('/');
                return;
            }

            const response = await axios.get(
                `${API_URL}/attendance/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                const data = response.data;
                setReportData({
                    studentStats: data.studentStats || [],
                    totalRecords: data.totalRecords || 0
                });

                // Calculate overall statistics
                const totalPresent = data.studentStats.reduce((sum, s) => sum + s.present, 0);
                const totalAbsent = data.studentStats.reduce((sum, s) => sum + s.absent, 0);
                const totalLate = data.studentStats.reduce((sum, s) => sum + s.late, 0);
                const totalDays = totalPresent + totalAbsent + totalLate;
                const averageAttendance = totalDays > 0 ? ((totalPresent / totalDays) * 100).toFixed(1) : 0;

                setOverallStats({
                    totalPresent,
                    totalAbsent,
                    totalLate,
                    averageAttendance
                });
            }
        } catch (error) {
            console.error('Fetch attendance report error:', error);
            toast.error('Failed to load attendance report');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const getAttendanceColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 75) return 'text-blue-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getAttendanceBarColor = (percentage) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 75) return 'bg-blue-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading attendance report...</p>
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
                            Attendance Report
                        </h1>
                        <p className="text-slate-600 text-sm mt-1">
                            Detailed analytics and insights
                        </p>
                    </div>
                </div>

            
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Select Date Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                        />
                    </div>
                </div>
            </div>

            {/* Overall Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <CheckCircle className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-green-100 text-sm">Total Present</p>
                    <p className="text-4xl font-bold mt-1">{overallStats.totalPresent}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
                    <XCircle className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-red-100 text-sm">Total Absent</p>
                    <p className="text-4xl font-bold mt-1">{overallStats.totalAbsent}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
                    <Clock className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-yellow-100 text-sm">Total Late</p>
                    <p className="text-4xl font-bold mt-1">{overallStats.totalLate}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <TrendingUp className="w-10 h-10 mb-3 opacity-80" />
                    <p className="text-blue-100 text-sm">Average Attendance</p>
                    <p className="text-4xl font-bold mt-1">{overallStats.averageAttendance}%</p>
                </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 ">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Attendance Distribution</h3>
                <div className="flex flex-col justify-items-center gap-8 md:flex-row items-center  ">
                    {/* Simple Pie Chart */}
                    <div className="flex-shrink-0">
                        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                            {/* Calculate percentages */}
                            {(() => {
                                const total = overallStats.totalPresent + overallStats.totalAbsent + overallStats.totalLate;
                                if (total === 0) return null;
                                
                                const presentPercent = (overallStats.totalPresent / total) * 100;
                                const absentPercent = (overallStats.totalAbsent / total) * 100;
                                const latePercent = (overallStats.totalLate / total) * 100;
                                
                                const circumference = 2 * Math.PI * 80;
                                const presentLength = (presentPercent / 100) * circumference;
                                const absentLength = (absentPercent / 100) * circumference;
                                const lateLength = (latePercent / 100) * circumference;
                                
                                return (
                                    <>
                                        {/* Present (Green) */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="40"
                                            strokeDasharray={`${presentLength} ${circumference}`}
                                            strokeDashoffset="0"
                                        />
                                        {/* Absent (Red) */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="40"
                                            strokeDasharray={`${absentLength} ${circumference}`}
                                            strokeDashoffset={-presentLength}
                                        />
                                        {/* Late (Yellow) */}
                                        <circle
                                            cx="100"
                                            cy="100"
                                            r="80"
                                            fill="none"
                                            stroke="#eab308"
                                            strokeWidth="40"
                                            strokeDasharray={`${lateLength} ${circumference}`}
                                            strokeDashoffset={-(presentLength + absentLength)}
                                        />
                                    </>
                                );
                            })()}
                        </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-4 w-full max-w-md">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <span className="font-semibold text-slate-800">Present</span>
                            </div>
                            <span className="text-2xl font-bold text-green-600">
                                {overallStats.totalPresent}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                <span className="font-semibold text-slate-800">Absent</span>
                            </div>
                            <span className="text-2xl font-bold text-red-600">
                                {overallStats.totalAbsent}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                <span className="font-semibold text-slate-800">Late</span>
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">
                                {overallStats.totalLate}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student-wise Attendance Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800">Student-wise Attendance</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-100 border-b-2 border-slate-300">
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Student ID</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Student Name</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">Present</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">Absent</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">Late</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">Total Days</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Attendance %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.studentStats.length > 0 ? (
                                reportData.studentStats.map((student, index) => (
                                    <tr 
                                        key={index}
                                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200 hover:bg-blue-50 transition-colors`}
                                    >
                                        <td className="px-6 py-4 text-slate-800 font-medium">
                                            {student.StudentID}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800">
                                            {student.StudentName}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                <CheckCircle className="w-4 h-4" />
                                                {student.present}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                                <XCircle className="w-4 h-4" />
                                                {student.absent}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                                <Clock className="w-4 h-4" />
                                                {student.late}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-slate-800 font-semibold">
                                            {student.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-lg font-bold ${getAttendanceColor(student.attendancePercentage)}`}>
                                                        {student.attendancePercentage}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${getAttendanceBarColor(student.attendancePercentage)}`}
                                                        style={{ width: `${student.attendancePercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p className="text-lg">No attendance data found for the selected date range</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Footer */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <p className="text-slate-700 font-medium text-center">
                    Showing data from <span className="font-bold text-blue-600">
                        {new Date(dateRange.startDate).toLocaleDateString()}
                    </span> to <span className="font-bold text-blue-600">
                        {new Date(dateRange.endDate).toLocaleDateString()}
                    </span>
                    {' • '}
                    <span className="font-bold text-slate-800">{reportData.studentStats.length}</span> students
                    {' • '}
                    <span className="font-bold text-slate-800">{reportData.totalRecords}</span> total records
                </p>
            </div>
        </div>
    );
}