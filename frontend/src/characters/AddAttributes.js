import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

export default function AddAttributes() {

  let navigate = useNavigate();

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

  const { id } = useParams();

  const [totalPhysicalValue, setTotalPhysicalValue] = useState(0);
  const [totalMentalValue, setTotalMentalValue] = useState(0);
  const [totalSocialValue, setTotalSocialValue] = useState(0);

  useEffect(() => {
    const sum = [0, 3, 6].reduce((acc, index) => acc + attributes[index].value, 0);
    setTotalPhysicalValue(sum-3);
  }, [attributes]);
  useEffect(() => {
    const sum = [1, 4, 7].reduce((acc, index) => acc + attributes[index].value, 0);
    setTotalMentalValue(sum-3);
  }, [attributes]);
  useEffect(() => {
    const sum = [2, 5, 8].reduce((acc, index) => acc + attributes[index].value, 0);
    setTotalSocialValue(sum-3);
  }, [attributes]);

  const handleAttributeChange = (index, newValue) => {
    const newAttributes = [...attributes];
    newAttributes[index].value = newValue;
    setAttributes(newAttributes);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, { attributes });
      console.log('Update successful: ', response.data);
      alert("Attributes successfully updated");
      navigate('/');
    } catch (error) {
      console.error('Error updating attributes: ', error);
    }
  };

  return (
    <div>
      <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
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
      </div>
    </div>
  );
}
