import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Star, MapPin, Search, Filter, ChefHat, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="section min-h-screen bg-background relative py-24">
      <div className="container relative z-10">
        <div className="flex justify-between items-end mb-24 border-b border-glass-border pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-6">
              <ChefHat size={16} />
              The Collection
            </div>
            <h1 className="text-7xl tracking-tighter mb-4 text-text">Master <span className="text-primary italic">Home Chefs</span></h1>
            <p className="text-text-light text-xl max-w-lg font-medium opacity-80">Discover exceptional culinary talent curated for your private residence.</p>
          </motion.div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light opacity-50 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search cuisines..." 
                className="pl-14 pr-6 py-4 rounded-2xl bg-white border border-glass-border focus:border-primary outline-none w-72 shadow-sm transition-all"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
              />
            </div>
            <button className="btn btn-outline h-[58px] px-8 rounded-2xl border-glass-border font-bold text-[11px] uppercase tracking-widest">
              <Filter size={18} />
              Refine
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="animate-spin text-primary" size={48} strokeWidth={1.5} />
            <p className="text-text-light font-bold uppercase tracking-[0.4em] text-[10px]">Scanning the Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {chefs.map((chef, i) => (
                <motion.div 
                  key={chef._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="precious-card flex flex-col h-full bg-white group"
                >
                  <div className="p-10 flex-1 relative">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-1.5 text-primary">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-black uppercase tracking-widest">{chef.rating?.toFixed(1) || '5.0'}</span>
                      </div>
                      {location.lat && chef.userId?.location?.coordinates && (
                        <span className="text-[10px] font-black text-text-light uppercase tracking-widest px-3 py-1 bg-background rounded-full border border-glass-border">
                          {(Math.sqrt(
                            Math.pow(chef.userId.location.coordinates[1] - location.lat, 2) + 
                            Math.pow(chef.userId.location.coordinates[0] - location.lng, 2)
                          ) * 111).toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <h3 className="text-4xl mb-3 tracking-tighter group-hover:text-primary transition-colors">
                      {chef.userId?.name || 'Chef Gastronomy'}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-text-light text-xs mb-8 font-bold uppercase tracking-widest opacity-70">
                      <MapPin size={14} className="text-primary/60" />
                      {chef.userId?.city || 'Elite Circle'}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {(chef.cuisines || ['Continental', 'Italian']).map((c, idx) => (
                        <span key={idx} className="bg-background border border-glass-border text-text-light px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="pt-10 border-t border-glass-border flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1.5">Honorarium</p>
                        <p className="text-3xl font-bold text-text">₹{chef.pricing}<span className="text-xs font-medium text-text-light"> /session</span></p>
                      </div>
                      <Link to={`/chefs/${chef.userId?._id || chef._id}`} className="btn btn-primary p-4 rounded-2xl shadow-none group-hover:bg-primary transition-all">
                        <ArrowRight size={20} className="text-white" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && chefs.length === 0 && (
          <div className="text-center py-40 precious-card border-dashed bg-transparent border-2">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-8 border border-glass-border">
              <Search size={32} className="text-text-light opacity-30" />
            </div>
            <h3 className="text-4xl mb-4 tracking-tighter">No chefs found</h3>
            <p className="text-text-light text-lg mb-12 opacity-80 max-w-sm mx-auto">Our current selection does not match your specific search criteria.</p>
            <button onClick={() => setCuisine('')} className="btn btn-outline px-10">Expand Selection</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chefs;
