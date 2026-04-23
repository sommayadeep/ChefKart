import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = () => {
  const { socket, user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewBooking = (data) => {
      addNotification(data.message);
    };

    const handleStatusUpdate = (data) => {
      addNotification(data.message);
    };

    socket.on('newBooking', handleNewBooking);
    socket.on('bookingStatusUpdate', handleStatusUpdate);

    return () => {
      socket.off('newBooking', handleNewBooking);
      socket.off('bookingStatusUpdate', handleStatusUpdate);
    };
  }, [socket, user]);

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-24 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="glass p-6 rounded-2xl shadow-2xl border-l-4 border-primary min-w-[300px] pointer-events-auto flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <Bell size={20} />
              </div>
              <p className="font-medium text-sm">{n.message}</p>
            </div>
            <button 
              onClick={() => removeNotification(n.id)}
              className="text-text-light hover:text-primary transition"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
