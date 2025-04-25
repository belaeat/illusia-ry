import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    role: 'admin' | 'user' | 'super-admin';
    firebaseUid?: string;
}

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch users from MongoDB
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users', {
                withCredentials: true
            });

            if (response.data && response.data.users) {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users. Please try again later.');
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Update user role
    const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/update-role',
                { userId, role: newRole },
                { withCredentials: true }
            );

            if (response.data && response.data.success) {
                // Update the local state
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId ? { ...user, role: newRole } : user
                    )
                );

                toast.success(`User role updated to ${newRole}`);
                setActiveDropdown(null);
            }
        } catch (err) {
            console.error('Error updating user role:', err);
            toast.error('Failed to update user role');
        }
    };

    // Delete user
    const deleteUser = async (user: User) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('Starting delete user process...');
            console.log('User to delete:', user);
            console.log('Current users state:', users);

            // Make the DELETE request to the backend
            const response = await axios.delete(
                `http://localhost:5000/api/users/${encodeURIComponent(user.email)}`,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Delete response status:', response.status);
            console.log('Delete response data:', response.data);

            // Check if the deletion was successful
            if (response.data && response.data.success) {
                console.log('Delete successful, updating local state...');
                // Remove the user from the local state
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.filter(u => u.email !== user.email);
                    console.log('Updated users state:', updatedUsers);
                    return updatedUsers;
                });

                // Show success message
                toast.success('User deleted successfully');

                // Close the dropdown
                setActiveDropdown(null);
            } else {
                // Show error message if the server didn't return success
                console.error('Delete response did not indicate success:', response.data);
                toast.error('Failed to delete user: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error deleting user:', error);

            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });

                // Handle specific error cases
                if (error.response?.status === 404) {
                    toast.error('User not found');
                } else {
                    // Extract error message from the response if available
                    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
                    toast.error(`Failed to delete user: ${errorMessage}`);
                }
            } else {
                // Generic error message for non-Axios errors
                console.error('Non-Axios error:', error);
                toast.error('Failed to delete user: An unexpected error occurred');
            }
        }
    };

    // Toggle dropdown
    const toggleDropdown = (userId: string) => {
        setActiveDropdown(activeDropdown === userId ? null : userId);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3EC3BA]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Users Management</h1>
                <p className="text-gray-600">Manage user roles and permissions</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6 md:mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3EC3BA] focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.phone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.address || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' :
                                            user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => toggleDropdown(user._id)}
                                                className="text-gray-700 hover:text-gray-900 focus:outline-none flex items-center"
                                            >
                                                <span>Actions</span>
                                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                                </svg>
                                            </button>

                                            {activeDropdown === user._id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                                    <div className="py-1">
                                                        {user.role === 'admin' ? (
                                                            <button
                                                                onClick={() => updateUserRole(user._id, 'user')}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Remove Admin
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => updateUserRole(user._id, 'admin')}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Make Admin
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteUser(user)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' :
                                user.role === 'super-admin' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Phone</p>
                                <p className="text-sm text-gray-700">{user.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Location</p>
                                <p className="text-sm text-gray-700">{user.address || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <div className="flex flex-col space-y-2">
                                {user.role === 'admin' ? (
                                    <button
                                        onClick={() => updateUserRole(user._id, 'user')}
                                        className="w-full py-2.5 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                                    >
                                        Remove Admin
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => updateUserRole(user._id, 'admin')}
                                        className="w-full py-2.5 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 font-medium"
                                    >
                                        Make Admin
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteUser(user)}
                                    className="w-full py-2.5 px-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results Message */}
            {filteredUsers.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">No users match your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default UsersList; 