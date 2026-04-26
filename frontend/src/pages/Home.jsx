import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Search, Award, ShieldCheck, Sparkles, ArrowRight, Utensils, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="home bg-background">
      {/* Hero Section */}
      <section className="section hero relative flex items-center pt-32 pb-20 overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-[11px] uppercase tracking-widest border border-primary/20">
                  <Sparkles size={14} className="inline mr-2" />
                  The Private Culinary Collection
                </span>
              </div>
              
              <h1 className="text-[90px] leading-[1.05] mb-8 tracking-tighter text-text">
                Extraordinary <br />
                <span className="text-primary italic">Home Chefs</span> <br />
                For Private Tables.
              </h1>
              
              <p className="text-xl text-text-light mb-12 max-w-lg font-medium leading-relaxed">
                Experience the transcendence of a Michelin-star kitchen, choreographed within the intimacy of your residence.
              </p>
              
              <div className="flex gap-6">
                <Link to="/chefs" className="btn btn-primary group shadow-lg">
                  Explore Chefs
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/register" className="btn btn-outline">
                  Join The Circle
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-12 border-t border-glass-border pt-12">
                <div>
                  <div className="flex -space-x-3 mb-4">
                    {[1,2,3,4].map(i => (
                      <img 
                        key={i}
                        src={`https://i.pravatar.cc/100?u=${i+20}`} 
                        alt="User" 
                        className="w-12 h-12 rounded-full border-2 border-white"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-text-light uppercase tracking-widest">
                    <span className="text-text">2k+</span> Refined Households
                  </p>
                </div>
                <div className="h-12 w-[1px] bg-glass-border"></div>
                <div>
                   <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-primary text-primary" />)}
                   </div>
                   <p className="text-sm font-bold text-text-light uppercase tracking-widest">4.9/5 Master Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="relative z-10 precious-card p-4 rounded-[60px] bg-white shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200" 
                  alt="Fine Dining" 
                  className="feature-image"
                />
                
                <div className="absolute left-6 top-6 glass p-8 rounded-[32px] shadow-xl animate-float max-w-[220px]">
                  <div className="bg-primary/10 p-3 rounded-2xl w-fit mb-4">
                    <Award size={32} className="text-primary" />
                  </div>
                  <div className="font-bold text-sm tracking-widest uppercase">Certified</div>
                  <div className="text-xs text-text-light font-medium mt-1">Vetted Excellence</div>
                </div>

                <div className="absolute right-6 bottom-6 glass p-8 rounded-[32px] shadow-xl max-w-[220px]">
                  <div className="bg-accent/10 p-3 rounded-2xl w-fit mb-4">
                    <ShieldCheck size={32} className="text-accent" />
                  </div>
                  <div className="font-bold text-sm tracking-widest uppercase">Insured</div>
                  <div className="text-xs text-text-light font-medium mt-1">Premium Security</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white border-y border-glass-border">
        <div className="container">
          <div className="text-center mb-24">
            <h2 className="text-6xl mb-6 tracking-tighter">The ChefKart Distinction</h2>
            <p className="text-text-light text-xl max-w-2xl mx-auto font-medium">Elevating private culinary services through meticulous vetting and technology.</p>
          </div>
          
          <div className="grid grid-cols-3 gap-12">
            {[
              { 
                icon: <Search />, 
                title: 'Curated Selection', 
                desc: 'Only the top 1% of culinary artists who pass our rigorous multi-stage vetting process join our collective.' 
              },
              { 
                icon: <Clock />, 
                title: 'Bespoke Timing', 
                desc: 'Whether it is a daily commitment or a one-off gala, our scheduling infrastructure adapts to your rhythm.' 
              },
              { 
                icon: <Utensils />, 
                title: 'Alchemical Craft', 
                desc: 'Experience more than a meal. Our chefs create memories through ingredients sourced at their peak.' 
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="precious-card p-16 flex flex-col items-center text-center hover:bg-background/50"
              >
                <div className="w-20 h-20 bg-background border border-glass-border text-primary flex items-center justify-center rounded-[24px] mb-10 group-hover:scale-110 transition-all">
                  {React.cloneElement(feature.icon, { size: 36 })}
                </div>
                <h3 className="text-3xl mb-6 font-bold tracking-tight">{feature.title}</h3>
                <p className="text-text-light leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="precious-card p-24 text-center bg-secondary relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-7xl mb-10 tracking-tighter text-white">Initiate Your <br /> <span className="text-primary italic">Private Experience</span></h2>
              <p className="text-xl text-white/70 mb-16 max-w-2xl mx-auto font-medium">The table is set. The master is ready. Your extraordinary journey begins with a single selection.</p>
              <Link to="/register" className="btn btn-primary px-16 py-6 text-lg bg-white text-secondary hover:bg-primary hover:text-white">
                Enter The Circle
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
