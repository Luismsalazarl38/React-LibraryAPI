import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskPage } from "./pages/TaskPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Footer from "./components/Footer";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import LogoutPage from "./pages/LogoutPage";
import { ClientProfile } from "./pages/clientProfile";
import { AdminProfile } from "./pages/AdminProfile";
import { AdminBooks } from "./pages/AdminBooks";
import { AdminStores } from "./pages/AdminStores";
import { RootProfile } from "./pages/RootProfile";
import { Contact } from "./pages/Contact";
import { AboutUs } from "./pages/AboutUs";
import { Shop } from "./pages/Shop";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return(
    <BrowserRouter>
      <Navigation/>
      <Routes> 
        <Route key="index" path="/" element={<Navigate to="/task" />} />
        <Route key="task" path="/task" element={<TaskPage />} />
        <Route key="logout" path="/logout" element={<LogoutPage />} />
        <Route key="taskcreate" path="/task-create" element={<TaskFormPage />} />
        <Route key="register" path="/register" element={<RegisterPage />} />
        <Route key="adminlogin" path="/adminlogin" element={<AdminLoginPage />} />
        <Route key="clientprofile" path="/clientprofile" element={<ClientProfile />} />
        <Route key="adminprofile" path="/adminprofile" element={<AdminProfile />} />
        <Route key="adminbooks" path="/adminbooks" element={<AdminBooks />} />
        <Route key="adminstores" path="/adminstores" element={<AdminStores />} />
        <Route key="rootprofile" path="/rootprofile" element={<RootProfile />} />
        <Route key="contact" path="/contact" element={<Contact />} />
        <Route key="aboutus" path="/aboutus" element={<AboutUs />} />
        <Route key="shop" path="/shop" element={<Shop />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App;
