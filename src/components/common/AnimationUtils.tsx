"use client";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Animasi untuk elemen yang mengambang
export const floatingAnimation = {
  y: [0, -10, 0],
  opacity: [0.3, 0.8, 0.3],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
}; 