import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Pokemon card data
const pokemonCards = [
  {
    id: 1,
    name: "Snugglebun",
    type: "Cuddle Type",
    hp: 120,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    description: "\"Gives the warmest hugs in the Pokémon universe!\"",
    abilities: [
      { name: "Tickle Tornado", power: "70♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/premier-ball.png" },
      { name: "Friendship Beam", power: "∞", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/friend-ball.png" }
    ],
    bgColor: "from-pink-200 to-yellow-200",
    borderColor: "border-pink-300"
  },
  {
    id: 2,
    name: "Gigglefloof",
    type: "Laughter Type",
    hp: 95,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    description: "\"Causes unstoppable laughter with its silly dance moves!\"",
    abilities: [
      { name: "Chuckle Wave", power: "55♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/heal-ball.png" },
      { name: "Silly Spin", power: "80♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fast-ball.png" }
    ],
    bgColor: "from-blue-200 to-purple-200",
    borderColor: "border-blue-300"
  },
  {
    id: 3,
    name: "Bubblezap",
    type: "Mischief Type",
    hp: 110,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png",
    description: "\"Always planning the next prank with a twinkle in its eye!\"",
    abilities: [
      { name: "Surprise Splash", power: "65♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dive-ball.png" },
      { name: "Prank Pulse", power: "95♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/luxury-ball.png" }
    ],
    bgColor: "from-yellow-200 to-green-200",
    borderColor: "border-yellow-300"
  },
  {
    id: 4,
    name: "Squishymeow",
    type: "Adorable Type",
    hp: 105,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    description: "\"Melts hearts with its big sparkly eyes and tiny paws!\"",
    abilities: [
      { name: "Charm Overload", power: "75♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/love-ball.png" },
      { name: "Purr Power", power: "60♡", icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-ball.png" }
    ],
    bgColor: "from-green-200 to-teal-200",
    borderColor: "border-green-300"
  }
];

// Individual Pokemon Card Component
const PokemonCard = ({ pokemon }) => {
  return (
    <motion.div
      className="relative w-72 h-[400px] bg-white rounded-2xl  border-8 border-yellow-400 flex flex-col items-center justify-between p-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12, delay: pokemon.id * 0.2 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
    >
      {/* Pokemon Card Header */}
      <div className="w-full flex justify-between items-center mb-2">
        <span className="text-lg font-bold text-yellow-700 drop-shadow">{pokemon.type}</span>
        <div className="flex items-center gap-2">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokeball"
            className="w-5 h-5"
          />
          <span className="text-xs font-bold text-gray-500">HP {pokemon.hp}</span>
        </div>
      </div>
      
      {/* Card Image */}
      <div className={`w-48 h-48 bg-gradient-to-br ${pokemon.bgColor} rounded-xl overflow-hidden border-4 ${pokemon.borderColor} flex items-center justify-center shadow-inner`}>
        <motion.img
          src={pokemon.image}
          alt={pokemon.name}
          className="object-contain w-40 h-40"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Card Description */}
      <div className="w-full mt-2">
        <div className="text-base font-bold text-pink-700 text-center">{pokemon.name}</div>
        <div className="text-xs text-gray-700 text-center mt-1">
          <span className="italic">{pokemon.description}</span>
        </div>
      </div>
      
      {/* Card Abilities */}
      <div className="w-full mt-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 bg-pink-50 rounded p-1.5">
          <img src={pokemon.abilities[0].icon} alt="Ability Icon" className="w-5 h-5" />
          <span className="font-semibold text-gray-800 text-sm">{pokemon.abilities[0].name}</span>
          <span className="ml-auto text-xs text-gray-500">{pokemon.abilities[0].power}</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 rounded p-1.5">
          <img src={pokemon.abilities[1].icon} alt="Ability Icon" className="w-5 h-5" />
          <span className="font-semibold text-gray-800 text-sm">{pokemon.abilities[1].name}</span>
          <span className="ml-auto text-xs text-gray-500">{pokemon.abilities[1].power}</span>
        </div>
      </div>
      
      {/* Floating Pokemon */}
      <motion.img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${100 + pokemon.id}.png`}
        alt="Floating Pokemon"
        className="absolute -top-6 -right-6 w-12 h-12 drop-shadow-lg"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 2 + (pokemon.id * 0.2),
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Main Gallery Component
const PokemonPhotoGallery = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 py-12 px-6">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-pink-600"
        style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        You in pokemon versions hehe
      </motion.h1>
      
      <motion.div 
        className="max-w-7xl mx-auto flex flex-nowrap justify-start gap-6 overflow-x-auto py-12 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ minHeight: "480px" }}
      >
        {pokemonCards.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </motion.div>
      
      {/* Navigation Button */}
      <motion.div 
        className="w-full flex justify-center mt-6 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily: 'Comic Neue, Comic Sans MS, cursive' }}
        >
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
            alt="Master Ball" 
            className="w-6 h-6" 
          />
          Continue to Special Message!
          <img 
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
            alt="Master Ball" 
            className="w-6 h-6" 
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PokemonPhotoGallery;