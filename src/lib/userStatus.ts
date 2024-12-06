import { useState, useEffect } from 'react';

export default function UserStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to handle async request
  const [user, setUser] = useState(null); // State to hold the user data

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        // Check if user data is returned
        if (data.user) {
          setUser(data.user); // Store the user data in state
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    checkLoginStatus();
  }, []);

  // Return the user data, login status, and loading state
  return { isLoggedIn, loading, user };
}
