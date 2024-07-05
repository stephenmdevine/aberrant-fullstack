import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

export default function AddAttributes() {

  const [attributes, setAttributes] = useState([
    { name: "Strength", value: 1 },
    { name: "Dexterity", value: 1 },
    { name: "Stamina", value: 1 },
    { name: "Perception", value: 1 },
    { name: "Intelligence", value: 1 },
    { name: "Wits", value: 1 },
    { name: "Appearance", value: 1 },
    { name: "Manipulation", value: 1 },
    { name: "Charisma", value: 1 }
  ]);

  const { id } = useParams();

  const handleAttributeChange = (index, newValue) => {
    const newAttributes = [...attributes];
    newAttributes[index].value = newValue;
    setAttributes(newAttributes);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, { attributes });
      console.log('Update successful: ', response.data);
    } catch (error) {
      console.error('Error updating attributes: ', error);
    }
  };

  return (
    <div>
      {attributes.map((attribute, index) => (
        <div key={attribute.name}>
          <label>{attribute.name}</label>
          <input
            type="number"
            value={attribute.value}
            onChange={(e) => handleAttributeChange(index, parseInt(e.target.value))}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Update Attributes</button>
    </div>
  );
}
