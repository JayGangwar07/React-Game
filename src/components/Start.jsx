import React, { useState } from 'react';
import { useNavigate } from 'react-router'

const Start = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [result, setResult] = useState('');
  
  const pokemons = [
    {
      id: 1,
      name: "Pikachu",
      level: 1,
      sprite: "src/assets/backPikachu.png",
      image: "src/assets/pikachu.png",
      attacks: [
        ["Thunderbolt", 90],
        ["Quick Attack", 70],
        ["Iron Tail", 75],
        ["Electro Ball", 80]
      ],
    },
    {
      id: 2,
      name: "Greninja",
      level: 1,
      sprite: "src/assets/greninja.png",
      image: "src/assets/frontGreninja.png",
      attacks: [
        ["Water Shuriken", 60],
        ["Night Slash", 70],
        ["Hydro Pump", 110],
        ["Aerial Ace", 60]
      ],
    },
    {
      id: 3,
      name: "Mewtwo",
      level: 1,
      sprite: "src/assets/mewtwo.png",
      image: "src/assets/frontMewtwo.png",
      attacks: [
        ["Psychic", 90],
        ["Shadow Ball", 80],
        ["Aura Sphere", 80],
        ["Psystrike", 100]
      ],
    },
  ];
  
  const navigate = useNavigate()
  
  const handleSelectPokemon = (pokemon) => {
    setSelectedPokemon(pokemon);
  };
  
  const handleChoose = () => {
    if (!selectedPokemon) {
      setResult('No Pokémon selected. Please select a Pokémon.');
      return;
    }
    
    setResult(`You chose ${selectedPokemon.name}! Registering ${selectedPokemon.name}.`);
    
    const selected = [{
        id: Date.now(),  // Unique ID
        name: selectedPokemon.name,
        level: 1,
        sprite: selectedPokemon.sprite,
        image: selectedPokemon.image,
        attacks: selectedPokemon.attacks
    }];

    // Retrieve existing data
    let owned = localStorage.getItem("ownedPokemon");
    let newData = owned ? JSON.parse(owned) : [];  // Ensure it's an array

    let final = [...newData, ...selected];

    console.log(final);
    
    localStorage.setItem("ownedPokemon", JSON.stringify(final));
    navigate("/main")
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-red-600 rounded-lg overflow-hidden shadow-2xl relative">
        <div className="h-16 flex items-center px-6 border-b-4 border-red-800">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full border-4 border-white flex items-center justify-center mr-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full border border-red-800"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full border border-green-600"></div>
            </div>
          </div>
          <div className="text-white text-2xl font-bold ml-auto">POKÉDEX</div>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-red-700 p-4">
            <div className="bg-black rounded-lg p-4 mb-4">
              <h2 className="text-green-400 font-mono text-lg mb-4">SELECT POKÉMON:</h2>
              
              <div className="flex overflow-x-auto pb-4 space-x-4">
                {pokemons.map((pokemon) => (
                  <div 
                    key={pokemon.id}
                    className={`flex-shrink-0 cursor-pointer transition-all ${
                      selectedPokemon === pokemon ? 'ring-4 ring-yellow-400' : ''
                    }`}
                    onClick={() => handleSelectPokemon(pokemon)}
                  >
                    <div className="w-24 h-32 bg-gray-800 rounded border border-gray-600 flex flex-col items-center justify-center p-1">
                      <div className="bg-gray-700 rounded w-full h-20 flex items-center justify-center mb-2">
                        <img 
                          src={pokemon.image} 
                          alt={pokemon.name} 
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <p className="text-white text-xs font-mono">#{pokemon.id}</p>
                      <p className="text-white text-sm font-mono truncate w-full text-center">{pokemon.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleChoose}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-mono rounded border-b-2 border-green-800 transition-colors"
              >
                CHOOSE
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 bg-red-600 p-4">
            <div className="bg-green-100 rounded-lg p-4 h-64 border-4 border-gray-800">
              {selectedPokemon ? (
                <div className="h-full flex flex-col">
                  <div className="flex mb-2">
                    <div className="w-1/2">
                      <h3 className="text-black font-mono text-lg">{selectedPokemon.name}</h3>
                      <p className="text-gray-700 font-mono text-xs">Level: {selectedPokemon.level}</p>
                    </div>
                    <div className="w-1/2 flex items-center justify-center">
                      <div className="bg-green-200 rounded-full p-4">
                        <img 
                          src={selectedPokemon.image} 
                          alt={selectedPokemon.name} 
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {result && (
                    <div className="mt-auto">
                      <p className="text-black font-mono text-sm border-t border-gray-400 pt-2">{result}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center flex-col">
                  <p className="text-gray-700 font-mono text-center">No Pokémon selected</p>
                  <p className="text-gray-500 font-mono text-xs text-center mt-2">Select a Pokémon to view details</p>

                  {result && (
                    <div className="mt-4 w-full bg-red-100 p-2 rounded">
                      <p className="text-red-700 font-mono text-sm">{result}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-8 bg-red-700 border-t-4 border-red-800"></div>
      </div>
    </div>
  );
};

export default Start;
