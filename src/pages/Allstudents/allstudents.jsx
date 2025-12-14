import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AllStudents() {
    const [students, setStudents] = useState([
        {
            id: 1,
            studentId: '23586',
            studentName: 'y.s. kasun',
            address: 'colombo',
            phone: '0325678944',
            totalAttendance: 15,
            paymentStatus: 'pending',
            email: 'kasun@example.com',
            dateOfBirth: '2000-05-15',
            gender: 'male',
            guardianName: 'Mr. Y.S. Silva',
            guardianPhone: '0771234567'
        },
        {
            id: 2,
            studentId: '23587',
            studentName: 'A.B. Fernando',
            address: 'Kandy',
            phone: '0712345678',
            totalAttendance: 22,
            paymentStatus: 'completed',
            email: 'fernando@example.com',
            dateOfBirth: '1999-08-20',
            gender: 'male',
            guardianName: 'Mrs. Fernando',
            guardianPhone: '0778765432'
        },
        {
            id: 3,
            studentId: '23588',
            studentName: 'K.L. Perera',
            address: 'Galle',
            phone: '0765432109',
            totalAttendance: 18,
            paymentStatus: 'pending',
            email: 'perera@example.com',
            dateOfBirth: '2001-03-10',
            gender: 'female',
            guardianName: 'Mr. Perera',
            guardianPhone: '0723456789'
        }
    ]);

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState(students);

    useEffect(() => {
        const filtered = students.filter(student =>
            student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.includes(searchTerm) ||
            student.phone.includes(searchTerm) ||
            student.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const handleDelete = (id, studentName) => {
        if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
            setStudents(students.filter(student => student.id !== id));
            alert(`${studentName} has been deleted successfully!`);
        }
    };

    
       const handleEdit = (student) => {
    navigate('/edit-student', { state: { student } });
}; 

    

    const handleBack = () => {
        
        navigate('/dashboard');
    };

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
                        placeholder="Search by ID"
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
                                filteredStudents.map((student, index) => (
                                    <tr 
                                        key={student.id}
                                        className="bg-rose-100 border-b-2 border-slate-800 hover:bg-rose-200 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-slate-800 font-medium border-r-2 border-slate-800">
                                            {student.studentId}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.studentName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.address}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 border-r-2 border-slate-800">
                                            {student.phone}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 text-center border-r-2 border-slate-800">
                                            {student.totalAttendance}
                                        </td>
                                        <td className="px-6 py-4 border-r-2 border-slate-800">
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                student.paymentStatus === 'completed' 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                                {student.paymentStatus}
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
                                                    onClick={() => handleDelete(student.id, student.studentName)}
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
                                        No students found matching your search.
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
                    {searchTerm && (
                        <span className="text-slate-500 ml-2">
                            (filtered from {students.length})
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
}