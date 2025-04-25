import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch total users count
    useEffect(() => {
        const fetchTotalUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/users', {
                    withCredentials: true
                });

                if (response.data && response.data.users) {
                    setTotalUsers(response.data.users.length);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalUsers();
    }, []);

    // Mock data for dashboard statistics
    const stats = [
        { title: 'Total Users', value: loading ? '...' : totalUsers.toLocaleString(), icon: <FiUsers className="text-blue-500" /> },
        { title: 'Active Bookings', value: '56', icon: <FiCalendar className="text-green-500" /> },
    ];

    // Mock data for recent bookings
    const recentBookings = [
        { id: 1, user: 'John Doe', venue: 'Grand Hall', date: '2023-06-15', status: 'Confirmed' },
        { id: 2, user: 'Jane Smith', venue: 'Beach Resort', date: '2023-06-16', status: 'Pending' },
        { id: 3, user: 'Bob Johnson', venue: 'Mountain Lodge', date: '2023-06-17', status: 'Confirmed' },
        { id: 4, user: 'Alice Brown', venue: 'City Center', date: '2023-06-18', status: 'Cancelled' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                            </div>
                            <div className="text-3xl">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.venue}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 