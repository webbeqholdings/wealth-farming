import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to handle async request
  const router = useRouter(); // Use Next.js router for navigation

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
        // Check if user is null
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); // Set loading to false when fetch completes
      }
    };

    checkLoginStatus();
  }, []);

  return { isLoggedIn, loading }; // Return both isLoggedIn and loading states
}
