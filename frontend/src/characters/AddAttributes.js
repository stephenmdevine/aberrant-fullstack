import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SymbolDisplay from './components/SymbolDisplay';

const AddAttributes = () => {

  const navigate = useNavigate();

  const [selectedValues, setSelectedValues] = useState({
    Physical: null,
    Mental: null,
    Social: null,
  });

  const [attributes, setAttributes] = useState({
    Physical: { Strength: 1, Dexterity: 1, Stamina: 1 },
    Mental: { Perception: 1, Intelligence: 1, Wits: 1 },
    Social: { Appearance: 1, Manipulation: 1, Charisma: 1 },
  });

  const { id } = useParams();

  const handleDropdownChange = (category, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleAttributeChange = (category, attribute, value) => {
    setAttributes((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [attribute]: value,
      },
    }));
  };
  
  const getAvailableOptions = (currentCategory) => {
    const allValues = [3, 5, 7];
    const selected = Object.entries(selectedValues)
      .filter(([category, val]) => category !== currentCategory && val !== null)
      .map(([, val]) => val);
    return allValues.filter((val) => !selected.includes(val));
  };

  const renderDropdown = (category) => {
    const availableOptions = getAvailableOptions(category);
    return (
      <select
        className="form-select"
        value={selectedValues[category] || ''}
        onChange={(e) => handleDropdownChange(category, e.target.value ? parseInt(e.target.value) : null)}
      >
        <option value="">Select value</option>
        {availableOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const renderAttributes = (category) => {
    const totalValue = selectedValues[category] || 0;
    const remainingValue = totalValue - Object.values(attributes[category]).reduce((a, b) => a + b, 0) + 3;

    return Object.keys(attributes[category]).map((attribute) => (
      <div className='container'>
        <div className='row'>
          <div className='d-flex justify-content-center'>
            <ul className='list-group'>
              <li key={attribute} className='list-group-item'>
                <div className='row'>
                  <label className="col-md-6 text-end"><h5>{attribute}</h5></label>
                  <div className='col-md-6 text-start'>
                    <input
                      type="number"
                      className="form-control"
                      value={attributes[category][attribute]}
                      min="1"
                      max={Math.min(5, remainingValue + attributes[category][attribute])}
                      onChange={(e) => handleAttributeChange(category, attribute, parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <SymbolDisplay value={attributes[category][attribute]} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    ));
  };

  const saveAttributes = async () => {
    const formattedAttributes = Object.entries(attributes).flatMap(([category, attrs]) =>
      Object.entries(attrs).map(([name, value]) => ({ name, value }))
    );

    try {
      await axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, { attributes: formattedAttributes });
      alert('Attributes saved successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error saving attributes:', error);
      alert('Failed to save attributes.');
    }
  };

  return (
    <div className="container">
      <div className='row'>
        <div className='border rounded p-4 mt-2 shadow'>
          <div className='d-flex justify-content-center'>
            <ul className='list-group mb-3'>
              {['Physical', 'Mental', 'Social'].map((category) => (
                <li key={category} className='list-group-item'>
                  <div className='row'>
                    <div className='col-md-6 text-end'>
                      <h4>{category}</h4>
                    </div>
                    <div className='col-md-2 text-start'>
                      {renderDropdown(category)}
                    </div>
                    <div className='p-2'>
                      <div>
                        Points spent: {Object.values(attributes[category]).reduce((a, b) => a + b, 0) - 3}
                      </div>
                      <div>
                        {selectedValues[category] && renderAttributes(category)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-primary" onClick={saveAttributes}>Save Attributes</button>
          <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
        </div>
      </div>
    </div>
  );
};

export default AddAttributes;
