import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

export default function BonusPoints() {

    const [gameChar, setGameChar] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        loadGameChar();
    }, []);

    const loadGameChar = async () => {
        const result = await axios.get(`http://localhost:8080/character/${id}`);
        setGameChar(result.data);
    };

    if (!gameChar) {
      return <div>Loading...</div>;
    }

    const attributes = gameChar.attributes;
    const abilities = gameChar.abilities;
    const backgrounds = gameChar.backgrounds;
    const willpower = gameChar.willpower;
    const quantum = gameChar.quantum;
    const initiative = gameChar.initiative;
    const flaws = gameChar.flaws;
    const merits = gameChar.merits;

  return (
    <div>
        
    </div>
  )
}
