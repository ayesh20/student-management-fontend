import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [currentDate, setCurrentDate] = useState('');
    const [greeting, setGreeting] = useState('Good Morning');

    const navigate = useNavigate();
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

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            alert('Logging out...');
            navigate('/');
            
        }
    };

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
                </div>
                
                {/* Illustration - Using placeholder, replace with actual image */}
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
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Analysis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Card */}
                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-300 bg-opacity-50 w-20 h-20 rounded-xl"></div>
                            <div className="text-white">
                                <h3 className="text-xl font-bold mb-1">Total</h3>
                                <p className="text-3xl font-bold">54</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Payment Card */}
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-300 bg-opacity-50 w-20 h-20 rounded-xl flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">AI</span>
                            </div>
                            <div className="text-white">
                                <h3 className="text-xl font-bold mb-1">Pending Payment</h3>
                                <p className="text-3xl font-bold">23</p>
                            </div>
                        </div>
                    </div>

                    {/* Completed Payment Card */}
                    <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-300 bg-opacity-50 w-20 h-20 rounded-xl flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">AI</span>
                            </div>
                            <div className="text-white">
                                <h3 className="text-xl font-bold mb-1">completed Payment</h3>
                                <p className="text-3xl font-bold">31</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Management Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Student management</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Attendance Button */}
                    <button className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                        Attendance
                    </button>

                    {/* Payments Button */}
                    <button className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                        Payments
                    </button>

                    {/* Add Student Button */}
                    <button className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg" onClick={() => navigate('/addstudent')}>
                
                        Add student
                    </button>

                    {/* All Student Button */}
                    <button className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xl font-bold py-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg" onClick={() =>navigate('/allstudents')}>
                        All Student
                    </button>
                </div>
            </div>
        </div>
    );
}