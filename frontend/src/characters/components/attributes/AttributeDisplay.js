import React, { useEffect, useState } from 'react'
import SymbolDisplay from '../SymbolDisplay';
import axios from 'axios';

const AttributeDisplay = ({ attribute, abilities }) => {
    const [quality, setQuality] = useState('');

    const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attribute.name);

    useEffect(() => {
    const fetchQuality = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/attributes/${attribute.id}/quality`);
        setQuality(response.data.name);
      } catch (error) {
        console.error('Error fetching quality:', error);
      }
    };
    
    fetchQuality();
  }, [attribute.id]);

    return (
        <div className='attribute-section'>
            <div className='row mb-3'>
                <div className='col-md-6 text-end'>
                    <h3 className='pt-4'>{attribute.name} </h3>
                </div>
                <div className='col-md-6 text-start'>
                    <h3 className='pt-4'><SymbolDisplay value={attribute.value + attribute.bonusValue + attribute.novaValue}/></h3>
                </div>
                <h4 className='gray-color'>{quality}</h4>
            </div>
            <ul className='list-group'>
                {attrAbilities.map((ability, index) => (
                    <li key={index} className='list-group-item'>
                        <div className='row'>
                            <div className='col-md-6 text-end'>
                                {ability.name} 
                            </div>
                            <div className='col-md-6 text-start'>
                                <SymbolDisplay value={ability.value + ability.bonusValue + ability.novaValue}/>
                            </div>
                            <div>
                                <ul className='list-group'>
                                    {ability.specialties.map((specialty, specIndex) => (
                                        <li key={specIndex} className='list-group-item bg-body-secondary'>
                                            <div className='row'>
                                                <div className='col-md-6 text-end'>
                                                    {specialty.name}
                                                </div>
                                                <div className='col-md-6 text-start'>
                                                    <SymbolDisplay value={ability.value + ability.bonusValue + ability.novaValue + 1} max={6} />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default AttributeDisplay;