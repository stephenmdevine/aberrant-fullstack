import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
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
    <div className='container'>
      <div className='row'>
        <div className='col-md-12 border rounded p-4 mt-2 shadow'>
          <Container>
            <h2 className='text-center m-4'>{gameChar.name}: Spend Bonus Points</h2>
          </Container>
          <Container>

            <Row>
              <Col sm={4}>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'></li>

                </ul>
              </Col>
            </Row>
          </Container>

        </div>

      </div>
        
    </div>
  );
}

const AttributeDisplay = ({ gameChar }) => {
  const attributes = gameChar.attributes;
  const attrValues = attributes.map(({ name, value }) => ({ [name]: value }));
  // const attrAbilities = gameChar.abilities.filter(ability => ability.associatedAttribute === attrName);

  return (
      <div className='attribute-section'>
      <div className='row mb-3'>
        {attributes.map((attribute, index) => (
          <div>
            <div className='col-md-6 text-end'>
              <h3>{attrName} </h3>
            </div>
            <div className='col-md-6 text-start'>
              <button className='btn btn-danger'>
                <span className='bi bi-dash-square'></span>
              </button>
              <h3><SymbolDisplay value={attrValue} /></h3>
              <button className='btn btn-success'>
                <span className='bi bi-plus-square'></span>
              </button>
            </div>
          </div>
            ))}
          </div>
          <ul className='list-group'>
              {attrAbilities.map((ability, index) => (
                  <li key={index} className='list-group-item'>
                      <div className='row'>
                          <div className='col-md-6 text-end'>
                              {ability.name} 
                          </div>
                          <div className='col-md-6 text-start'>
                              <SymbolDisplay value={ability.value}/>
                          </div>
                      </div>
                  </li>
              ))}
          </ul>
      </div>

  );
};
