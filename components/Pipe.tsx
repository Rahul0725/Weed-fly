import React from 'react';
import { PIPE_WIDTH, GAME_HEIGHT } from '../constants';
import { PipeData } from '../types';

interface PipeProps {
  pipe: PipeData;
}

const Pipe: React.FC<PipeProps> = ({ pipe }) => {
  // Use the specific gap assigned to this pipe for dynamic difficulty
  const bottomPipeTop = pipe.topHeight + pipe.gap;
  const bottomPipeHeight = GAME_HEIGHT - bottomPipeTop;

  return (
    <>
      {/* Top Pipe */}
      <div
        style={{
          position: 'absolute',
          left: pipe.x,
          top: 0,
          width: PIPE_WIDTH,
          height: pipe.topHeight,
        }}
        className="bg-green-500 border-x-4 border-b-4 border-green-800 rounded-b-lg pointer-events-none z-10 flex flex-col justify-end"
      >
        {/* Pipe Cap */}
        <div className="w-[110%] -ml-[5%] h-6 bg-green-500 border-4 border-green-800 rounded-sm mb-0"></div>
      </div>

      {/* Bottom Pipe */}
      <div
        style={{
          position: 'absolute',
          left: pipe.x,
          top: bottomPipeTop,
          width: PIPE_WIDTH,
          height: bottomPipeHeight,
        }}
        className="bg-green-500 border-x-4 border-t-4 border-green-800 rounded-t-lg pointer-events-none z-10"
      >
        {/* Pipe Cap */}
        <div className="w-[110%] -ml-[5%] h-6 bg-green-500 border-4 border-green-800 rounded-sm mt-0"></div>
      </div>
    </>
  );
};

export default Pipe;