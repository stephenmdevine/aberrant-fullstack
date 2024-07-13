import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function AddAttributes() {

  let navigate = useNavigate();

  const [selections, setSelections] = useState({ physical: null, mental: null, social: null });
  const [attributes, setAttributes] = useState([
    { name: "Strength", value: 1 },
    { name: "Perception", value: 1 },
    { name: "Appearance", value: 1 },
    { name: "Dexterity", value: 1 },
    { name: "Intelligence", value: 1 },
    { name: "Manipulation", value: 1 },
    { name: "Stamina", value: 1 },
    { name: "Wits", value: 1 },
    { name: "Charisma", value: 1 }
  ]);
  const categories = {
    physical: ['Strength', 'Dexterity', 'Stamina'],
    mental: ['Perception', 'Intelligence', 'Wits'],
    social: ['Appearance', 'Manipulation', 'Charisma']
  };
  
  const options = [3, 5, 7];

  const { id } = useParams();

  // const [totalPhysicalValue, setTotalPhysicalValue] = useState(0);
  // const [totalMentalValue, setTotalMentalValue] = useState(0);
  // const [totalSocialValue, setTotalSocialValue] = useState(0);

  // useEffect(() => {
  //   const sum = [0, 3, 6].reduce((acc, index) => acc + attributes[index].value, 0);
  //   setTotalPhysicalValue(sum-3);
  // }, [attributes]);
  // useEffect(() => {
  //   const sum = [1, 4, 7].reduce((acc, index) => acc + attributes[index].value, 0);
  //   setTotalMentalValue(sum-3);
  // }, [attributes]);
  // useEffect(() => {
  //   const sum = [2, 5, 8].reduce((acc, index) => acc + attributes[index].value, 0);
  //   setTotalSocialValue(sum-3);
  // }, [attributes]);

  const handleAttributeChange = (index, newValue) => {
    const newAttributes = [...attributes];
    newAttributes[index].value = newValue;
    setAttributes(newAttributes);
  };

  const handleSelect = (category, value) => {
    const newSelections = { ...selections, [category]: value };
    setSelections(newSelections);

    const newAttributes = { ...attributes };
    categories[category].forEach(attr => {
      newAttributes[attr] = { ...newAttributes[attr], additionalPoints: 0 };
    });
    setAttributes(newAttributes);
  };

  const handleInputChange = (category, attribute, value) => {
    const newValue = parseInt(value, 10) || 0;
    const newAttributes = { ...attributes };
    const sum = categories[category].reduce((acc, attr) => acc + newAttributes[attr].additionalPoints, 0) + newValue - newAttributes[attribute].additionalPoints;

    if (sum <= selections[category]) {
      newAttributes[attribute].additionalPoints = newValue;
      setAttributes(newAttributes);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedAttributes = Object.keys(attributes).map(key => ({
      name: key,
      value: attributes[key].baseValue + attributes[key].additionalPoints
    }));

    try {
      const response = await axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, { attributes: updatedAttributes });
      console.log('Update successful: ', response.data);
      alert("Attributes successfully updated");
      navigate('/');
    } catch (error) {
      console.error('Error updating attributes: ', error);
    }
  };

  return (
    <div className='container mt-5'>
    <form onSubmit={handleSubmit}>
      {Object.keys(categories).map(category => (
        <div key={category} className="mb-4">
          <div className="row mb-4">
            <div className="col">
              <label>Select Value for {category.charAt(0).toUpperCase() + category.slice(1)}</label>
              <select
                className="form-select"
                value={selections[category] || ''}
                onChange={(e) => handleSelect(category, parseInt(e.target.value))}
              >
                <option value="">Select</option>
                {options.map(option => (
                  <option
                    key={option}
                    value={option}
                    disabled={Object.values(selections).includes(option) && selections[category] !== option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selections[category] && (
            <div className="row">
              {categories[category].map(attribute => (
                <div key={attribute} className="col">
                  <label>{attribute}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={attributes[attribute].additionalPoints}
                    onChange={(e) => handleInputChange(category, attribute, e.target.value)}
                    min="0"
                    max={selections[category]}
                    disabled={!selections[category]}
                  />
                  <p>Total: {attributes[attribute].baseValue + attributes[attribute].additionalPoints}</p>
                </div>
              ))}
            </div>
          )}

          {selections[category] && (
            <div className="row mt-3">
              <div className="col">
                <p>
                  Total Points Allocated: {categories[category].reduce((acc, attr) => acc + attributes[attr].additionalPoints, 0)} / {selections[category]}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
      <button className="btn btn-outline-primary" type="submit">Save Attributes</button>
      <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
    </form>

      {/* <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
        <Container>
          <Row>
            <Col sm={4}>
            <h4>Physical</h4>
            </Col>
            <Col sm={4}>
            <h4>Mental</h4>
            </Col>
            <Col sm={4}>
            <h4>Social</h4>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
            <p>Points Spent: {totalPhysicalValue}</p>
            </Col>
            <Col sm={4}>
            <p>Points Spent: {totalMentalValue}</p>
            </Col>
            <Col sm={4}>
            <p>Points Spent: {totalSocialValue}</p>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            {attributes.map((attribute, index) => (
              <Col key={index} sm={4}>
                <div className='attribute-card'>
                  <h5>{attribute.name}</h5>
                  <input
                    className='form-control text-center'
                    type='number'
                    min={1}
                    max={5}
                    value={attribute.value}
                    onChange={(e) => handleAttributeChange(index, parseInt(e.target.value))}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        <p>Total Points Spent: {totalPhysicalValue + totalMentalValue + totalSocialValue}</p>
        <button className='btn btn-outline-primary' onClick={handleSubmit}>Save Attributes</button>
        <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
      </div> */}
    </div>
  );
}
