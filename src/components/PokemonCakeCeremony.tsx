import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { Heart, Sparkles, Music, Stars, Gift, Cake, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PokemonCakeCeremonyProps {
  onComplete: () => void;
}

// Confetti cannon effect using canvas-confetti
const fireConfetti = () => {
  // Fire multiple confetti bursts
  const count = 5;
  const defaults = { 
    origin: { y: 0.7 },
    zIndex: 1000,
    gravity: 0.8,
    scalar: 1.2
  };
  
  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(200 * particleRatio),
    });
  }

  // First burst - center
  fire(0.25, {
    spread: 70,
    origin: { y: 0.9, x: 0.5 },
    colors: ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1']
  });
  
  // Left side
  setTimeout(() => {
    fire(0.15, {
      spread: 60,
      origin: { y: 0.9, x: 0.3 },
      colors: ['#ff9ff3', '#feca57', '#ff6b6b']
    });
  }, 200);
  
  // Right side
  setTimeout(() => {
    fire(0.15, {
      spread: 60,
      origin: { y: 0.9, x: 0.7 },
      colors: ['#48dbfb', '#1dd1a1', '#ff9ff3']
    });
  }, 400);
  
  // Final burst
  setTimeout(() => {
    fire(0.3, {
      spread: 100,
      decay: 0.91,
      origin: { y: 0.8, x: 0.5 },
      colors: ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1', '#f368e0']
    });
  }, 600);
};

