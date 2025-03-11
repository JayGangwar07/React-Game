import React, { useState, useEffect } from 'react';
import sound from '../assets/sound.mp3';
import death from '../assets/death.mp3';
import { useNavigate } from 'react-router'

function Fight() {
  
  const navigate = useNavigate()
  
  const [buttonClicked, setButtonClicked] = useState(false)
  const [name, setName] = useState('Name');
  const [bar, setBar] = useState(false);
  const [health, setHealth] = useState("368");
  const [opponent, setOpponent] = useState("Opponent");
  const [oppHealth, setOppHealth] = useState("368");
  const [attacks, setAttacks] = useState([]);
  const [level, setLevel] = useState("1");
  const [oppLevel, setOppLevel] = useState("1");
  const [oppImg, setOppImg] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRVYuquh3PRF9m5cMxI9eTAGFBPZfLPokXvlsaM0zhVj6GP2XAVpJmnB0&s=10"
  );
  const [playerImg, setPlayerImg] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRVYuquh3PRF9m5cMxI9eTAGFBPZfLPokXvlsaM0zhVj6GP2XAVpJmnB0&s=10"
  );
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(2);

  function menu() {
    if (health>0){
      setClicked((prev) => !prev);
    }
  }

  const list = [
  {
    id: 1,
    name: "Pikachu",
    level: Math.floor(Math.random() * 9) + 1,
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
    level: Math.floor(Math.random() * 9) + 1,
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
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/mewtwo.png",
    image: "src/assets/frontMewtwo.png",
    attacks: [
      ["Psychic", 90],
      ["Shadow Ball", 80],
      ["Aura Sphere", 80],
      ["Psystrike", 100]
    ],
  },
  {
    id: 4,
    name: "Blastoise",
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/blastoise.png",
    image: "src/assets/frontBlastoise.png",
    attacks: [
      ["Hydro Pump", 110],
      ["Ice Beam", 90],
      ["Bite", 60],
      ["Skull Bash", 100]
    ],
  },
  {
    id: 5,
    name: "Charizard",
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/charizard.png",
    image: "src/assets/frontCharizard.png",
    attacks: [
      ["Flamethrower", 90],
      ["Dragon Claw", 80],
      ["Air Slash", 75],
      ["Heat Wave", 95]
    ],
  },
  {
    id: 6,
    name: "Infernape",
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/infernape.png",
    image: "src/assets/frontInfernape.png",
    attacks: [
      ["Flare Blitz", 120],
      ["Close Combat", 90],
      ["Mach Punch", 90],
      ["Thunder Punch", 75]
    ],
  },
  {
    id: 7,
    name: "Dragonite",
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/dragonite.png",
    image: "src/assets/frontDragonite.png",
    attacks: [
      ["Dragon Claw", 80],
      ["Hurricane", 110],
      ["Thunder Punch", 75],
      ["Extreme Speed", 80]
    ],
  }
];


  useEffect(()=>{
    if (health<=0){
      console.log("You Lose")
    }
  },[health])

  const poke = [{
    id: 4,
    name: "Blastoise",
    level: Math.floor(Math.random() * 9) + 1,
    sprite: "src/assets/blastoise.png",
    image: "src/assets/frontBlastoise.png",
    attacks: [
      ["Hydro Pump", 110],
      ["Ice Beam", 90],
      ["Bite", 60],
      ["Skull Bash", 100]
    ],
  }]
    
  //localStorage.setItem("ownedPokemon",JSON.stringify(poke))

  let owned = JSON.parse(localStorage.getItem("ownedPokemon")) || [];

  function checkDamage(att) {
    let bonus = owned[0].level * 2 - 2;
    let damage = att + bonus;
    if (count % 2 === 0) {
      setOppHealth((prevHealth) => prevHealth - damage);
      setClicked(false);
      setCount(count + 1);
      //new Audio(sound).play();
    }
  }

  useEffect(() => {
    if (count % 2 === 1 && oppHealth > 0) {
      let min = 1;
      let max = 2;
      let choice = Math.floor(Math.random() * (max - min + 1)) + min;

      const item = list.find((obj) => obj.id === choice);

      setTimeout(() => {
        if (oppHealth > 0) {
          let bonus = owned[0].level * 2 - 2;
          let att = item.attacks[Math.floor(Math.random() * 4)][1]; // Fixed index calculation
          let damage = att + bonus;

          setHealth((prevHealth) => prevHealth - damage);
          setCount((prevCount) => prevCount + 1);

          //new Audio(death).play();
          setBar(true);
          setTimeout(()=>setBar(false),400)
        }
      }, 2000);
    }
  }, [count, oppHealth]);

  useEffect(() => {
    //alert("DECREASE SOUND!!!")
    setName(owned[0].name);
    setPlayerImg(owned[0].sprite);
    setAttacks(owned[0].attacks);
    setLevel(owned[0].level);
  }, []);

  useEffect(() => {
    
    let min = 1;
    let max = 7;
    let choice = Math.floor(Math.random() * (max - min + 1)) + min;

    const item = list.find((obj) => obj.id === choice);
    setOpponent(item.name);
    setOppImg(item.image);
    setOppLevel(item.level);
  }, []);

  return (
    <div className="overflow-hidden select-none">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ9a6zHO177URg74eZodDDI-0Ks0uq7Lj8PekMaOoEj2bQEwOe7pvQSB8b&s=10" />
      
      <div className="w-20 h-20 rounded-xl absolute top-10 left-4 bg-amber-300
      text-center text-black">Reload If Image Not Visible</div>
      
      {/* Player Circle */}
      <div className="w-38 h-38 rounded-full bg-[#7DB386] absolute bottom-8 left-1 rotate-x-45">
        <img src={playerImg} />
      </div>
      
      <div className="w-44 h-22 bg-gray-600 absolute bottom-8 right-3 border-2 border-black rounded-2xl px-3 py-2 text-white">
        {name}.............LV.{level}
        <div className="block w-35 rounded-full text-white">
          <progress max="368" min="0" value={health} className={bar ? "animate-ping w-full" : "w-full"}>
            70
          </progress>
          <span>{health}/368</span>
          <button className="absolute right-4 w-18 h-6 bg-amber-400 rounded-2xl
          text-red-600 font-bold" onClick={menu}>
            Attacks
          </button>
        </div>
      </div>
      
      <div className="h-64 w-48 bg-blue-600 absolute right-4 bottom-40 z-20 grid grid-cols-1 py-4 px-4 rounded-3xl overflow-y-auto" style={{ opacity: clicked ? "100" : 0 }}>
        {attacks.map((attack, index) => (
          <div key={index} className="w-[98%] h-12 bg-red-700 rounded-2xl text-xl text-white flex justify-between items-center px-2 my-1 select-none" onClick={() => checkDamage(attack[1])}>
            <span>{attack[0]}</span>
            <span>{attack[1]}</span>
          </div>
        ))}
      </div>

      {/* Opponent Circle */}
      <div className="w-35 h-35 rounded-full bg-[#7DB386] absolute top-80 right-8 rotate-x-45 z-10">
        <img src={oppImg} />
      </div>
      
      <div className="w-44 h-22 bg-gray-600 absolute top-75 left-3 border-2 border-black rounded-2xl px-3 py-2 text-white">
        {opponent}............LV.{oppLevel}
        <div className="block w-35 rounded-full text-white">
          <progress max="368" min="0" value={oppHealth} className="w-full">
            70
          </progress>
          <span>{oppHealth > 0 ? oppHealth : 0}/368</span>
        </div>
        <button
        className={oppHealth<0?
        "w-32 h-12 rounded-2xl bg-purple-700 absolute top-22 inline px-1":"opacity-0"}
        onClick={() => {
  setButtonClicked(true);
  setTimeout(() => setButtonClicked(false), 1000);

  // Find the opponent in the list
  let opponentData = list.find((obj) => obj.name === opponent);

  if (!opponentData) return; // Safety check

  let newPokemon = {
    id: Math.random(),
    name: opponent,
    level: oppLevel, // Fix: Use opponent's actual level
    sprite: opponentData.sprite,
    image: oppImg,
    attacks: opponentData.attacks, // Fix: Use opponent's attacks
  };

  let data = [...owned, newPokemon];

  localStorage.setItem("ownedPokemon", JSON.stringify(data));
  setTimeout(()=>{navigate('/main')},1000)
}}

        >
        <span className="absolute left-6 top-3 text-xl">Catch</span>
        <img 
        src={!buttonClicked?"src/assets/pokeball.png":"src/assets/throw.gif"} 
        className="w-[30px] h-[33px] absolute right-2 top-2"
        />
        </button>
      </div>
    </div>
  );
}

export default Fight;
