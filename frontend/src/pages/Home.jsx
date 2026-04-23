import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Star, Clock, Utensils, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="section hero relative overflow-hidden">
        <div className="container grid grid-cols-2 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl mb-6 leading-tight">
              Professional <span className="text-primary">Home Chefs</span> At Your Doorstep.
            </h1>
            <p className="text-xl text-text-light mb-8 max-w-lg">
              Experience gourmet dining in the comfort of your home. Book skilled chefs for daily meals, special occasions, or weekly meal prep.
            </p>
            <div className="flex gap-4">
              <Link to="/chefs" className="btn btn-primary text-lg px-8 py-4">
                Find Your Chef
              </Link>
              <Link to="/register" className="btn btn-outline text-lg px-8 py-4">
                Join as Chef
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass p-4 rounded-[32px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000" 
                alt="Professional Chef" 
                className="rounded-[24px] w-full h-[500px] object-cover"
              />
            </div>
            {/* Stats Badge */}
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl animate-bounce">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-white">
                  <Star fill="currentColor" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold">4.9/5</h4>
                  <p className="text-sm text-text-light">Avg. Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-4">How ChefKart Works</h2>
            <p className="text-text-light text-lg">Delicious meals in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-3 gap-12">
            {[
              { icon: <Search />, title: 'Search', desc: 'Find top-rated chefs based on your preferred cuisine and budget.' },
              { icon: <Clock />, title: 'Schedule', desc: 'Select dates and time slots that fit your lifestyle.' },
              { icon: <Utensils />, title: 'Enjoy', desc: 'Sit back and enjoy fresh, healthy, and professional meals.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ translateY: -10 }}
                className="glass p-8 rounded-3xl text-center"
              >
                <div className="bg-primary/10 text-primary p-4 rounded-2xl w-fit mx-auto mb-6">
                  {React.cloneElement(feature.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl mb-4">{feature.title}</h3>
                <p className="text-text-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
