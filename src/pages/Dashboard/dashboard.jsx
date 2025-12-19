import React, { useState, useEffect } from 'react';
import { User, LogOut, Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState('Good Morning');
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        pendingPayments: 0,
        completedPayments: 0,
        todayAttendancePercentage: 0,
        totalRevenue: 0,
        presentToday: 0,
        absentToday: 0
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        // Set current date and time
        const updateDateTime = () => {
            const now = new Date();
            const options = { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                weekday: 'long'
            };
            const formattedDate = now.toLocaleDateString('en-US', options);
            const time = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            setCurrentDate(`${formattedDate} - ${time}`);

            // Set greeting based on time
            const hour = now.getHours();
            if (hour < 12) setGreeting('Good Morning');
            else if (hour < 18) setGreeting('Good Afternoon');
            else setGreeting('Good Evening');
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                toast.error('Please login first');
                navigate('/');
                return;
            }

            // Fetch all required data in parallel
            const [studentsRes, paymentsRes, attendanceRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/students/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/students/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/attendance/date/${new Date().toISOString().split('T')[0]}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}/payments/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // Process students data
            const students = studentsRes.data.students || [];
            const totalStudents = students.length;
            const pendingPayments = students.filter(s => s.paymentstatus === 'pending').length;
            const completedPayments = students.filter(s => s.paymentstatus === 'completed').length;

            // Process attendance data
            const attendanceData = attendanceRes.data.attendance || [];
            const presentToday = attendanceData.filter(a => a.status === 'present').length;
            const absentToday = attendanceData.filter(a => a.status === 'absent').length;
            const todayAttendancePercentage = totalStudents > 0 
                ? ((presentToday / totalStudents) * 100).toFixed(1)
                : 0;

            // Process payment stats
            const totalRevenue = statsRes.data.statistics?.totalAmount || 0;

            setDashboardData({
                totalStudents,
                pendingPayments,
                completedPayments,
                todayAttendancePercentage,
                totalRevenue,
                presentToday,
                absentToday
            });

        } catch (error) {
            console.error('Fetch dashboard data error:', error);
            if (error.response?.status === 403) {
                toast.error('Session expired. Please login again');
                setTimeout(() => navigate('/'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminData');
            toast.success('Logged out successfully');
            navigate('/');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Welcome To Your Dashboard
                </h1>
                
                <div className="flex items-center gap-4">
                    <span className="text-sm md:text-base text-slate-600">
                        {currentDate}
                    </span>
                    <button className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <User className="w-6 h-6 text-slate-700" />
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-md flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-8 h-60 md:p-12 mb-8 relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                        {greeting}
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Here's what's happening with your students today
                    </p>
                </div>
                
                <div className="absolute right-8 bottom-0 w-64 h-64 opacity-90">
                    <img 
                        src="/images/design.png" 
                        alt="Dashboard illustration"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>

            {/* Analysis Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Analytics Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Students */}
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <Users className="w-12 h-12 text-white opacity-80" />
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-white">
                            <h3 className="text-lg font-semibold mb-1 opacity-90">Total Students</h3>
                            <p className="text-4xl font-bold">{dashboardData.totalStudents}</p>
                            <p className="text-sm mt-2 opacity-80">Enrolled students</p>
                        </div>
                    </div>

                    {/* Pending Payments */}
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <DollarSign className="w-12 h-12 text-white opacity-80" />
                        </div>
                        <div className="text-white">
                            <h3 className="text-lg font-semibold mb-1 opacity-90">Pending Payments</h3>
                            <p className="text-4xl font-bold">{dashboardData.pendingPayments}</p>
                            <p className="text-sm mt-2 opacity-80">Students with pending fees</p>
                        </div>
                    </div>

                    {/* Completed Payments */}
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <svg className="w-12 h-12 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="text-white">
                            <h3 className="text-lg font-semibold mb-1 opacity-90">Completed Payments</h3>
                            <p className="text-4xl font-bold">{dashboardData.completedPayments}</p>
                            <p className="text-sm mt-2 opacity-80">Fees fully paid</p>
                        </div>
                    </div>

                    {/* Today's Attendance */}
                    <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <Calendar className="w-12 h-12 text-white opacity-80" />
                        </div>
                        <div className="text-white">
                            <h3 className="text-lg font-semibold mb-1 opacity-90">Today's Attendance</h3>
                            <p className="text-4xl font-bold">{dashboardData.presentToday} present, {dashboardData.absentToday} absent</p>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                                <p className="text-4xl font-bold">
                                    Rs. {dashboardData.totalRevenue.toLocaleString()}
                                </p>
                                <p className="text-sm mt-2 opacity-80">All-time collections</p>
                            </div>
                            <DollarSign className="w-16 h-16 text-white opacity-30" />
                        </div>
                    </div>

                    {/* Attendance Report Link */}
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                         >
                        <div className="flex items-center justify-between">
                            <div className="text-white">
                                <h3 className="text-xl font-semibold mb-2">Attendance Report</h3>
                                <p className="text-base opacity-90 mb-3">View detailed analytics and charts</p>
                                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-6 py-2 rounded-lg font-semibold transition-all" onClick={() => navigate('/attendance-report')}>
                                    View Details →
                                </button>
                            </div>
                            <svg className="w-16 h-16 text-white opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Management Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Student Management</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <button 
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                        onClick={() => navigate('/student-attendance')}
                    >
                        <Calendar className="w-8 h-8 mx-auto mb-2" />
                        Attendance
                    </button>

                    <button 
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                        onClick={() => navigate('/payment-management')}
                    >
                        <DollarSign className="w-8 h-8 mx-auto mb-2" />
                        Payments
                    </button>

                    <button 
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                        onClick={() => navigate('/addstudent')}
                    >
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                    </button>

                    <button 
                        className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
                        onClick={() => navigate('/allstudents')}
                    >
                        <Users className="w-8 h-8 mx-auto mb-2" />
                        All Students
                    </button>
                </div>
            </div>
        </div>
    );
}