// Enhanced Pokemon Cake Ceremony component
export const PokemonCakeCeremony: React.FC<PokemonCakeCeremonyProps> = ({ onComplete }) => {
  const [isCut, setIsCut] = useState(false);
  const [knifePosition, setKnifePosition] = useState({ x: 0, y: 0 });
  const [sliceOffset, setSliceOffset] = useState(0);
  const [cakeAnimationComplete, setCakeAnimationComplete] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [cutEffectPlayed, setCutEffectPlayed] = useState(false);
  const [cakeRotation, setCakeRotation] = useState(0);
  
  const cakeRef = useRef(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const celebrationAudioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (isCut && !cutEffectPlayed) {
      // Play sound effect
      if (celebrationAudioRef.current) {
        celebrationAudioRef.current.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
      
      // Fire confetti animation
      fireConfetti();
      setCutEffectPlayed(true);
      
      // Show next button after a delay
      setTimeout(() => {
        setShowNextButton(true);
      }, 3000);
    }
  }, [isCut, cutEffectPlayed]);
  
  // Cake plate subtle rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCakeRotation(prev => prev === 0 ? 0.5 : 0);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const bind = useGesture({
    onDrag: ({ movement: [mx, my], down, velocity, event }) => {
      if (down && !isCut) {
        // Prevent default touch actions
        event?.preventDefault();
        
        setKnifePosition({ x: mx, y: my });
        
        // Create slice effect when knife moves down
        if (my > 80) {
          setSliceOffset(Math.min(120, my - 80));
          
          // Play knife sound when it first touches the cake
          if (my > 80 && my < 100 && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
          }
        }
        
        // Complete the slice when knife moves down with enough velocity
        if (my > 180 && velocity[1] > 0.5) {
          setIsCut(true);
          
          // Set a timeout for the animation completion
          setTimeout(() => {
            setCakeAnimationComplete(true);
          }, 1500);
        }
      }
    },
  });

  // Background decorations
  const backgroundDecorations = [
    { color: '#ffb8b8', x: '10%', y: '15%', size: 7, delay: 0 },
    { color: '#b8e1ff', x: '90%', y: '20%', size: 10, delay: 1.2 },
    { color: '#ffeab8', x: '20%', y: '85%', size: 8, delay: 0.5 },
    { color: '#b8ffd1', x: '80%', y: '75%', size: 9, delay: 0.9 },
    { color: '#e1b8ff', x: '15%', y: '60%', size: 6, delay: 1.5 },
    { color: '#ffb8e1', x: '85%', y: '40%', size: 7, delay: 0.3 },
  ];

  return (
    <motion.div
      className="w-full h-screen overflow-hidden flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: 'radial-gradient(circle, #fff1f9 0%, #f7e3ff 50%, #e5f0ff 100%)'
      }}
    >
      {/* Audio elements for sound effects */}
      <audio ref={audioRef} src="/knife-cut-sound.mp3" />
      <audio ref={celebrationAudioRef} src="/celebration-sound.mp3" />

      {/* Ambient background decorations */}
      {backgroundDecorations.map((decoration, i) => (
        <motion.div
          key={i}
          className="absolute opacity-30"
          style={{ 
            left: decoration.x, 
            top: decoration.y,
            background: decoration.color,
            borderRadius: '50%',
            width: `${decoration.size}rem`,
            height: `${decoration.size}rem`,
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 5,
            delay: decoration.delay,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}

      {/* Floating hearts background */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-pink-200"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          <Heart size={20 + Math.random() * 30} fill="currentColor" />
        </motion.div>
      ))}

      {/* Title banner */}
      <motion.div
        className="absolute top-8 mb-10 px-10 py-5 rounded-full"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 flex items-center gap-3"
        >
          <Cake className="text-red-500" /> 
          <span>Pokemon Birthday Party</span>
          <Cake className="text-red-500" />
        </motion.h1>
      </motion.div>

      {/* Instructions */}
      <AnimatePresence>
        {!isCut && (
          <motion.div
            className="absolute top-28 mb-8 text-2xl font-medium text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white/70 backdrop-blur-sm shadow-lg text-pink-600"
              animate={{ 
                boxShadow: ['0 4px 6px -1px rgba(0, 0, 0, 0.1)', '0 10px 15px -3px rgba(249, 168, 212, 0.3)', '0 4px 6px -1px rgba(0, 0, 0, 0.1)']
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="text-amber-500" />
              <span>Drag the knife down to cut the cake!</span>
              <Sparkles className="text-amber-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area with cake */}
      <div 
        className="relative w-full max-w-md h-96 mt-16 flex items-center justify-center"
        {...bind()}
        style={{ touchAction: 'none' }}
      >
        {/* Cake stand/plate */}
        <motion.div
          className="absolute bottom-0 w-[320px] h-8 rounded-full bg-gradient-to-r from-gray-200 via-white to-gray-200 shadow-lg"
          style={{ filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.15))" }}
          animate={{ rotate: cakeRotation }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Cake container */}
        <motion.div
          ref={cakeRef}
          className="absolute bottom-8 w-[280px] flex flex-col items-center"
          animate={isCut ? { y: 0, scale: 1.05 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Cake layers */}
          <motion.div
            className="relative w-full h-64 rounded-2xl overflow-hidden"
            style={{ 
              background: isCut ? "linear-gradient(to bottom, #f87171 0%, #ffffff 50%, #ffffff 100%)" : "linear-gradient(to bottom, #f87171 0%, #f87171 49%, #ffffff 50%, #ffffff 100%)",
              boxShadow: "0px 5px 15px rgba(0,0,0,0.08)"
            }}
          >
            {/* Cake Texture */}
            <div className="absolute inset-0 opacity-30" 
              style={{ 
                backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", 
                backgroundSize: "10px 10px" 
              }} 
            />

            {/* Pokeball middle stripe and button - fixed with single center button */}
            <div className="absolute top-[49%] inset-x-0 h-4 bg-black" />
            <motion.div 
              className="absolute top-[47%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-black"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Inner circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 border border-gray-400"></div>
            </motion.div>

            {/* Cake slice effect */}
            {sliceOffset > 0 && (
              <motion.div
                className="absolute w-full"
                style={{
                  height: `${sliceOffset}px`,
                  bottom: 0,
                  clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
                  background: 'linear-gradient(to bottom, #f8bbd0 0%, #f06292 100%)'
                }}
                animate={isCut ? { 
                  y: [0, 30],
                  opacity: [1, 0],
                  x: [0, -20]
                } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}

            {/* Cake layers dividers */}
            <div className="absolute top-1/3 w-full h-2 bg-white/40" />
            <div className="absolute top-2/3 w-full h-2 bg-white/40" />

            {/* Cake decorations */}
            <motion.div
              className="absolute top-12 left-1/2 transform -translate-x-1/2"
              animate={isCut ? { scale: 0, opacity: 0 } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                {/* Heart decoration */}
                <motion.div
                  className="absolute -right-10 -top-3"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Heart size={20} className="text-red-500" fill="currentColor" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Candles - Fixed positioning to prevent clipping */}
        <div className="absolute bottom-[272px] w-full pointer-events-none flex justify-center gap-6 z-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="relative"
              animate={isCut ? { scale: 0, opacity: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {/* Candle stick */}
              <motion.div
                className="w-2 h-24 mx-auto bg-gradient-to-b from-yellow-200 to-yellow-400"
                style={{ 
                  borderRadius: '2px',
                  transformOrigin: 'bottom center'
                }}
                animate={{ rotate: [0, 1, -1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              
              {/* Candle flame - Fixed with absolute positioning */}
              <motion.div
                className="absolute -top-7 left-1/2 transform -translate-x-1/2"
                animate={{ scale: [1, 1.1, 0.9, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <div className="w-4 h-9 bg-gradient-to-b from-yellow-100 via-orange-300 to-red-500"
                  style={{ 
                    borderRadius: '50% 50% 20% 20% / 40% 40% 60% 60%',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 15px rgba(255,179,0,0.7)'
                  }}
                />
                <div className="absolute inset-0 opacity-70"
                  style={{ 
                    borderRadius: '50% 50% 20% 20% / 40% 40% 60% 60%',
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
        
        {/* Knife */}
        {!isCut && (
          <motion.div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              width: 40,
              height: 160,
              x: knifePosition.x,
              y: knifePosition.y,
              rotate: Math.min(35, Math.max(-35, knifePosition.x * 0.2)),
              filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))",
              zIndex: 20
            }}
          >
            <div className="w-full h-28 bg-gradient-to-b from-gray-300 via-gray-100 to-gray-300 rounded-t-xl" />
            <div className="w-5 h-60 mx-auto bg-gradient-to-b from-gray-700 via-gray-900 to-gray-700 rounded-b-lg" />
          </motion.div>
        )}
      </div>

      {/* Celebration message after cutting - improved UI */}
      <AnimatePresence>
        {cakeAnimationComplete && (
          <motion.div
            className="absolute flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              className="text-center max-w-md px-10 py-8 rounded-3xl bg-white/70 backdrop-blur-md shadow-xl border border-red-100"
              animate={{ 
                boxShadow: [
                  '0 10px 25px -5px rgba(252,231,243,0.5)',
                  '0 20px 25px -5px rgba(252,231,243,0.7)',
                  '0 10px 25px -5px rgba(252,231,243,0.5)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.h2 
                className="text-4xl font-bold mb-4 text-red-500"
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.8 }}
              >
                Happy Birthday, Trainer!
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-700 leading-relaxed mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                It's time to celebrate another year of your Pokemon journey! May your Pokedex be full and your battles victorious.
              </motion.p>
              
              <motion.p
                className="text-lg text-blue-500 font-semibold inline-flex items-center gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Gotta catch 'em all! <PartyPopper size={20} className="text-yellow-500" />
              </motion.p>
            </motion.div>
            
            {/* Next button - solid color instead of gradient */}
            {showNextButton && (
              <motion.button
                onClick={onComplete}
                className="px-10 py-4 rounded-full bg-blue-500 text-white font-bold text-xl shadow-lg hover:shadow-xl hover:bg-blue-600 flex items-center gap-3 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 10px 15px -3px rgba(59,130,246,0.3)',
                    '0 15px 25px -5px rgba(59,130,246,0.5)',
                    '0 10px 15px -3px rgba(59,130,246,0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Stars size={22} className="text-white" />
                Let's See Our Pokemon
                <Gift size={22} className="text-white" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};