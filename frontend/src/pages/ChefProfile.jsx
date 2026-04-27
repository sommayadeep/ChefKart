import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Calendar, Clock, CheckCircle, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';

const ChefProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: 'Lunch (12:00 PM - 2:00 PM)',
    notes: ''
  });

  useEffect(() => {
    fetchChef();
  }, [id]);

  const fetchChef = async () => {
    try {
      const res = await api.get(`/chefs/${id}`);
      setChef(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  const confirmBooking = async (paymentId) => {
    try {
      await api.post('/bookings', {
        chefId: id,
        ...bookingData,
        totalAmount: chef.pricing,
        paymentId
      });
      alert('Booking and Payment successful!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to create booking');
    } finally {
      setShowPayment(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!chef) return <div className="text-center py-20">Chef not found</div>;

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container">
        <div className="grid grid-cols-3 gap-12">
          {/* Left Column: Profile Info */}
          <div className="col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-10 rounded-[40px] mb-8"
            >
              <div className="flex flex-col mb-10">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-4xl">{chef.userId?.name || 'Chef'}</h1>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl flex items-center gap-2 font-bold">
                    <Star size={20} className="fill-current" />
                    {chef.rating?.toFixed(1) || '0.0'} ({chef.numReviews || 0} Reviews)
                  </div>
                </div>
                  <div className="flex items-center gap-6 text-text-light mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      {chef.userId?.address || 'Location Hidden'}
                    </div>
                    <div className="flex items-center gap-2">
                      <ChefHat size={18} />
                      {chef.experience || 0} Years Experience
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(chef.cuisines || []).map((c, i) => (
                      <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">
                        {c}
                      </span>
                    ))}
                  </div>
              </div>

              <div className="border-t border-glass-border pt-10">
                <h3 className="text-2xl mb-4">About the Chef</h3>
                <p className="text-text-light text-lg mb-8 leading-relaxed">
                  {chef.bio || `Professional chef with over ${chef.experience} years of experience specializing in healthy and delicious home-cooked meals. I focus on using fresh, seasonal ingredients to create memorable dining experiences.`}
                </p>
                <h3 className="text-2xl mb-4">Specialties</h3>
                <div className="grid grid-cols-2 gap-4">
                  {(chef.specialties.length > 0 ? chef.specialties : ['Custom Meal Planning', 'Dietary Restrictions', 'Weekly Meal Prep', 'Fine Dining']).map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-text-light">
                      <CheckCircle size={20} className="text-green-500" />
                      {s}
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-10 border-t border-glass-border">
                  <h3 className="text-2xl mb-4 flex items-center gap-2">
                    <Clock size={24} className="text-primary" />
                    Available Days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {chef.availability.map((day, i) => (
                      <span key={i} className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-bold border border-green-100">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booking Sidebar */}
          <div className="col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[40px] sticky top-32"
            >
              <h3 className="text-2xl mb-6">Book this Chef</h3>
              <div className="bg-surface p-4 rounded-2xl mb-8">
                <p className="text-sm text-text-light">Service Fee</p>
                <p className="text-3xl font-bold text-primary">₹{chef.pricing}<span className="text-sm text-text-light">/meal</span></p>
              </div>

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Select Date</label>
                  <div className="relative">
                    <Calendar className="input-icon text-text-light" size={20} />
                    <input 
                      type="date" 
                      className="input-with-icon w-full pr-4 py-4 rounded-2xl bg-surface border-none outline-none focus:ring-2 ring-primary"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Time Slot</label>
                  <div className="relative">
                    <Clock className="input-icon text-text-light" size={20} />
                    <select 
                      className="input-with-icon w-full pr-4 py-4 rounded-2xl bg-surface border-none outline-none focus:ring-2 ring-primary appearance-none"
                      value={bookingData.timeSlot}
                      onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                    >
                      <option>Breakfast (8:00 AM - 10:00 AM)</option>
                      <option>Lunch (12:00 PM - 2:00 PM)</option>
                      <option>Dinner (7:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 ml-1">Special Instructions</label>
                  <textarea 
                    placeholder="Any dietary preferences or allergies?"
                    className="input-with-icon w-full p-4 rounded-2xl bg-surface border-none outline-none focus:ring-2 ring-primary min-h-[100px]"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full py-4 justify-center text-lg mt-4">
                  Proceed to Booking
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal 
          amount={chef.pricing} 
          onConfirm={confirmBooking}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default ChefProfile;
