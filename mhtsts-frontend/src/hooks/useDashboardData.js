import { useState, useEffect } from 'react';
import { clientApi } from '../api/clientApi';
import { appointmentApi } from '../api/appointmentApi';
import { userApi } from '../api/userApi';

export const useDashboardData = () => {
  const [data, setData] = useState({
    clients: [],
    appointments: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We use Promise.allSettled to gracefully handle any endpoints that might fail or not be implemented yet
        const [clientsRes, apptsRes, usersRes] = await Promise.allSettled([
          clientApi.getAllClients(),
          appointmentApi.getAllAppointments(),
          userApi.getAllUsers(),
        ]);

        setData({
          clients: clientsRes.status === 'fulfilled' && clientsRes.value ? clientsRes.value : [],
          appointments: apptsRes.status === 'fulfilled' && apptsRes.value ? apptsRes.value : [],
          users: usersRes.status === 'fulfilled' && usersRes.value ? usersRes.value : [],
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ...data, loading, error };
};
