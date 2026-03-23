import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analysis from "./pages/Analysis";
import Suggestions from "./pages/Suggestions";
import DiseaseInfo from "./pages/DiseaseInfo";
import History from "./pages/History";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 important

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false); // wait until firebase responds
    });

    return () => unsubscribe();
  }, []);

  // 🔥 wait until firebase loads
  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <>
      <ToastContainer theme="dark" position="top-right" />

      <Routes>
        
        {/* Redirect to analysis if already logged in, otherwise show Home */}
        <Route path="/" element={!user ? <Home /> : <Navigate to="/analysis" />} />

        {/* 🔐 Auth routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/analysis" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/analysis" />}
        />

        {/* 🔐 Protected routes */}
        <Route
          path="/analysis"
          element={user ? <Analysis /> : <Navigate to="/" />}
        />

        <Route
          path="/suggestions"
          element={user ? <Suggestions /> : <Navigate to="/" />}
        />

        <Route
          path="/diseaseinfo"
          element={user ? <DiseaseInfo /> : <Navigate to="/" />}
        />

        <Route
          path="/history"
          element={user ? <History /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}