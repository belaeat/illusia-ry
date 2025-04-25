import React from 'react';

const MyBookings: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="bg-white rounded-lg shadow">
                {/* Add your bookings table or grid here */}
                <div className="p-4">
                    <p>Your bookings will be displayed here</p>
                </div>
            </div>
        </div>
    );
};

export default MyBookings; 