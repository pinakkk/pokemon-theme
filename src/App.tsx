import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, Music2, Sparkles, Heart, Stars, Gift, Cake, PartyPopper, SkipBack, SkipForward 
} from 'lucide-react';
import { PokemonBattleArena } from './components/PokemonBattleArena'
import { PokemonCakeCeremony } from './components/PokemonCakeCeremony';
import { PokemonFinalMessage } from './components/PokemonFinalMessage';
import PokemonPhotoGallery from './components/PokemonPhotoGallery';
import bgMusic from './components/music/tummile.mp3';

import CoverImg from './components/img/main.jpeg'

// --- Pokemon Card Animation Component ---
function PokemonCardIntro({ onContinue }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
    >
      <motion.div
        className="relative w-80 h-[440px] bg-white rounded-2xl shadow-2xl border-8 border-yellow-400 flex flex-col items-center justify-between p-4"
        initial={{ scale: 0.2, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, duration: 1.2 }}
      >
        {/* Pokemon Card Header */}
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-yellow-700 drop-shadow">Strawberry Chan</span>
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-5 h-5"
            />
            <span className="text-xs font-bold text-gray-500">HP 100</span>
          </div>
        </div>
        
        {/* Card Image */}
        <div className="w-56 h-56 bg-gradient-to-br from-pink-200 to-yellow-200 rounded-xl overflow-hidden border-4 border-pink-300 flex items-center justify-center shadow-inner">
          <img
            src={CoverImg}
            alt="Birthday Girl"
            className="object-cover w-full h-full"
          />
        </div>
        
        {/* Card Description */}
        <div className="w-full mt-4">
          <div className="text-base font-bold text-pink-700 text-center">Strawberry Chan</div>
          <div className="text-xs text-gray-700 text-center mt-1">
            <span className="italic">"Always does hehe, khikhi wherever she goes!"</span>
          </div>
        </div>
        
        {/* Card Abilities */}
        <div className="w-full mt-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-pink-50 rounded p-2">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/love-ball.png" alt="Love Ball" className="w-5 h-5" />
            <span className="font-semibold text-gray-800">Happiness Beam</span>
            <span className="ml-auto text-xs text-gray-500">50❤️</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 rounded p-2">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Master Ball" className="w-5 h-5" />
            <span className="font-semibold text-gray-800">Cute Attack</span>
            <span className="ml-auto text-xs text-gray-500">∞</span>
          </div>
        </div>
        
        {/* Continue Button */}
        <motion.button
          className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-400 to-pink-400 text-white rounded-full font-bold shadow-lg hover:from-yellow-500 hover:to-pink-500 flex items-center gap-2"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
        >
          Start Your Pokémon Birthday Adventure!
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
            alt="Pikachu"
            className="w-6 h-6"
          />
        </motion.button>
        
        {/* Floating Pokemon */}
        <motion.img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
          alt="Pikachu"
          className="absolute -top-8 -right-8 w-16 h-16 drop-shadow-lg"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// Cartoonish animated background with bright gradients
function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      animate={{
        background: [
          "linear-gradient(135deg, #FFEEAD, #FF6F69)",
          "linear-gradient(135deg, #FF6F69, #FFEEAD)",
          "linear-gradient(135deg, #FFEEAD, #FF6F69)"
        ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

// Background ambient music component using shared audioRef
function BgMusic({ audioRef, isPlaying }) {
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Lower volume for background music
    }
  }, [audioRef]);

  useEffect(() => {
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.error('Audio playback failed:', error));
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audioRef]);

  return null;
}

// Floating comic icons for a playful background vibe
function FloatingIcon({ Icon, delay }) {
  const initialX = Math.random() * 100;
  const initialY = Math.random() * 100;
  
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, x: 0 }}
      animate={{
        y: [0, 20, 0],
        opacity: [0.2, 1, 0.2],
        x: [0, 10, 0],
        rotate: [0, 10, -10, 0]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        filter: 'drop-shadow(0 0 8px rgba(255, 111, 105, 0.5))'
      }}
    >
      <Icon className="text-[#FF6F69]" size={28} />
    </motion.div>
  );
}

