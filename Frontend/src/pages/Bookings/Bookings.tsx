import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface BookingItem {
    item: {
        _id: string;
        description: string;
        contentSummary: string;
        storageDetails: string;
        storageLocation?: string;
    };
    quantity: number;
    startDate: string;
    endDate: string;
}

interface BookingRequest {
    _id: string;
    items: BookingItem[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export const Bookings = () => {
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            const response = await fetch('http://localhost:5000/api/booking-requests/my-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            console.log('My bookings data:', data); // Debug log
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load your bookings');
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            setCancelling(bookingId);

            // Get the token from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/booking-requests/${bookingId}/cancel`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel booking');
            }

            toast.success('Booking cancelled successfully');

            // Remove the cancelled booking from the state
            setBookings(prevBookings =>
                prevBookings.filter(booking => booking._id !== bookingId)
            );
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to cancel booking');
            console.error('Error cancelling booking:', error);
        } finally {
            setCancelling(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500';
            case 'approved':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Categorize bookings into active and past
    const categorizeBookings = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeBookings: BookingRequest[] = [];
        const pastBookings: BookingRequest[] = [];

        bookings.forEach(booking => {
            // Check if any item in the booking is active (end date is in the future)
            const hasActiveItem = booking.items.some(item => {
                const endDate = new Date(item.endDate);
                endDate.setHours(0, 0, 0, 0);
                return endDate >= today;
            });

            if (hasActiveItem && booking.status !== 'rejected') {
                activeBookings.push(booking);
            } else {
                pastBookings.push(booking);
            }
        });

        return { activeBookings, pastBookings };
    };

    const { activeBookings, pastBookings } = categorizeBookings();

    // Render a booking card
    const renderBookingCard = (booking: BookingRequest) => (
        <div key={booking._id} className="bg-gray-100 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">
                        Booking Request
                    </h2>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
            </div>

            {booking.items && booking.items.map((bookingItem, index) => (
                <div key={index} className="border-t border-gray-200 pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-bold text-lg">{bookingItem.item.description}</h3>
                            <p className="text-gray-600">
                                <span className="font-medium">Content:</span> {bookingItem.item.contentSummary}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Storage:</span> {bookingItem.item.storageDetails}
                            </p>
                            {bookingItem.item.storageLocation && (
                                <p className="text-gray-600">
                                    <span className="font-medium">Location:</span> {bookingItem.item.storageLocation}
                                </p>
                            )}
                            <p className="text-gray-600">
                                <span className="font-medium">Quantity:</span> {bookingItem.quantity}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">
                                <span className="font-medium">Start Date:</span> {new Date(bookingItem.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">End Date:</span> {new Date(bookingItem.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-4 text-gray-600">
                <p>
                    <span className="font-medium">Requested:</span> {new Date(booking.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* Cancel button for pending bookings */}
            {booking.status === 'pending' && (
                <div className="mt-4">
                    <button
                        className="btn bg-red-500 text-white hover:opacity-90"
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={cancelling === booking._id}
                    >
                        {cancelling === booking._id ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Cancelling...
                            </span>
                        ) : (
                            'Cancel Booking'
                        )}
                    </button>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3EC3BA]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h1 className="text-4xl font-bold mb-10">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    You don't have any bookings yet.
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Active Bookings Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-[#3EC3BA]">Active Bookings</h2>
                        {activeBookings.length === 0 ? (
                            <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                                No active bookings found.
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {activeBookings.map(renderBookingCard)}
                            </div>
                        )}
                    </div>

                    {/* Past Bookings Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-gray-600">Past Bookings</h2>
                        {pastBookings.length === 0 ? (
                            <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                                No past bookings found.
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {pastBookings.map(renderBookingCard)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
