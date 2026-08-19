import React from 'react';
import { TopologicaCanvas } from './src/components/TopologicaCanvas';

const App: React.FC = () => {
  return (
    <div className="w-full h-full overflow-hidden bg-black">
      <TopologicaCanvas />
    </div>
  );
};

export default App;