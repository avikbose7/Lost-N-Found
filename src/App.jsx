import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page and Component Imports
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the protected route

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  // This effect runs once when the app starts
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Set the token in axios headers for all subsequent requests
        axios.defaults.headers.common['x-auth-token'] = token;
        try {
          // Fetch user data using the new backend route
          const res = await axios.get('http://localhost:5000/api/auth');
          setUser(res.data); // Set the user in state
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem('token'); // Invalid token, so remove it
          setUser(null);
        }
      }
      setLoading(false); // Finished checking for a user
    };

    loadUser();
  }, []);

  // Global login handler
  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['x-auth-token'] = token;
    setUser(userData);
  };

  // Global logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };
  
  // Don't render the app until we've checked for a logged-in user
  if (loading) {
    return <div>Loading...</div>; // Or a nice loading spinner component
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Pass user state and auth handlers to the Index page */}
            <Route path="/" element={<Index user={user} onLogin={handleLogin} onLogout={handleLogout} />} />

            <Route path="/aboutus" element={<AboutUs user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
            <Route path="/contactus" element={<ContactUs user={user} onLogin={handleLogin} onLogout={handleLogout} />} />

            {/* Use the ProtectedRoute for the admin page */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <Admin user={user} />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;