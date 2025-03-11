import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'

const Edit = () => {
  
  const navigate = useNavigate()
  
  // State to store our Pokemon data
  const [pokemons, setPokemons] = useState([]);
  
  // Initialize data from localStorage or use default if not available
  useEffect(() => {
    const storedPokemons = localStorage.getItem('ownedPokemon');
    if (storedPokemons) {
      setPokemons(JSON.parse(storedPokemons));
    } else {
      // Default data if nothing in localStorage
      const defaultPokemons = [
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
          sprite: "src/assets/frontGreninja.png",
          image: "src/assets/greninja.png",
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
      setPokemons(defaultPokemons);
      localStorage.setItem('ownedPokemon', JSON.stringify(defaultPokemons));
    }
  }, []);

  // Function to handle Pokemon selection
  const handleSelectPokemon = (id) => {
    // Find the index of the Pokemon to be selected
    const selectedIndex = pokemons.findIndex(pokemon => pokemon.id === id);
    
    if (selectedIndex > 0) { // Only proceed if it's not already the first Pokemon
      // Create a new array with the selected Pokemon first, followed by others
      const updatedPokemons = [
        pokemons[selectedIndex],
        ...pokemons.slice(0, selectedIndex),
        ...pokemons.slice(selectedIndex + 1)
      ];
      
      // Update state and localStorage
      setPokemons(updatedPokemons);
      localStorage.setItem('ownedPokemon', JSON.stringify(updatedPokemons));
      
      // Display confirmation for testing
      console.log('Pokemon order updated in localStorage:', updatedPokemons.map(p => p.name).join(', '));
    }
  };

  // Only render when we have Pokemon data
  if (pokemons.length === 0) {
    return <div className="p-6 text-center">Loading Pokémon data...</div>;
  }

  // Separate the first Pokemon from the rest
  const featuredPokemon = pokemons[0];
  const otherPokemons = pokemons.slice(1);

  // Helper function to get background color based on Pokemon type/name
  const getPokemonTheme = (name) => {
    switch(name.toLowerCase()) {
      case 'pikachu': return 'yellow';
      case 'greninja': return 'blue';
      case 'mewtwo': return 'purple';
      default: return 'gray';
    }
  };

  const featuredTheme = getPokemonTheme(featuredPokemon.name);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 min-h-screen">
    <button
    className="w-20 h-12 rounded-xl bg-red-600"
    onClick={()=>{
      navigate("/main")
    }}
    >🔙Back</button>
      <h1 className="text-3xl font-bold text-center mb-8">Pokémon Collection</h1>
      
      {/* Featured Pokemon */}
      <div className={`bg-${featuredTheme}-100 rounded-lg shadow-lg p-6 mb-8`}>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
            <img 
              src={featuredPokemon.image} 
              alt={featuredPokemon.name}
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="md:w-2/3 md:pl-8">
            <div className="flex items-center mb-4">
              <h2 className={`text-4xl font-bold text-${featuredTheme}-600`}>{featuredPokemon.name}</h2>
              <span className={`ml-4 bg-${featuredTheme}-500 text-white px-3 py-1 rounded-full text-sm`}>
                Lv. {featuredPokemon.level}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-3">Attacks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredPokemon.attacks.map((attack, index) => (
                  <div key={index} className="flex justify-between bg-white p-3 rounded-lg shadow">
                    <span className="font-medium">{attack[0]}</span>
                    <span className={`font-bold text-${featuredTheme}-600`}>{attack[1]} PWR</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className={`bg-${featuredTheme}-500 hover:bg-${featuredTheme}-600 text-white px-4 py-2 rounded-lg transition`}>
                View Details
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                Train Pokémon
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display current localStorage status */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Current Pokémon Order in Storage:</h3>
        <div className="flex flex-wrap gap-2">
          {pokemons.map((pokemon, index) => (
            <div 
              key={pokemon.id} 
              className={`px-3 py-1 rounded-full text-white bg-${getPokemonTheme(pokemon.name)}-500`}
            >
              {index + 1}. {pokemon.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Pokemons (Smaller Cards) */}
      <h2 className="text-2xl font-bold mb-4">Other Pokémon</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {otherPokemons.map(pokemon => {
          const theme = getPokemonTheme(pokemon.name);
          return (
            <div key={pokemon.id} className={`bg-${theme}-100 rounded-lg shadow-md p-4`}>
              <div className="flex items-start">
                <div className="w-1/3 flex justify-center">
                  <img 
                    src={pokemon.image} 
                    alt={pokemon.name}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="w-2/3 pl-4">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{pokemon.name}</h3>
                    <span className="ml-2 bg-gray-600 text-white px-2 py-0.5 rounded-full text-xs">
                      Lv. {pokemon.level}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold mb-1">Top Attacks:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {pokemon.attacks.slice(0, 2).map((attack, index) => (
                        <div key={index} className="flex justify-between bg-white p-1 rounded text-xs">
                          <span>{attack[0]}</span>
                          <span className="font-medium">{attack[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSelectPokemon(pokemon.id)}
                    className={`bg-${theme}-500 hover:bg-${theme}-600 text-white px-3 py-1 rounded text-sm transition`}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Edit;