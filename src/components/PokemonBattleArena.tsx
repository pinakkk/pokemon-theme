import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle } from 'lucide-react';
import BurstS from './soundfx/burst.mp3';

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  hp: number;
  maxHp: number;
  catchRate: number;
  type: string;
  rarity: 'common' | 'rare' | 'legendary';
}

interface Pokeball {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  thrown: boolean;
  hit: boolean;
}

interface PokemonBattleArenaProps {
  onComplete: () => void;
  selectedStarter?: any;
}

const wildPokemon: Pokemon[] = [
  { id: 25, name: 'Pikachu', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', hp: 100, maxHp: 100, catchRate: 0.3, type: 'Electric', rarity: 'rare' },
  { id: 39, name: 'Jigglypuff', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png', hp: 100, maxHp: 100, catchRate: 0.4, type: 'Normal', rarity: 'common' },
  { id: 52, name: 'Meowth', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png', hp: 100, maxHp: 100, catchRate: 0.35, type: 'Normal', rarity: 'common' },
  { id: 104, name: 'Cubone', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png', hp: 100, maxHp: 100, catchRate: 0.25, type: 'Ground', rarity: 'rare' },
  { id: 150, name: 'Mewtwo', sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', hp: 100, maxHp: 100, catchRate: 0.1, type: 'Psychic', rarity: 'legendary' },
];

export const PokemonBattleArena: React.FC<PokemonBattleArenaProps> = ({ onComplete, selectedStarter }) => {
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon>(wildPokemon[0]);
  const [pokeballs, setPokeballs] = useState<Pokeball[]>([]);
  // Changed to Infinity for unlimited pokeballs
  const [pokeballCount, setPokeballCount] = useState(Infinity);
  const [caughtPokemon, setCaughtPokemon] = useState<Pokemon[]>([]);
  const [showCatchAnimation, setShowCatchAnimation] = useState(false);
  const [gamePhase, setGamePhase] = useState<'battle' | 'caught' | 'complete'>('battle');
  const [pokemonPosition, setPokemonPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const [showMissedMessage, setShowMissedMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  // Initialize audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.6;
    }
  }, []);

  // Pokemon movement animation
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPokemonPosition(prev => ({
        x: Math.max(-50, Math.min(50, prev.x + (Math.random() - 0.5) * 30)),
        y: Math.max(-20, Math.min(20, prev.y + (Math.random() - 0.5) * 15)),
      }));
    }, 3000);

    return () => clearInterval(moveInterval);
  }, []);

  // Animate pokeballs
  useEffect(() => {
    const interval = setInterval(() => {
      setPokeballs(prev => prev.map(ball => {
        if (!ball.thrown) return ball;
        
        const dx = ball.targetX - ball.x;
        const dy = ball.targetY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 30) {
          return { ...ball, hit: true };
        }
        
        const speed = 12;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;
        
        return {
          ...ball,
          x: ball.x + moveX,
          y: ball.y + moveY,
        };
      }));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Handle pokeball hits
  useEffect(() => {
    const hitBalls = pokeballs.filter(ball => ball.hit);
    if (hitBalls.length > 0) {
      hitBalls.forEach(() => {
        attemptCatch();
      });
      setPokeballs(prev => prev.filter(ball => !ball.hit));
    }
  }, [pokeballs, currentPokemon]);

  const handleMouseDown = (event: React.MouseEvent) => {
    if (gamePhase !== 'battle') return;
    
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setIsDragging(true);
    setDragStart({ x, y });
    setDragEnd({ x, y });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;
    
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setDragEnd({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    throwPokeball();
  };

  const throwPokeball = () => {
    const newPokeball: Pokeball = {
      id: `ball-${Date.now()}`,
      x: dragStart.x,
      y: dragStart.y,
      targetX: dragEnd.x,
      targetY: dragEnd.y,
      thrown: true,
      hit: false,
    };
    
    setPokeballs(prev => [...prev, newPokeball]);
    // No need to decrement pokeball count as they're unlimited
    
    // Play throw sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const attemptCatch = () => {
    const catchSuccess = Math.random() < currentPokemon.catchRate;
    
    if (catchSuccess) {
      // Pokemon caught!
      setShowCatchAnimation(true);
      setCaughtPokemon(prev => [...prev, currentPokemon]);
      
      setTimeout(() => {
        setShowCatchAnimation(false);
        
        if (caughtPokemon.length + 1 >= 3) {
          setGamePhase('complete');
        } else {
          // Next Pokemon
          const nextPokemon = wildPokemon[Math.floor(Math.random() * wildPokemon.length)];
          setCurrentPokemon(nextPokemon);
          setGamePhase('caught');
          
          setTimeout(() => {
            setGamePhase('battle');
          }, 2000);
        }
      }, 2000);
    } else {
      // Pokemon broke free
      setCurrentPokemon(prev => ({ ...prev, hp: Math.max(0, prev.hp - 20) }));
      setShowMissedMessage(true);
      
      setTimeout(() => {
        setShowMissedMessage(false);
      }, 1500);
      
      if (currentPokemon.hp <= 20) {
        // Pokemon fainted, get new one
        const nextPokemon = wildPokemon[Math.floor(Math.random() * wildPokemon.length)];
        setCurrentPokemon(nextPokemon);
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-600';
      case 'rare': return 'text-blue-600';
      case 'common': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]';
      case 'rare': return 'drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]';
      case 'common': return 'drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]';
      default: return '';
    }
  };

  return (
    <motion.div
      ref={arenaRef}
      className="w-full h-screen relative overflow-hidden cursor-crosshair select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
      style={{
        background: "linear-gradient(180deg, #87CEEB 0%, #228B22 30%, #006400 70%, #2F4F2F 100%)",
        fontFamily: "Comic Neue, Comic Sans MS, cursive",
      }}
    >
      {/* Forest Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Static Trees */}
        <div className="absolute bottom-0 left-10 text-6xl opacity-60">🌲</div>
        <div className="absolute bottom-0 right-10 text-8xl opacity-50">🌳</div>
        <div className="absolute bottom-0 left-1/3 text-7xl opacity-40">🌲</div>
        <div className="absolute bottom-0 right-1/3 text-5xl opacity-70">🌿</div>
        
        {/* Static Bushes */}
        <div className="absolute bottom-0 left-1/4 text-4xl opacity-60">🌱</div>
        <div className="absolute bottom-0 right-1/4 text-4xl opacity-60">🌿</div>
        <div className="absolute bottom-0 left-3/4 text-3xl opacity-50">🌾</div>
        <div className="absolute bottom-0 right-1/5 text-3xl opacity-50">🌿</div>
        
        {/* Gentle floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-20"
            style={{
              left: `${20 + i * 25}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      {/* Drag line indicator */}
      {isDragging && (
        <motion.svg
          className="absolute inset-0 pointer-events-none z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <line
            x1={dragStart.x}
            y1={dragStart.y}
            x2={dragEnd.x}
            y2={dragEnd.y}
            stroke="#ff4444"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="drop-shadow-lg"
          />
          <circle
            cx={dragStart.x}
            cy={dragStart.y}
            r="8"
            fill="#ff4444"
            className="drop-shadow-lg"
          />
        </motion.svg>
      )}

      {/* UI Elements - Improved header */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-green-400">
          <h1 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">
            <span className="text-2xl">🌲</span> Wild Pokemon Arena
          </h1>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-6 h-6"
            />
            <span className="text-sm font-semibold text-gray-800">Unlimited</span>
          </div>
          <div className="bg-green-100 rounded-md p-2 text-sm text-green-800">
            <p className="font-medium">Drag to aim and throw!</p>
          </div>
        </div>
      </div>

      {/* Caught Pokemon Display - Improved */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-blue-400">
          <h3 className="text-base font-bold text-blue-700 mb-3 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Pokemon Caught: {caughtPokemon.length}/3
          </h3>
          <div className="flex gap-3 bg-blue-50 p-2 rounded-md">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="relative">
                {caughtPokemon[index] ? (
                  <motion.div 
                    className="relative"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                  >
                    <motion.img
                      src={caughtPokemon[index].sprite}
                      alt={caughtPokemon[index].name}
                      className="w-12 h-12 bg-white rounded-full border-2 border-blue-300 shadow-md"
                      whileHover={{ scale: 1.1 }}
                    />
                    <motion.div 
                      className="absolute -bottom-1 -right-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wild Pokemon */}
      <AnimatePresence mode="wait">
        {gamePhase === 'battle' && (
          <motion.div
            key={currentPokemon.id}
            className="absolute z-10"
            style={{
              left: `calc(50% + ${pokemonPosition.x}px)`,
              top: `calc(35% + ${pokemonPosition.y}px)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="relative">
              {/* Pokemon HP Bar - Improved */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-32">
                <div className="text-center text-sm font-bold text-white bg-gray-800/70 rounded-t-md px-2 py-1 mb-1">
                  {currentPokemon.hp}/{currentPokemon.maxHp} HP
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 border border-white shadow-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: `${(currentPokemon.hp / currentPokemon.maxHp) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              
              {/* Pokemon Sprite - Made bigger */}
              <motion.img
                src={currentPokemon.sprite}
                alt={currentPokemon.name}
                className={`w-48 h-48 ${getRarityGlow(currentPokemon.rarity)}`}
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Pokemon Info - Improved */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-lg text-center shadow-lg border border-gray-600 min-w-[140px]">
                <div className={`font-bold text-lg ${getRarityColor(currentPokemon.rarity)}`}>
                  {currentPokemon.name}
                </div>
                <div className="text-sm text-gray-300">{currentPokemon.type} Type</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Missed catch message */}
      <AnimatePresence>
        {showMissedMessage && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-red-500/90 text-white py-2 px-4 rounded-full font-bold text-lg shadow-lg">
              It broke free! Try again!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thrown Pokeballs */}
      <AnimatePresence>
        {pokeballs.map((ball) => (
          <motion.div
            key={ball.id}
            className="absolute z-30 pointer-events-none"
            style={{
              left: ball.x - 20,
              top: ball.y - 20,
              width: 40,
              height: 40,
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-full h-full drop-shadow-lg"
              animate={{
                rotate: ball.thrown ? [0, 360] : 0,
              }}
              transition={{
                rotate: { duration: 0.3, repeat: Infinity, ease: "linear" }
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Catch Animation - Improved */}
      <AnimatePresence>
        {showCatchAnimation && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-green-100 backdrop-blur-md rounded-2xl p-6 shadow-xl border-4 border-green-400 text-center max-w-xs">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="inline-block mb-3"
              >
                <CheckCircle className="w-12 h-12 text-green-500 drop-shadow-lg" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                🎉 Gotcha!
              </h2>
              <p className="text-base text-gray-800 mb-3">
                {currentPokemon.name} was caught!
              </p>
              <div className="flex justify-center">
                <motion.img
                  src={currentPokemon.sprite}
                  alt={currentPokemon.name}
                  className="w-20 h-20 drop-shadow-lg"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Complete - Improved with blurred backdrop */}
      <AnimatePresence>
        {gamePhase === 'complete' && (
          <>
            {/* Blurred backdrop overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Center container with fixed positioning */}
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                className="w-full max-w-md"
              >
                <div className="bg-gradient-to-br from-yellow-50 to-orange-100 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border-4 border-yellow-400 text-center">
              
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-600 mb-3">
                    🎊 Pokemon Master!
                  </h2>
                  <p className="text-base md:text-lg text-gray-800 mb-4">
                    You've caught 3 Pokemon! Amazing work, strawberry chan!
                  </p>
                  <div className="flex justify-center gap-3 md:gap-4 mb-6 bg-yellow-100/50 p-3 md:p-4 rounded-xl">
                    {caughtPokemon.map((pokemon, index) => (
                      <motion.div
                        key={index}
                        className="relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        <motion.img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg bg-white/50 rounded-full p-1 border-2 border-yellow-300"
                          animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            delay: index * 0.3, 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1 + index * 0.2 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                        <div className="text-xs font-medium text-gray-700 mt-1">
                          {pokemon.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 md:px-6 md:py-3 rounded-full text-base md:text-lg font-bold shadow-lg hover:from-yellow-600 hover:to-orange-600 flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                  >
                    <Sparkles className="w-5 h-5" />
                    Continue to Birthday Celebration! 🎂
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Instructions - Improved */}
      <motion.div
        className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border-2 border-purple-400 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h4 className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          How to Play:
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-purple-500">1.</span> Click and drag to aim your Pokeball
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">2.</span> Release to throw at the Pokemon
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">3.</span> Different Pokemon have different catch rates
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">4.</span> Catch 3 Pokemon to continue!
          </li>
        </ul>
      </motion.div>

      {/* Audio */}
      <audio ref={audioRef} src={BurstS} preload="auto" />
    </motion.div>
  );
};

export default PokemonBattleArena;