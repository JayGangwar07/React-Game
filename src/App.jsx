import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router'

const Game = () => {
  
  const navigate = useNavigate()
  
  // Game constants
  const GRID_SIZE = 20;
  const PLAYER_SIZE = 28;
  const MAP_WIDTH = 2000; // Extended map size
  const MAP_HEIGHT = 1500; // Extended map size
  const VIEWPORT_WIDTH = window.innerWidth;
  const VIEWPORT_HEIGHT = window.innerHeight;
  const MOVEMENT_SPEED = 5;
  
  // Game state
  const [playerPos, setPlayerPos] = useState({ x: 1409, y: 836 });
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [joystickActive, setJoystickActive] = useState(false);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const joystickBaseRef = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const maxJoystickDistance = 40;
  

  // Obstacles - walls and blocks
  const obstacles = [
    //{ x: 100, y: 100, width: 80, height: 80 },
    { x: 20, y: 608, width: 600, height: 20 },
    { x: 597, y: 634, width: 20, height: 240 },
    { x: 600, y: 876, width: 600, height: 20 },
    { x: 22, y: 748, width: 330, height: 20 },
    { x: 337, y: 769, width: 20, height: 330 },
    { x: 367, y: 1031, width: 660, height: 20 },
    { x: 1010, y: 1031, width: 20, height: 680 },
    { x: 950, y: 650, width: 20, height: 240 },
    { x: 1300, y: 525, width: 300, height: 280 },
  ];
  
  // Check collision with obstacles and map boundaries
  const checkCollision = (newX, newY) => {
    // Check map boundaries with padding
    const padding = 10;
    if (newX < padding || newX > MAP_WIDTH - PLAYER_SIZE - padding || 
        newY < padding || newY > MAP_HEIGHT - PLAYER_SIZE - padding) {
      return true;
    }
    
    // Check obstacles
    for (const obstacle of obstacles) {
      if (
        newX < obstacle.x + obstacle.width &&
        newX + PLAYER_SIZE > obstacle.x &&
        newY < obstacle.y + obstacle.height &&
        newY + PLAYER_SIZE > obstacle.y
      ) {
        return true;
      }
    }
    
    return false;
  };
  
  // Handle joystick touch start
  const handleJoystickStart = (e) => {
    e.preventDefault();
    setJoystickActive(true);
    updateJoystickPosition(e);
  };
  
  const [poke,setPoke] = useState([
    { x: 460, y: 741, width: 30, height: 30 }
    ])

  useEffect(()=>{
    for (let i=0;i<10;i++){
      poke.push({ x: Math.floor(Math.random() * (1000 - 100 + 1)) + 100, y: Math.floor(Math.random() * (1000 - 100 + 1)) + 100, width: 30, height: 30 })
  }
  console.log(poke)
  },[])
  
  function render(){
    return poke.map((obs, index) => (
      <rect
      key={index}
      x={obs.x}
      y={obs.y}
      onClick={()=>{
        navigate('/fight')
      }}
      width={obs.width}
      height={obs.height}
      rx="8"
      fill="red"
      stroke="#667"
      strokeWidth="2"
      filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))"
            />
          ))
  }
  
  // Handle joystick touch move
  const handleJoystickMove = (e) => {
    if (!joystickActive) return;
    e.preventDefault();
    updateJoystickPosition(e);
  };
  
  // Handle joystick touch end
  const handleJoystickEnd = (e) => {
    e.preventDefault();
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  };
  
  // Update joystick position
  const updateJoystickPosition = (e) => {
    if (!joystickBaseRef.current) return;
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = joystickBaseRef.current.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let x = clientX - centerX;
    let y = clientY - centerY;
    
    // Limit joystick range
    const distance = Math.sqrt(x * x + y * y);
    
    if (distance > maxJoystickDistance) {
      x = (x / distance) * maxJoystickDistance;
      y = (y / distance) * maxJoystickDistance;
    }
    
    setJoystickPos({ x, y });
  };
  
  // Update camera to always center on player
  useEffect(() => {
    setCameraOffset({
      x: Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, playerPos.x - VIEWPORT_WIDTH / 2)),
      y: Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, playerPos.y - VIEWPORT_HEIGHT / 2))
    });
  }, [playerPos]);
  
  // Game loop with useEffect to properly handle dependencies
  useEffect(() => {
    const gameLoop = (timestamp) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - previousTimeRef.current;
      previousTimeRef.current = timestamp;
      
      if (joystickActive && (joystickPos.x !== 0 || joystickPos.y !== 0)) {
        // Normalize direction vector
        const length = Math.sqrt(joystickPos.x * joystickPos.x + joystickPos.y * joystickPos.y);
        const normalizedX = joystickPos.x / length;
        const normalizedY = joystickPos.y / length;
        
        // Calculate movement with delta time for smooth motion
        const moveX = normalizedX * MOVEMENT_SPEED * (deltaTime / 16); // 16ms is roughly 60fps
        const moveY = normalizedY * MOVEMENT_SPEED * (deltaTime / 16);
        
        const newPos = {
          x: playerPos.x + moveX,
          y: playerPos.y + moveY
        };
        
        // Check for collisions
        if (!checkCollision(newPos.x, newPos.y)) {
          setPlayerPos(newPos);
        }
      }
      
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    
    requestRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [playerPos, joystickActive, joystickPos]);
  
  // Initialize camera on mount
  useEffect(() => {
    setCameraOffset({
      x: Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, playerPos.x - VIEWPORT_WIDTH / 2)),
      y: Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, playerPos.y - VIEWPORT_HEIGHT / 2))
    });
  }, []);
  
  // Draw grid lines
  const gridLines = [];
  const gridSpacing = 100;
  for (let i = 0; i < MAP_WIDTH; i += gridSpacing) {
    gridLines.push(
      <line
        key={`vertical-${i}`}
        x1={i}
        y1={0}
        x2={i}
        y2={MAP_HEIGHT}
        stroke="rgba(100, 100, 150, 0.2)"
        strokeWidth="1"
      />
    );
  }
  
  for (let i = 0; i < MAP_HEIGHT; i += gridSpacing) {
    gridLines.push(
      <line
        key={`horizontal-${i}`}
        x1={0}
        y1={i}
        x2={MAP_WIDTH}
        y2={i}
        stroke="rgba(100, 100, 150, 0.2)"
        strokeWidth="1"
      />
    );
  }
  
  return (
    <>
    <button className="text-black">Manage</button>
    <div className="h-screen w-full overflow-hidden bg-green-900 absolute top-0">
      {/* Game viewport */}
      <button
      className="w-20 h-12 bg-purple-600 z-30"
      >Manage</button>
      <div className="absolute inset-0 overflow-hidden bg-red-500">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`${cameraOffset.x} ${cameraOffset.y} ${VIEWPORT_WIDTH} ${VIEWPORT_HEIGHT}`}
          style={{ background: 'linear-gradient(to bottom, #111, #224)' }}
          preserveAspectRatio="xMidYMid meet"
        >
        <button
        className="w-20 h-12 bg-purple-600"
        >Manage</button>
        <image className="absolute top-0 z-10"
        href="src/assets/map.jpeg"/>
        {/* Grid background */}
        {/*gridLines*/}
          
        {/* Map border */}
        <rect
        x="0"
        y="0"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        fill="none"
        stroke="#334"
        strokeWidth="4"
        />
          
          {render()}
          
          {/* Obstacles */}
          {/*obstacles.map((obs, index) => (
            <rect
              key={index}
              x={obs.x}
              y={obs.y}
              width={obs.width}
              height={obs.height}
              rx="8"
              fill="#455"
              stroke="#667"
              strokeWidth="2"
              filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.3))"
            />
          ))*/}
          
          {/* Player */}
          <img 
          src="./assets/react.svg"
          className="h-12 w-12"
          />

          <g transform={`translate(${playerPos.x}, ${playerPos.y})`}>
            {/*<rect
            width={PLAYER_SIZE}
            height={PLAYER_SIZE}
            rx="6"
            fill="./assets/react.svg"
            stroke="#2E7D32"
            strokeWidth="2"
            filter="drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))"
            />*/}
            <image
            href="src/assets/front.png"
            width={PLAYER_SIZE}
            height={PLAYER_SIZE}
            />
            {/* Player direction indicator */}
      {joystickActive && (
      <line
      x1={PLAYER_SIZE/2}
      y1={PLAYER_SIZE/2}
      x2={PLAYER_SIZE/2 + joystickPos.x * 0.8}
      y2={PLAYER_SIZE/2 + joystickPos.y * 0.8}
      stroke="rgba(255, 255, 100, 0.8)"
      strokeWidth="2"
      strokeLinecap="round"
              />
            )}
          </g>
        </svg>
      </div>
      
      {/* Joystick control */}
      <div 
        className="absolute bottom-18 left-8 w-32 h-32 bg-gray-800 bg-opacity-50 rounded-full touch-none select-none"
        ref={joystickBaseRef}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onMouseDown={handleJoystickStart}
        onMouseMove={handleJoystickMove}
        onMouseUp={handleJoystickEnd}
        onMouseLeave={handleJoystickEnd}
      >
        <div 
          className="absolute w-16 h-16 bg-blue-500 bg-opacity-80 rounded-full border-2 border-blue-600 shadow-lg"
          style={{ 
            left: `calc(50% - 32px + ${joystickPos.x}px)`,
            top: `calc(50% - 32px + ${joystickPos.y}px)`,
            transition: joystickActive ? 'none' : 'all 0.2s ease'
          }}
        />
      </div>
      
      {/* Stats display */}
      <div className="absolute top-4 right-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
        <div>Player X: {Math.floor(playerPos.x)}</div>
        <div>Player Y: {Math.floor(playerPos.y)}</div>
        <div>Camera X: {Math.floor(cameraOffset.x)}</div>
        <div>Camera Y: {Math.floor(cameraOffset.y)}</div>
        <div>Joystick: {joystickActive ? "Active" : "Inactive"}</div>
      <button
      className="w-22 h-12 bg-purple-600 rounded-2xl text-[15px]"
      onClick={()=>{
        navigate("/edit")
      }}
      >Manage<br /> Pokemons</button>
      </div>
      
      {/* Mini-map */}
      <div className="absolute bottom-18 right-8 w-32 h-32 bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
          {/* Map outline */}
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#223" stroke="#556" strokeWidth="8" />
          
          {/* Obstacles in mini-map */}
          {/*obstacles.map((obs, index) => (
            <rect
              key={index}
              x={obs.x}
              y={obs.y}
              width={obs.width}
              height={obs.height}
              fill="#667"
            />
          ))*/}
          
          {render()}
          
          <image href="src/assets/map.jpeg" className="w-full h-full" />
          
          {/* Player position */}
          <rect
          x={playerPos.x - PLAYER_SIZE/2}
          y={playerPos.y - PLAYER_SIZE/2}
          width={PLAYER_SIZE * 4}
          height={PLAYER_SIZE * 4}
          fill="red"
          className="rounded-full"
          />
          
          {/* Viewport area */}
          <rect
            x={cameraOffset.x}
            y={cameraOffset.y}
            width={VIEWPORT_WIDTH}
            height={VIEWPORT_HEIGHT}
            fill="none"
            stroke="#FFF"
            strokeWidth="6"
            strokeOpacity="0.5"
          />
        </svg>
      </div>
    </div>
    </>
  );
};

export default Game;