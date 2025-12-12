import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, X, ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddStudent() {
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: ''
       
    });
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            toast.error(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.studentId.trim()) {
            newErrors.studentId = 'Student ID is required';
        }

        if (!formData.studentName.trim()) {
            newErrors.studentName = 'Student name is required';
        } else if (formData.studentName.trim().length < 2) {
            newErrors.studentName = 'Name must be at least 2 characters';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        toast.error(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        setTimeout(() => {
            console.log('Form submitted:', formData);
            toast.success('Student added successfully!');
            navigate('/dashboard');
            setLoading(false);
          
        }, 1000);
    };

    

    const handleBack = () => {
        if (window.confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
            alert('Navigating back to dashboard...');
            navigate('/dashboard');
        }
    };

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
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Add New Student
                    </h1>
                </div>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Student ID */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Student ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.studentId ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter student ID (e.g., STU001)"
                                disabled={loading}
                            />
                        </div>
                        {errors.studentId && (
                            <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                        )}
                    </div>

                    {/* Student Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Student Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.studentName ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter full name"
                                disabled={loading}
                            />
                        </div>
                        {errors.studentName && (
                            <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.email ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="student@example.com"
                                disabled={loading}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.phone ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400`}
                                placeholder="Enter 10-digit phone number"
                                disabled={loading}
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full pl-11 pr-4 py-3 border-2 ${errors.address ? 'border-red-300' : 'border-slate-300'} rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 placeholder-slate-400 resize-none`}
                                placeholder="Enter complete address"
                                disabled={loading}
                            />
                        </div>
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                    </div>

                    {/* Date of Birth and Gender Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800"
                                disabled={loading}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-slate-800 bg-white"
                                disabled={loading}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                
                            </select>
                        </div>
                    </div>

                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
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
                                    Save Student
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Reset Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}