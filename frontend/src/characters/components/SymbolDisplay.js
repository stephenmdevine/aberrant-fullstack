import React from 'react';

const SymbolDisplay = ({ value, max = 5, box = false }) => {
  const filledSymbol = box ? '☐' : '⬤';
  const emptySymbol = box ? '☐' : '⭘';
  
  const symbols = [];

  for (let i = 0; i < max; i++) {
    symbols.push(i < value ? filledSymbol : emptySymbol);
  }

  return <span>{symbols.join(' ')}</span>;
};

export default SymbolDisplay;
