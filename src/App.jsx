import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";



// Pages
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import AddStudent from "./pages/addstudent/addstudent.jsx";
import Allstudents from "./pages/Allstudents/allstudents.jsx";
import EditStudent from "./pages/editstudent/editstudent.jsx";
import StudentAttendance from "./pages/attendence/studentAttendence.jsx";
import PaymentManagement from "./pages/payment/payment.jsx";


function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/addstudent" element={<AddStudent/>}/>
            <Route path="/allstudents" element={<Allstudents/>}/>
            <Route path="/edit-student" element={<EditStudent/>}/>
            <Route path="/student-attendance" element={<StudentAttendance/>}/>
            <Route path="/payment-management" element={<PaymentManagement/>}/>
          
           
          </Routes>
        </BrowserRouter>
     
    </>
  );
}

export default App;
