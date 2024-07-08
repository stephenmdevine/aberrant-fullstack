import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

export default function AddAbilities() {

    let navigate = useNavigate();

    const [abilities, setAbilities] = useState([
        { name: "Brawl", value: 0 },
        { name: "Might", value: 0 },
        { name: "Throwing", value: 0 },
        { name: "Archery", value: 0 },
        { name: "Athletics", value: 0 },
        { name: "Drive", value: 0 },
        { name: "Firearms", value: 0 },
        { name: "Gunnery", value: 0 },
        { name: "Heavy Weapons", value: 0 },
        { name: "Legerdemain", value: 0 },
        { name: "Martial Arts", value: 0 },
        { name: "Melee", value: 0 },
        { name: "Pilot", value: 0 },
        { name: "Ride", value: 0 },
        { name: "Stealth", value: 0 },
        { name: "Endurance", value: 0 },
        { name: "Resistance", value: 0 },
        { name: "Artillery", value: 0 },
        { name: "Awareness", value: 0 },
        { name: "Investigation", value: 0 },
        { name: "Navigation", value: 0 },
        { name: "Academics", value: 0 },
        { name: "Analysis", value: 0 },
        { name: "Bureaucracy", value: 0 },
        { name: "Computer", value: 0 },
        { name: "Demolitions", value: 0 },
        { name: "Engineering", value: 0 },
        { name: "Gambling", value: 0 },
        { name: "Intrusion", value: 0 },
        { name: "Linguistics", value: 0 },
        { name: "Medicine", value: 0 },
        { name: "Occult", value: 0 },
        { name: "Science", value: 0 },
        { name: "Survival", value: 0 },
        { name: "Tradecraft", value: 0 },
        { name: "Arts", value: 0 },
        { name: "Biz", value: 0 },
        { name: "Meditation", value: 0 },
        { name: "Rapport", value: 0 },
        { name: "Shadowing", value: 0 },
        { name: "Tactics", value: 0 },
        { name: "Weave", value: 0 },
        { name: "Disguise", value: 0 },
        { name: "Intimidation", value: 0 },
        { name: "Style", value: 0 },
        { name: "Diplomacy", value: 0 },
        { name: "Hypnosis", value: 0 },
        { name: "Interrogation", value: 0 },
        { name: "Seduction", value: 0 },
        { name: "Streetwise", value: 0 },
        { name: "Subterfuge", value: 0 },
        { name: "Animal Training", value: 0 },
        { name: "Carousing", value: 0 },
        { name: "Command", value: 0 },
        { name: "Etiquette", value: 0 },
        { name: "Instruction", value: 0 },
        { name: "Perform", value: 0 }
    ]);

    const { id } = useParams();

    const handleAbilityChange = (index, newValue) => {
      const newAbilities = [...abilities];
      newAbilities[index].value = newValue;
      setAbilities(newAbilities);
    };
  
    const handleSubmit = async () => {
      try {
        const response = await axios.put(`http://localhost:8080/allocateAbilityPoints/${id}`, { abilities });
        console.log('Update successful: ', response.data);
        alert("Abilities successfully updated");
        navigate('/');
      } catch (error) {
        console.error('Error updating abilities: ', error);
      }
    };

    return (
        <div>

        </div>
    )
}