// --- Enhanced Pokemon Starter Selection Component ---
function PokemonStarterSelection({ onStarterChosen }) {
  const [selectedStarter, setSelectedStarter] = useState(null);
  const [hoveredStarter, setHoveredStarter] = useState(null);
  const [showParticles, setShowParticles] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const starters = [
    {
      id: 1,
      name: "Bulbasaur",
      sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      type: "Grass",
      color: "bg-green-500",
      lightColor: "bg-green-100",
      glowColor: "shadow-green-400/50",
      bgGradient: "from-green-50 to-green-100",
      typeGradient: "from-green-400 to-green-600",
      description: "A loyal companion who grows stronger with you!",
      stats: { hp: 45, attack: 49, defense: 49 },
      ability: "Overgrow",
      emoji: "🌱"
    },
    {
      id: 4,
      name: "Charmander",
      sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      type: "Fire",
      color: "bg-red-500",
      lightColor: "bg-red-100",
      glowColor: "shadow-red-400/50",
      bgGradient: "from-red-50 to-orange-100",
      typeGradient: "from-red-400 to-red-600",
      description: "A fiery friend who lights up your adventures!",
      stats: { hp: 39, attack: 52, defense: 43 },
      ability: "Blaze",
      emoji: "🔥"
    },
    {
      id: 7,
      name: "Squirtle",
      sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
      type: "Water",
      color: "bg-blue-500",
      lightColor: "bg-blue-100",
      glowColor: "shadow-blue-400/50",
      bgGradient: "from-blue-50 to-cyan-100",
      typeGradient: "from-blue-400 to-blue-600",
      description: "A cool companion who goes with the flow!",
      stats: { hp: 44, attack: 48, defense: 65 },
      ability: "Torrent",
      emoji: "💧"
    }
  ];

  const handleStarterClick = (starter) => {
    if (selectedStarter) return;
    setSelectedStarter(starter);
    setShowParticles(false);
    setTimeout(() => {
      setShowConfirmation(true);
    }, 500);
    setTimeout(() => {
      onStarterChosen(starter);
    }, 3500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
    >
      {/* Animated Background Elements */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                exit={{ opacity: 0 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className={`w-full px-4 py-6 sm:py-8 transition-all duration-500 overflow-y-auto max-h-screen ${
          showConfirmation ? 'blur-sm scale-95' : 'blur-none scale-100'
        }`}
      >
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-4 sm:mb-6 lg:mb-10 px-2"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <motion.img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700">
              Select Your Partner Pokémon!
            </span>
            <motion.img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed px-2">
            Each Pokémon has unique abilities and will be your companion throughout this birthday adventure!
          </p>
        </motion.div>
        
        {/* Enhanced Pokemon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center px-2 sm:px-4">
          {starters.map((starter, index) => (
            <motion.div
              key={starter.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border-3 transition-all duration-300 w-full max-w-xs ${
                selectedStarter?.id === starter.id 
                  ? 'border-yellow-400 scale-105 shadow-yellow-400/30' 
                  : hoveredStarter?.id === starter.id
                  ? `border-gray-300 scale-102 ${starter.glowColor}`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.15, type: "spring", stiffness: 120 }}
              whileHover={{ scale: selectedStarter ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStarterClick(starter)}
              onHoverStart={() => !selectedStarter && setHoveredStarter(starter)}
              onHoverEnd={() => setHoveredStarter(null)}
            >
              {/* Card Header */}
              <div className={`h-16 sm:h-24 bg-gradient-to-br ${starter.bgGradient} relative overflow-hidden`}>
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center z-10">
                  <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${starter.typeGradient} text-white font-bold text-xs shadow-lg`}>
                    {starter.emoji} {starter.type}
                  </div>
                  <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 sm:py-1">
                    <img
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                      alt="Pokeball"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                    <span className="text-xs font-bold text-gray-700">#{starter.id.toString().padStart(3, '0')}</span>
                  </div>
                </div>
                
                {/* Floating Type Icons */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-6 right-6 text-4xl">
                    {starter.emoji}
                  </div>
                  <div className="absolute bottom-2 left-2 text-3xl">
                    {starter.emoji}
                  </div>
                </div>
              </div>
              
              {/* Pokemon Image */}
              <div className="relative -mt-8 sm:-mt-12 mb-2 sm:mb-4 flex justify-center">
                <motion.div
                  className="bg-white rounded-full p-2 sm:p-3 shadow-lg border-3 border-gray-200"
                  animate={selectedStarter?.id === starter.id ? {
                    scale: [1, 1.08, 1],
                    rotate: [0, 3, -3, 0],
                    borderColor: ["#e5e7eb", "#fbbf24", "#e5e7eb"]
                  } : hoveredStarter?.id === starter.id ? {
                    scale: [1, 1.03, 1],
                    y: [0, -3, 0]
                  } : {}}
                  transition={{ 
                    duration: selectedStarter?.id === starter.id ? 1.5 : 1, 
                    repeat: selectedStarter?.id === starter.id ? Infinity : 1,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src={starter.sprite}
                    alt={starter.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
                  />
                </motion.div>
              </div>
              
              {/* Card Content */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2 text-center">{starter.name}</h3>
                
                {/* Stats Bars - Compact and mobile friendly */}
                <div className="mb-2 sm:mb-3 space-y-1">
                  {Object.entries(starter.stats).map(([stat, value], i) => (
                    <div key={stat} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-600 capitalize w-10 sm:w-12">{stat}</span>
                      <div className="flex-1 mx-1 sm:mx-2 bg-gray-200 rounded-full h-1.5">
                        <motion.div
                          className={`h-1.5 rounded-full ${starter.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / 65) * 100}%` }}
                          transition={{ delay: 0.8 + index * 0.1 + i * 0.1, duration: 0.6 }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-800 w-5 sm:w-6 text-right">{value}</span>
                    </div>
                  ))}
                </div>
                
                {/* Ability */}
                <div className="mb-2 sm:mb-3 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-2xs sm:text-xs font-semibold text-gray-600">Ability:</span>
                    <span className="text-2xs sm:text-xs font-bold text-gray-800">{starter.ability}</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-2xs sm:text-xs text-center leading-relaxed">
                  {starter.description}
                </p>
              </div>
              
              {/* Selection Indicator */}
              {selectedStarter?.id === starter.id && (
                <motion.div
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-full p-3 shadow-lg z-20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <motion.span 
                    className="text-lg font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    ✓
                  </motion.span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Centered Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedStarter && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop Blur */}
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Modal Content */}
            <motion.div
              className="relative z-70 bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 max-w-md mx-4"
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Sparkle Effects */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="text-center">
                {/* Pokemon Animation */}
                <motion.div
                  className="relative mb-6"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                >
                  <img
                    src={selectedStarter.sprite}
                    alt={selectedStarter.name}
                    className="w-24 h-24 mx-auto"
                  />
                  <motion.div
                    className="absolute -top-3 -right-3 text-3xl"
                    animate={{ 
                      scale: [1, 1.4, 1],
                      rotate: [0, 30, -30, 0]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatDelay: 1.5 
                    }}
                  >
                    {selectedStarter.emoji}
                  </motion.div>
                </motion.div>
                
                {/* Title */}
                <motion.h2 
                  className="text-4xl font-bold text-gray-800 mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Excellent Choice!
                </motion.h2>
                
                {/* Pokemon Name */}
                <motion.p 
                  className="text-2xl text-gray-700 mb-4 font-semibold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {selectedStarter.name} is ready for adventure!
                </motion.p>
                
                {/* Celebration */}
                <motion.div
                  className="flex justify-center items-center gap-3 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  <motion.span 
                    className="text-2xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 20, -20, 0]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity, 
                      repeatDelay: 0.5 
                    }}
                  >
                    🎉
                  </motion.span>
                  <span className="text-lg font-semibold text-gray-700">
                    Starting your journey...
                  </span>
                  <motion.span 
                    className="text-2xl"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, -20, 20, 0]
                    }}
                    transition={{ 
                      duration: 0.8, 
                      repeat: Infinity, 
                      repeatDelay: 0.5,
                      delay: 0.4
                    }}
                  >
                    🎉
                  </motion.span>
                </motion.div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                
                {/* Status Text */}
                <motion.p
                  className="text-sm text-gray-600"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Preparing your Pokemon adventure...
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Main App component managing the experience stages
function App() {
  const audioRef = useRef(new Audio(bgMusic));
  const [stage, setStage] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showPokemonCard, setShowPokemonCard] = useState(true);
  const [showStarterSelection, setShowStarterSelection] = useState(false);
  const [selectedStarter, setSelectedStarter] = useState(null);

  const initializeMusic = () => {
    if (!isMusicPlaying) setIsMusicPlaying(true);
  };

  const handleStarterChosen = (starter) => {
    setSelectedStarter(starter);
    setShowStarterSelection(false);
    initializeMusic();
    setTimeout(() => {
      setStage(1);
    }, 1000);
  };

  const toggleMusic = (e) => {
    e.stopPropagation();
    setIsMusicPlaying(prev => !prev);
  };

  const renderStage = () => {
    if (showPokemonCard) {
      return <PokemonCardIntro onContinue={() => {
        setShowPokemonCard(false);
        setShowStarterSelection(true);
      }} />;
    }
    
    if (showStarterSelection) {
      return <PokemonStarterSelection onStarterChosen={handleStarterChosen} />;
    }
    
    switch (stage) {
      case 1:
        return <PokemonBattleArena onComplete={() => setStage(2)} selectedStarter={selectedStarter} />;
      case 2:
        return <PokemonCakeCeremony onComplete={() => setStage(3)} selectedStarter={selectedStarter} />;
      case 3:
        return (
          <PokemonPhotoGallery 
            onComplete={() => setStage(4)} 
            stopBgMusic={() => setIsMusicPlaying(false)}
            selectedStarter={selectedStarter}
          />
        );
      case 4:
        return <PokemonFinalMessage selectedStarter={selectedStarter} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative" style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}>
      {/* Pokemon-themed Music Toggle Button */}
      <motion.button
        className="fixed top-5 right-5 z-50 bg-white/80 backdrop-blur rounded-full p-3 shadow-lg border border-gray-200 flex items-center gap-2"
        whileHover={{ 
          scale: 1.1,
          rotate: [0, 10, -10, 0],
          backgroundColor: isMusicPlaying ? '#FFEEAD' : '#FF6F69'
        }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        animate={{ 
          backgroundColor: isMusicPlaying ? '#FF6F69' : '#FFFFFF',
          color: isMusicPlaying ? '#FFFFFF' : '#FF6F69'
        }}
      >
        {isMusicPlaying ? <Music2 size={24} /> : <Music size={24} />}
        {selectedStarter && (
          <img
            src={selectedStarter.sprite}
            alt={selectedStarter.name}
            className="w-6 h-6"
          />
        )}
      </motion.button>

      <BgMusic audioRef={audioRef} isPlaying={isMusicPlaying} />
      <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>
    </div>
  );
}

export default App;