// src/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase'; // Import auth instance
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // No user is logged in, redirect to login page
        navigate('/adminlogin');
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    // Optionally show a loading state while checking auth status
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <p>This is your private dashboard content.</p>
    </div>
  );
};

export default AdminDashboard;