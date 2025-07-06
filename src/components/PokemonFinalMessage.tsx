import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const PokemonFinalMessage: React.FC = () => {
  const [phase, setPhase] = useState<"pokedex" | "scanning" | "final">("pokedex");
  const [scannedPokemon, setScannedPokemon] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const scanAreaRef = useRef<HTMLDivElement>(null);
  const [beamPos, setBeamPos] = useState({ x: 200, y: 200 });
  
  // Preload images to prevent lag
  useEffect(() => {
    // Preload confetti
    const confettiImg = new Image();
    confettiImg.src = "https://pngimg.com/d/confetti_PNG87017.png";
    
    // Preload pokemon images
    specialPokemon.forEach(pokemon => {
      const img = new Image();
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
    });
  }, []);

  // Special Pokémon to find
  const specialPokemon = [
    { id: 25, name: "Pikachu", hint: "Electric type with red cheeks", position: { top: "18%", left: "22%" } },
    { id: 133, name: "Eevee", hint: "Brown fluffy evolution master", position: { top: "62%", left: "32%" } },
    { id: 39, name: "Jigglypuff", hint: "Round and pink, loves to sing", position: { top: "35%", left: "72%" } },
    { id: 143, name: "Snorlax", hint: "Large and loves to sleep", position: { top: "78%", left: "68%" } },
    { id: 7, name: "Squirtle", hint: "Water starter with a cool shell", position: { top: "54%", left: "17%" } }
  ];

  const scanPokemon = (id: number) => {
    if (!scannedPokemon.includes(id) && !transitionInProgress) {
      const newScanned = [...scannedPokemon, id];
      setScannedPokemon(newScanned);

      if (newScanned.length === specialPokemon.length) {
        // Start transition sequence - prevent further clicks
        setTransitionInProgress(true);
        
        // Small delay before showing confetti
        setTimeout(() => {
          setShowConfetti(true);
          
          // Show confetti for 2 seconds then transition to final
          setTimeout(() => {
            setShowConfetti(false);
            
            // Wait for confetti to fade out before phase change
            setTimeout(() => {
              setPhase("final");
              setTransitionInProgress(false);
            }, 200);
          }, 2000);
        }, 500);
      }
    }
  };

  // Mouse move for scanning beam
  const handleMouseMove = (e: React.MouseEvent) => {
    if (scanAreaRef.current) {
      const rect = scanAreaRef.current.getBoundingClientRect();
      setBeamPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Sparkle animation
  const Sparkle = ({ style = {} }) => (
    <motion.div
      className="absolute pointer-events-none"
      style={style}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
    >
      <Sparkles className="text-yellow-300" size={24} />
    </motion.div>
  );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: "linear-gradient(135deg, #FFEEAD 0%, #FAD0C4 50%, #FBC2EB 100%)",
        fontFamily: 'Comic Neue, Comic Sans MS, cursive'
      }}
    >
      {/* Pokéball decorations */}
      <motion.img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        alt="Pokeball"
        className="absolute top-8 left-8 w-10 h-10 z-30"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
        alt="Great Ball"
        className="absolute top-8 right-8 w-10 h-10 z-30"
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />

      {/* Sparkles - reduced number during transitions */}
      {!transitionInProgress && (
        <>
          <Sparkle style={{ top: "20%", left: "10%" }} />
          <Sparkle style={{ top: "70%", left: "80%" }} />
          <Sparkle style={{ top: "50%", left: "50%" }} />
          <Sparkle style={{ top: "80%", left: "30%" }} />
        </>
      )}

      <AnimatePresence mode="wait">
        {phase === "pokedex" && (
          <motion.div
            key="pokedex"
            className="w-full max-w-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-red-600 rounded-2xl p-6 shadow-2xl border-8 border-gray-800"
              animate={{ boxShadow: ["0 5px 15px rgba(0,0,0,0.3)", "0 10px 25px rgba(0,0,0,0.5)", "0 5px 15px rgba(0,0,0,0.3)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  <motion.div
                    className="w-6 h-6 bg-blue-400 rounded-full border-2 border-white"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <div className="w-3 h-3 bg-red-400 rounded-full border border-white" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full border border-white" />
                </div>
                <div className="text-white text-xl font-bold">POKÉDEX v2.0</div>
              </div>

              <div className="bg-green-100 rounded-lg p-4 mb-4 border-4 border-gray-700">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-3">
                  SPECIAL POKÉMON ALERT!
                </h2>
                <p className="text-gray-700 text-center mb-2">
                  Professor Oak needs your help to scan some rare Pokémon for a special surprise!
                </p>
                <motion.img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                  alt="Pikachu"
                  className="w-24 h-24 mx-auto"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </div>

              <div className="text-white text-center mb-4">
                <p>Scan <span className="font-bold text-yellow-300">{specialPokemon.length}</span> special Pokémon to unlock a birthday surprise!</p>
              </div>

              <motion.button
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg text-lg font-bold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase("scanning")}
              >
                Start Pokémon Scan
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                  alt="Pokeball"
                  className="w-6 h-6"
                />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {phase === "scanning" && (
          <motion.div
            key="scanning"
            ref={scanAreaRef}
            className="w-full max-w-5xl h-[500px] relative rounded-xl shadow-lg p-4 border-4 border-yellow-400 overflow-hidden"
            style={{
              // backgroundImage: "url('https://wallpaperaccess.com/full/45664.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onMouseMove={handleMouseMove}
          >
            {/* Animated scanning beam - only when not transitioning */}
            {!transitionInProgress && (
              <motion.div
                className="pointer-events-none absolute z-40"
                style={{
                  left: beamPos.x - 60,
                  top: beamPos.y - 60,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,0,0.18) 0%, rgba(255,255,0,0.08) 70%, transparent 100%)",
                  boxShadow: "0 0 32px 8px #ffe06688"
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            )}

            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-sm rounded-t-lg p-3 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                  alt="Pokeball"
                  className="w-6 h-6"
                />
                <span className="font-bold text-red-600">Pokémon Scanner</span>
              </div>
              <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                Found: {scannedPokemon.length}/{specialPokemon.length}
              </div>
            </div>

            {/* Hints */}
            <div className="mt-16 bg-white/70 backdrop-blur-sm p-3 rounded-lg max-w-xs z-10 relative">
              <p className="font-medium text-gray-800">
                Move your mouse to scan and click on the hidden Pokémon! Hints:
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                {specialPokemon.map((poke, idx) => (
                  <li
                    key={idx}
                    className={
                      scannedPokemon.includes(poke.id)
                        ? "line-through text-green-700 font-bold"
                        : "text-gray-700"
                    }
                  >
                    {poke.hint}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hidden Pokémon to find */}
            {specialPokemon.map((pokemon) => (
              <motion.div
                key={pokemon.id}
                className="absolute cursor-pointer z-30"
                style={{
                  top: pokemon.position.top,
                  left: pokemon.position.left,
                  opacity: scannedPokemon.includes(pokemon.id) ? 1 : 0.7,
                  filter: scannedPokemon.includes(pokemon.id) ? 'none' : 'brightness(0.5) grayscale(0.7)',
                  pointerEvents: scannedPokemon.includes(pokemon.id) || transitionInProgress ? "none" : "auto"
                }}
                whileHover={!transitionInProgress ? { scale: 1.15, rotate: [0, 8, -8, 0] } : {}}
                onClick={() => scanPokemon(pokemon.id)}
              >
                <motion.img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="w-16 h-16"
                  initial={{ scale: 0.7, opacity: 0.5 }}
                  animate={{
                    scale: scannedPokemon.includes(pokemon.id) ? 1.1 : 1,
                    opacity: scannedPokemon.includes(pokemon.id) ? 1 : 0.7
                  }}
                  transition={{ duration: 0.3 }}
                />
                <AnimatePresence>
                  {scannedPokemon.includes(pokemon.id) && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        Scanned!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Optimized confetti - lightweight version */}
            <AnimatePresence>
              {showConfetti && (
                <motion.div
                  className="absolute inset-0 bg-yellow-200/50 backdrop-blur-sm flex items-center justify-center z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="text-3xl font-bold text-center bg-white/90 px-8 py-4 rounded-xl shadow-lg"
                    initial={{ scale: 0.5, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <div className="text-green-600 mb-2">All Pokémon Found!</div>
                    <div className="text-lg text-purple-600">Preparing your special surprise...</div>
                    <motion.img
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
                      alt="Master Ball"
                      className="w-16 h-16 mx-auto mt-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: 1 }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "final" && (
          <motion.div
            key="final"
            className="max-w-2xl bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border-4 border-yellow-400"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex justify-center mb-6"
            >
              <Heart className="text-red-500" size={48} fill="currentColor" />
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                alt="Pikachu"
                className="w-12 h-12 ml-2"
              />
            </motion.div>

            <h1 className="text-4xl font-bold text-center text-red-600 mb-6 flex items-center justify-center gap-2">
              🎉 HAPPY BIRTHDAY TRAINER NIHUUU! 🎉
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
                alt="Master Ball"
                className="w-10 h-10"
              />
            </h1>

            <p className="text-lg text-gray-800 leading-relaxed font-semibold text-center mb-4">
              Thanks for being the most fun, wild, and wonderful person in my life.<br />
              You're my favorite Pokémon, and every day with you is an epic adventure!
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {specialPokemon.slice(0, 3).map(pokemon => (
                <motion.img
                  key={pokemon.id}
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="w-12 h-12"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: pokemon.id % 3
                  }}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <motion.div
                className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ILYSM TRAINER! 💖⚡️
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};