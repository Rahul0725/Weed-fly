import React from 'react';
import { BIRD_SIZE } from '../constants';

interface BirdProps {
  y: number;
  velocity: number;
}

const Bird: React.FC<BirdProps> = ({ y, velocity }) => {
  // Simpler rotation logic for snappier feel
  const rotation = Math.min(Math.max(velocity * 4, -25), 90);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50px', // Bird fixed x position relative to canvas
        top: y,
        width: BIRD_SIZE,
        height: BIRD_SIZE,
        transform: `rotate(${rotation}deg)`,
        // Removed transition for instant response
      }}
      className="z-20 pointer-events-none"
    >
      <div className="w-full h-full bg-yellow-400 rounded-lg relative border-2 border-black shadow-sm overflow-hidden">
        {/* Eye */}
        <div className="absolute top-1 right-2 w-3 h-3 bg-white rounded-full border border-black">
          <div className="absolute top-1 right-0.5 w-1 h-1 bg-black rounded-full"></div>
        </div>
        {/* Beak */}
        <div className="absolute top-4 -right-1 w-4 h-3 bg-orange-500 rounded-sm border border-black"></div>
        {/* Wing */}
        <div className="absolute top-4 left-1 w-4 h-3 bg-white opacity-50 rounded-full"></div>
      </div>
    </div>
  );
};

export default Bird;