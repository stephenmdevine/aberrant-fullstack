import React from 'react'
import SymbolDisplay from '../SymbolDisplay';

const AttributeDisplay = ({ attrName, attrValue, abilities }) => {
    const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attrName);

    return (
        <div className='attribute-section'>
            <div className='row mb-3'>
                <div className='col-md-6 text-end'>
                    <h3>{attrName} </h3>
                </div>
                <div className='col-md-6 text-start'>
                    <h3><SymbolDisplay value={attrValue}/></h3>
                </div>
            </div>
            <ul className='list-group'>
                {attrAbilities.map((ability, index) => (
                    <li key={index} className='list-group-item'>
                        <div className='row'>
                            <div className='col-md-6 text-end'>
                                {ability.name} 
                            </div>
                            <div className='col-md-6 text-start'>
                                <SymbolDisplay value={ability.value + ability.bonusValue}/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
};

export default AttributeDisplay;