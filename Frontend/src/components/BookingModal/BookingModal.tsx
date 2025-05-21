import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Item } from '../../types/types';
import { toast } from 'react-toastify';
import { AuthContext } from '../../providers/AuthProvider';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/slices/cartSlice';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  status: string;
  createdAt: string;
}

interface BookingModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (items: BookingItem[]) => void;
  existingBooking?: BookingRequest;
  allBookings?: BookingRequest[];
}

const BookingModal: React.FC<BookingModalProps> = ({
  item,
  isOpen,
  onClose,
  onUpdate,
  existingBooking,
  allBookings = [],
}) => {
  // Debug: log incoming props
  console.log('BookingModal mounted. Props -> existingBooking:', existingBooking);
  console.log('BookingModal mounted. Props -> allBookings:', allBookings);
  console.log('BookingModal mounted. Props -> item._id:', item._id);

  // State for selected range and quantity
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(() => {
    if (existingBooking) {
      return [
        new Date(existingBooking.items[0].startDate),
        new Date(existingBooking.items[0].endDate),
      ];
    }
    return null;
  });
  const [quantity, setQuantity] = useState<number>(
    existingBooking?.items[0].quantity || 1
  );

  const { user } = useContext(AuthContext)!;
  const dispatch = useAppDispatch();

  // Compute booked ranges without setState to avoid infinite loops
  const bookedRanges = useMemo(() => {
    console.log('Computing bookedRanges with allBookings and item._id');
    const approved = allBookings.filter((b) => b.status === 'approved');
    const matches = approved.flatMap((b) =>
      b.items
        .filter((i) => {
          // If item is populated object
          if (typeof i.item === 'object' && '_id' in i.item) {
            return i.item._id.toString() === item._id.toString();
          }
          // If item is just an ObjectId string
          return typeof i.item === 'string' && i.item === item._id.toString();
        })
        .map((i) => ({
          start: new Date(i.startDate),
          end: new Date(i.endDate),
        }))
    );
    console.log('bookedRanges:', matches);
    return matches;
  }, [allBookings, item._id]);

  // Normalize date to Y-M-D for comparison
  const normalizeDate = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // Calendar tile helpers
  const tileDisabled = ({ date }: { date: Date }) => {
    const d = normalizeDate(date);
    return bookedRanges.some(
      ({ start, end }) =>
        d >= normalizeDate(start) && d <= normalizeDate(end)
    );
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const d = normalizeDate(date);
    return bookedRanges.some(
      ({ start, end }) =>
        d >= normalizeDate(start) && d <= normalizeDate(end)
    )
      ? 'bg-red-200 text-red-700'
      : '';
  };

  const tileContent = ({ date }: { date: Date }) => {
    const d = normalizeDate(date);
    const isBooked = bookedRanges.some(
      ({ start, end }) =>
        d >= normalizeDate(start) && d <= normalizeDate(end)
    );
    return isBooked ? (
      <div className="text-xs text-red-700 mt-1">Booked</div>
    ) : null;
  };

  // Reset local state when modal opens/closes
  useEffect(() => {
    if (!isOpen && !existingBooking) {
      setDateRange(null);
      setQuantity(1);
    }
    if (isOpen && existingBooking) {
      setDateRange([
        new Date(existingBooking.items[0].startDate),
        new Date(existingBooking.items[0].endDate),
      ]);
      setQuantity(existingBooking.items[0].quantity);
    }
  }, [isOpen, existingBooking]);

  const handleSubmit = () => {
    if (!user) {
      toast.error('Please login to book items');
      return;
    }

    if (!user.email) {
      toast.error('User email not found');
      return;
    }

    if (!dateRange || dateRange.length !== 2) {
      toast.error('Please select a valid date range');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    const [startDate, endDate] = dateRange;
    const formattedItem: BookingItem = {
      item: {
        _id: item._id,
        description: item.description,
        contentSummary: item.contentSummary,
        storageDetails: item.storageDetails,
        storageLocation: item.storageLocation,
      },
      quantity,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    console.log('Booking submission payload:', formattedItem);

    if (onUpdate && existingBooking) {
      onUpdate([formattedItem]);
    } else {
      dispatch(
        addToCart({
          item: {
            ...item,
            quantity,
            bookingDates: {
              startDate: formattedItem.startDate,
              endDate: formattedItem.endDate,
            },
          },
          userEmail: user.email,
        })
      );
      toast.success('Item added to cart successfully!');
      onClose();
    }
  };

  return (
    <dialog id="booking_modal" className={`modal ${isOpen ? 'modal-open' : ''}`}> 
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-2xl mb-4">
          {existingBooking ? 'Update Booking' : 'Book Item'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Info */}
          <div className="bg-gray-100 rounded-xl p-4">
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              {item.description}
            </h4>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Content:</span> {item.contentSummary}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Storage:</span> {item.storageDetails}
            </p>
            {item.storageLocation && (
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Location:</span> {item.storageLocation}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`w-3 h-3 rounded-full ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                title={item.isAvailable ? 'Available' : 'Not Available'}
              ></div>
              <span className="text-gray-600">
                {item.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Date & Quantity */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Dates
              </label>
              <Calendar
                selectRange
                value={dateRange}
                onChange={(r) => setDateRange(r as [Date, Date])}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                tileContent={tileContent}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                min="1"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button
            className="btn bg-[#3EC3BA] text-white hover:opacity-90"
            onClick={handleSubmit}
          >
            {existingBooking ? 'Update Booking' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default BookingModal;
