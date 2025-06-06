"use client";

import { Calendar, CreditCard, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  // Data untuk fitur-fitur
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Reservasi Mudah",
      description: "Pesan lapangan kapan saja dan di mana saja dengan beberapa klik"
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Pembayaran Aman",
      description: "Berbagai metode pembayaran yang aman dan terpercaya"
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Jaminan Kualitas",
      description: "Semua lapangan dijamin berkualitas dan terawat dengan baik"
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Komunitas Olahraga",
      description: "Bergabunglah dengan komunitas olahraga lokal di sekitar Anda"
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      className="py-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl my-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
    >
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold mb-4">Kenapa Memilih Kami?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Platform reservasi lapangan olahraga terbaik dengan berbagai fitur unggulan
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
} 