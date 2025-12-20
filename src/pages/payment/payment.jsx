import React, { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, CreditCard, Plus, Search, Trash2, Download, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function PaymentManagement() {
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [statistics, setStatistics] = useState(null);
    
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        paymentMethod: 'cash',
        paymentType: 'monthly_fee',
        month: new Date().toISOString().slice(0, 7), // YYYY-MM format
        remarks: ''
    });

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL+"/api";

    useEffect(() => {
        fetchStudents();
        fetchPayments();
        fetchStatistics();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = payments.filter(payment =>
                payment.StudentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.StudentID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPayments(filtered);
        } else {
            setFilteredPayments(payments);
        }
    }, [searchTerm, payments]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_URL}/students/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setStudents(response.data.students);
            }
        } catch (error) {
            console.error('Fetch students error:', error);
        }
    };

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_URL}/payments/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setPayments(response.data.payments);
                setFilteredPayments(response.data.payments);
            }
        } catch (error) {
            console.error('Fetch payments error:', error);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${API_URL}/payments/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.success) {
                setStatistics(response.data.statistics);
            }
        } catch (error) {
            console.error('Fetch statistics error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.studentId || !formData.amount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/payments/add`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Payment added successfully!');
                setShowAddModal(false);
                fetchPayments();
                fetchStatistics();
                
                // Reset form
                setFormData({
                    studentId: '',
                    amount: '',
                    paymentMethod: 'cash',
                    paymentType: 'monthly_fee',
                    month: new Date().toISOString().slice(0, 7),
                    remarks: ''
                });
            }
        } catch (error) {
            console.error('Add payment error:', error);
            
            if (error.response) {
                toast.error(error.response.data.message || 'Failed to add payment');
            } else {
                toast.error('Unable to connect to server');
            }
        }
    };

    const handleDelete = async (paymentId) => {
        if (!window.confirm('Are you sure you want to delete this payment record?')) {
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(
                `${API_URL}/payments/delete/${paymentId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Payment deleted successfully!');
                fetchPayments();
                fetchStatistics();
            }
        } catch (error) {
            console.error('Delete payment error:', error);
            toast.error('Failed to delete payment');
        }
    };

    const handleBack = () => {
        navigate('/dashboard');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading payments...</p>
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
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                            Payment Management
                        </h1>
                        <p className="text-slate-600 text-sm mt-1">
                            Track and manage student payments
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Payment
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-8 h-8 opacity-80" />
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <p className="text-green-100 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold mt-1">
                            Rs. {statistics.totalAmount.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <CreditCard className="w-8 h-8 opacity-80" />
                        </div>
                        <p className="text-blue-100 text-sm">Total Payments</p>
                        <p className="text-3xl font-bold mt-1">{statistics.totalPayments}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-purple-100 text-sm">Students Paid</p>
                        <p className="text-3xl font-bold mt-1">{statistics.uniqueStudents}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <svg className="w-8 h-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-orange-100 text-sm">Average Payment</p>
                        <p className="text-3xl font-bold mt-1">
                            Rs. {parseFloat(statistics.averagePayment).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by student name, ID, or receipt..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400"
                    />
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-green-100 border-b-2 border-slate-800">
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Receipt #</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Student ID</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Student Name</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-800 uppercase">Date</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-800 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment, index) => (
                                    <tr 
                                        key={payment._id}
                                        className={`${index % 2 === 0 ? 'bg-green-50' : 'bg-white'} border-b border-slate-200 hover:bg-green-100 transition-colors`}
                                    >
                                        <td className="px-6 py-4 text-slate-800 font-mono text-sm">
                                            {payment.receiptNumber}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-medium">
                                            {payment.StudentID}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800">
                                            {payment.StudentName}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-semibold text-green-600">
                                            Rs. {payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                                                {payment.paymentMethod.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold capitalize">
                                                {payment.paymentType.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-sm">
                                            {formatDate(payment.paymentDate)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(payment._id)}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                                                title="Delete Payment"
                                            >
                                                <Trash2 className="w-5 h-5 text-slate-600 group-hover:text-red-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                                        {searchTerm ? 'No payments found matching your search.' : 'No payments recorded yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payment Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-800">Add New Payment</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Student Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Select Student <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                    required
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map(student => (
                                        <option key={student._id} value={student._id}>
                                            {student.StudentID} - {student.StudentName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Amount (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                    placeholder="Enter amount"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Payment Method <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.paymentMethod}
                                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="online">Online Payment</option>
                                </select>
                            </div>

                            {/* Payment Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Payment Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.paymentType}
                                    onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                >
                                    <option value="monthly_fee">Monthly Fee</option>
                                    <option value="registration">Registration Fee</option>
                                    <option value="exam_fee">Exam Fee</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Month (only for monthly fee) */}
                            {formData.paymentType === 'monthly_fee' && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Month <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="month"
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                    />
                                </div>
                            )}

                            {/* Remarks */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Remarks
                                </label>
                                <textarea
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-slate-800"
                                    rows="3"
                                    placeholder="Add any additional notes..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex gap-3">
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all"
                            >
                                Add Payment
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}