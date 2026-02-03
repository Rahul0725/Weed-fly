import React from 'react';
import GameCanvas from './components/GameCanvas';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900">
      <GameCanvas />
    </div>
  );
};

export default App;