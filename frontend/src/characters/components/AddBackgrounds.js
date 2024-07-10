import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBackgrounds() {

    let navigate = useNavigate();
  
    const [backgrounds, setBackgrounds] = useState([
      { name: "Allies", value: 0 },
      { name: "Attunement", value: 0 },
      { name: "Backing", value: 0 },
      { name: "Cipher", value: 0 },
      { name: "Contacts", value: 0 },
      { name: "Dormancy", value: 0 },
      { name: "Equipment", value: 0 },
      { name: "Eufiber", value: 0 },
      { name: "Favors", value: 0 },
      { name: "Followers", value: 0 },
      { name: "Influence", value: 0 },
      { name: "Mentor", value: 0 },
      { name: "Node", value: 0 },
      { name: "Rank", value: 0 },
      { name: "Resources", value: 0 }
    ]);
  
    const { id } = useParams();

    const handleBackgroundChange = (index, newValue) => {
      const newBackgrounds = [...backgrounds];
      newBackgrounds[index].value = newValue;
      setBackgrounds(newBackgrounds);
    };
  
    const handleSubmit = async () => {
      try {
        const response = await axios.put(`http://localhost:8080/allocateBackgroundPoints/${id}`, { backgrounds });
        console.log('Update successful: ', response.data);
        alert("Backgrounds successfully updated");
        navigate('/');
      } catch (error) {
        console.error('Error updating backgrounds: ', error);
      }
    };

  return (
    <div>
      <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
        <Container>
          <Row>
            {backgrounds.map((background, index) => (
              <Col key={index} sm={4}>
                <div className='attribute-card'>
                  <h5>{background.name}</h5>
                  <input
                    className='form-control text-center'
                    type='number'
                    min={0}
                    max={5}
                    value={background.value}
                    onChange={(e) => handleBackgroundChange(index, parseInt(e.target.value))}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>

        <button className='btn btn-outline-primary' onClick={handleSubmit}>Save Backgrounds</button>
        <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
      </div>
    </div>
  )
}
