import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SymbolDisplay from './components/SymbolDisplay';

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
          <AttributeDisplay gameChar={gameChar} />

        </div>

      </div>

    </div>
  );
}

const AttributeDisplay = ({ gameChar }) => {
  const [attributes, setAttributes] = useState(gameChar.attributes);
  const [originalAttributes, setOriginalAttributes] = useState({});

  useEffect(() => {
    const originalAttrValues = attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
    setOriginalAttributes(originalAttrValues);
  }, [attributes]);

  const handleDecrement = async (attribute) => {
    const originalValue = originalAttributes[attribute.name];
    const newValue = attribute.value - 1;

    if (newValue < originalValue) {
      console.log("Cannot reduce below original value");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/decrementAttribute/${gameChar.id}`, { attributeName: attribute.name });
      console.log('Decrement successful:', response.data);
      setAttributes(prevAttributes => 
        prevAttributes.map(attr => 
          attr.name === attribute.name ? { ...attr, value: newValue } : attr
        )
      );
    } catch (error) {
      console.error('Error decrementing attribute:', error);
    }
  };

  const handleIncrement = async (attribute) => {
    if (attribute.value >= 5) {
      console.log('Cannot increment above 5');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8080/incrementAttribute/${gameChar.id}`, { attributeName: attribute.name });
      console.log('Increment successful:', response.data);
      setAttributes(prevAttributes => 
        prevAttributes.map(attr => 
          attr.name === attribute.name ? { ...attr, value: attr.value + 1 } : attr
        )
      );
    } catch (error) {
      console.error('Error incrementing attribute:', error);
    }
  };

  return (
    <div className='attribute-section'>
      <div className='row'>
        {attributes.map((attribute, index) => (
      <Container className='d-flex flex-column align-items-center my-4'>
        <Row className='w-100'>
          <Col className='text-center'>
              <h4>{attribute.name} </h4>
          </Col>
        </Row>
        <Row className='w-100'>
          <Col className='text-center'>
            <div className='btn-toolbar justify-content-center' role='toolbar'>
              <h4 className='me-2'><SymbolDisplay value={attribute.value} /></h4>
              <ButtonGroup>
                <Button variant='danger' onClick={() => handleDecrement(attribute)}>
                  <i className='bi bi-dash-square'></i>
                </Button>
                <Button variant='success' onClick={() => handleIncrement(attribute)}>
                  <i className='bi bi-plus-square'></i>
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </Container>
        ))}
      </div>
    </div>

  );
};

const BackgroundDisplay = ({gameChar}) => {
  const [backgrounds, setBackgrounds] = useState(gameChar.backgrounds);
  const [originalBackgrounds, setOriginalBackgrounds] = useState({});

  useEffect(() => {
    const originalBkgrValues = attributes.reduce((acc, attr) => {
      acc[attr.name] = attr.value;
      return acc;
    }, {});
    setOriginalBackgrounds(originalBkgrValues);
  }, [backgrounds]);

};
