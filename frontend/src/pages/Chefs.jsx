import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Chefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  useEffect(() => {
    fetchChefs();
  }, [cuisine, location]);

  const fetchChefs = async () => {
    try {
      const url = `/chefs?cuisine=${cuisine}${location.lat ? `&lat=${location.lat}&lng=${location.lng}` : ''}`;
      const res = await api.get(url);
      setChefs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section bg-surface min-h-screen">
      <div className="container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl mb-2">Discover Home Chefs</h1>
            <p className="text-text-light">Browse top-rated chefs in your area</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
              <input 
                type="text" 
                placeholder="Search cuisines..." 
                className="pl-12 pr-4 py-3 rounded-xl bg-white shadow-sm border-none outline-none w-64"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>
            <button className="btn glass flex items-center gap-2">
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading chefs...</div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {chefs.map((chef, i) => (
              <motion.div 
                key={chef._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[32px] overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative h-64">
                  <img 
                    src={chef.userId?.profileImage || `https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=600`} 
                    alt={chef.userId?.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 font-bold">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    {chef.rating?.toFixed(1) || '0.0'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl mb-2">{chef.userId?.name || 'Unknown Chef'}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-text-light">
                      <MapPin size={16} />
                      {chef.userId?.address || 'Nearby'}
                    </div>
                    {location.lat && chef.userId?.location?.coordinates && Array.isArray(chef.userId.location.coordinates) && (
                      <span className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full font-bold">
                        {(Math.sqrt(
                          Math.pow(chef.userId.location.coordinates[1] - location.lat, 2) + 
                          Math.pow(chef.userId.location.coordinates[0] - location.lng, 2)
                        ) * 111).toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(chef.cuisines || []).map((c, i) => (
                      <span key={i} className="bg-primary/5 text-primary px-3 py-1 rounded-lg text-sm font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-glass-border">
                    <div>
                      <p className="text-sm text-text-light">Starting from</p>
                      <p className="text-xl font-bold text-primary">₹{chef.pricing}<span className="text-sm text-text-light">/meal</span></p>
                    </div>
                    <Link to={`/chefs/${chef.userId?._id || chef._id}`} className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && chefs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[32px] shadow-sm">
            <h3 className="text-2xl mb-2">No chefs found</h3>
            <p className="text-text-light">Try searching for a different cuisine</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;
