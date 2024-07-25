import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SymbolDisplay from './components/SymbolDisplay';

const BonusPoints = () => {
  const [attributes, setAttributes] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [gameChar, setGameChar] = useState({});
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name: '', value: 0 });
  const [selectedAbilityId, setSelectedAbilityId] = useState(null);
  const [bonusPoints, setBonusPoints] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Function to get attribute value by name
  const getAttributeValue = (attributeName) => {
    const attribute = gameChar.attributes.find(attr => attr.name === attributeName);
    return attribute ? attribute.value : 0; // Return 0 if the attribute is not found
  };
  
  // Calculate initiative
  const dexterityValue = getAttributeValue('Dexterity');
  const witsValue = getAttributeValue('Wits');
  const initiative = dexterityValue + witsValue + gameChar.initiativeBonus;

  useEffect(() => {
    loadGameChar();
  }, []);

  const loadGameChar = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/character/${id}`);
      setGameChar(result.data);
      setAttributes(result.data.attributes);
      setAbilities(result.data.abilities);
      setBackgrounds(result.data.backgrounds);
      setBonusPoints(result.data.bonusPoints);
    } catch (error) {
      console.error('Error loading character:', error);
    }
  };

  if (!gameChar) {
    return <div>Loading...</div>;
  }

  const handleSpecialtyModalShow = (abilityId) => {
    if (bonusPoints > 0) {
      setSelectedAbilityId(abilityId);
      setShowSpecialtyModal(true);
    } else {
      alert('You do not have enough bonus points to add a new specialty.');
    }
  };

  const handleSpecialtyModalClose = () => {
    setShowSpecialtyModal(false);
    setNewSpecialty({ name: '', value: 0 });
    setSelectedAbilityId(null);
  };

  const handleSpecialtyInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecialty({ ...newSpecialty, [name]: value });
  };

  const handleAttrIncrement = (index) => {

    const attribute = attributes[index];
    const totalValue = attribute.value + attribute.bonusValue;

    if (totalValue < 5 && bonusPoints >= 5) {
      const newAttributes = [...attributes];
      newAttributes[index].bonusValue += 1;
      setAttributes(newAttributes);
      setBonusPoints(bonusPoints - 5);
    }
  };

  const handleAbilIncrement = (index) => {

    const ability = abilities[index];
    const totalValue = ability.value + ability.bonusValue;

    if (totalValue < 5 && bonusPoints >= 2) {
      const newAbilities = [...abilities];
      newAbilities[index].bonusValue += 1;
      setAbilities(newAbilities);
      setBonusPoints(bonusPoints - 2);
    }
  };

  const handleBkgrIncrement = (index) => {

    const background = backgrounds[index];
    const totalValue = background.value + background.bonusValue;

    if (totalValue < 5 && bonusPoints >= 1) {
      const newBackgrounds = [...backgrounds];
      newBackgrounds[index].bonusValue += 1;
      setBackgrounds(newBackgrounds);
      setBonusPoints(bonusPoints - 1);
    }
  };

  const handleWillIncrement = () => {
    const totalValue = gameChar.willpowerBonus + 3;
    if (totalValue < 10 && bonusPoints >= 2) {
      setGameChar(prevChar => ({
        ...prevChar,
        willpowerBonus: prevChar.willpowerBonus + 1
      }));
      setBonusPoints(bonusPoints - 2);
    }
  };

  const handleQuantIncrement = () => {
    const totalValue = gameChar.quantumBonus + 1;
    if (totalValue < 10 && bonusPoints >= 7) {
      setGameChar(prevChar => ({
        ...prevChar,
        quantumBonus: prevChar.quantumBonus + 1
      }));
      setBonusPoints(bonusPoints - 7);
    }
  };

  const handleInitIncrement = () => {
    if (bonusPoints >= 1) {
      setGameChar(prevChar => ({
        ...prevChar,
        initiativeBonus: prevChar.initiativeBonus + 1
      }));
      setBonusPoints(bonusPoints - 1);
    }
  };

  const handleAttrDecrement = (index) => {
    const attribute = attributes[index];

    if (attribute.bonusValue > 0) {
      const newAttributes = [...attributes];
      newAttributes[index].bonusValue -= 1;
      setAttributes(newAttributes);
      setBonusPoints(bonusPoints + 5);
    }
  };

  const handleAbilDecrement = (index) => {
    const ability = abilities[index];

    if (ability.bonusValue > 0) {
      const newAbilities = [...abilities];
      newAbilities[index].bonusValue -= 1;
      setAbilities(newAbilities);
      setBonusPoints(bonusPoints + 2);
    }
  };

  const handleBkgrDecrement = (index) => {
    const background = backgrounds[index];

    if (background.bonusValue > 0) {
      const newBackgrounds = [...backgrounds];
      newBackgrounds[index].bonusValue -= 1;
      setBackgrounds(newBackgrounds);
      setBonusPoints(bonusPoints + 1);
    }
  };

  const handleWillDecrement = () => {
    if (gameChar.willpowerBonus > 0) {
      setGameChar(prevChar => ({
        ...prevChar,
        willpowerBonus: prevChar.willpowerBonus - 1
      }));
      setBonusPoints(bonusPoints + 2);
    }
  };

  const handleQuantDecrement = () => {
    if (gameChar.quantumBonus > 0) {
      setGameChar(prevChar => ({
        ...prevChar,
        quantumBonus: prevChar.quantumBonus - 1
      }));
      setBonusPoints(bonusPoints + 7);
    }
  };

  const handleInitDecrement = () => {
    if (gameChar.initiativeBonus > 0) {
      setGameChar(prevChar => ({
        ...prevChar,
        initiativeBonus: prevChar.initiativeBonus - 1
      }));
      setBonusPoints(bonusPoints + 1);
    }
  };

  const handleSpecialtySubmit = async () => {
    if (selectedAbilityId) {
      try {
        const response = await axios.post(`http://localhost:8080/api/specialties/ability/${selectedAbilityId}`, newSpecialty);
        setAbilities((prevAbilities) =>
          prevAbilities.map((ability) =>
            ability.id === selectedAbilityId ? { ...ability, specialties: [...ability.specialties, response.data] } : ability
          )
        );
        setBonusPoints(bonusPoints - 1);
        handleSpecialtyModalClose();
      } catch (error) {
        console.error('Error adding specialty:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const attributeDTOs = attributes.map(attribute => ({
      name: attribute.name,
      value: attribute.value
    }));

    try {
      await axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, {
        attributes: attributeDTOs,
        bonusPoints: bonusPoints
      });
      alert("Attributes successfully updated");
      navigate('/');
    } catch (error) {
      console.error('Error updating attributes:', error);
    }
  };

  const handleSpecialtyDelete = async (specialtyId, abilityId) => {
    try {
      await axios.delete(`http://localhost:8080/api/specialties/${specialtyId}`);
      setAbilities((prevAbilities) =>
        prevAbilities.map((ability) =>
          ability.id === abilityId ? { ...ability, specialties: ability.specialties.filter(specialty => specialty.id !== specialtyId) } : ability
        )
      );
      setBonusPoints(bonusPoints + 1);
    } catch (error) {
      console.error('Error deleting specialty:', error);
    }
  };

  return (
    <Container>
      <h1 className="text-center my-4">{gameChar.novaName}'s Attributes & Abilities</h1>
      <h3>Bonus Points: {bonusPoints}</h3>
      <form onSubmit={handleSubmit}>
        <div className="attribute-section">
          <div className="row">
            {attributes.map((attribute, attrIndex) => {
              const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attribute.name);
              return (
                <Container key={attribute.name} className="d-flex flex-column align-items-center my-4">
                  <Row className="w-100">
                    <Col className="text-center">
                      <h4>{attribute.name}</h4>
                    </Col>
                  </Row>
                  <Row className="w-100">
                    <Col className="text-center">
                      <div className="btn-toolbar justify-content-center" role="toolbar">
                        <h4 className='me-2'><SymbolDisplay value={attribute.value + attribute.bonusValue} /></h4>
                        <ButtonGroup>
                          <Button variant="danger" onClick={() => handleAttrDecrement(attrIndex)}>
                            <i className="bi bi-dash-square"></i>
                          </Button>
                          <Button variant="primary" onClick={() => handleAttrIncrement(attrIndex)}>
                            <i className="bi bi-plus-square"></i>
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Col>
                    <Row>
                      <Col className="text-center">
                        <ul className='list-group'>
                          {attrAbilities.map((ability, abilIndex) => (
                            <li key={abilIndex} className='list-group-item'>
                              <div className='row'>
                                <div className='col-md-6 text-end'>
                                  {ability.name}
                                </div>
                                <div className='col-md-6 text-start'>
                                  <span className='me-2'>
                                    <SymbolDisplay value={ability.value + ability.bonusValue} />
                                  </span>
                                  <ButtonGroup>
                                    <Button variant="danger" size='sm' onClick={() => handleAbilDecrement(abilIndex)}>
                                      <i className="bi bi-dash-square"></i>
                                    </Button>
                                    <Button variant="primary" size='sm' onClick={() => handleAbilIncrement(abilIndex)}>
                                      <i className="bi bi-plus-square"></i>
                                    </Button>
                                  </ButtonGroup>
                                </div>
                              </div>

                              <div>
                                <ul className='list-group'>
                                  {ability.specialties.map((specialty, specIndex) => (
                                    <li key={specIndex} className='list-group-item'>
                                      <div>
                                        <span>{specialty.name} <SymbolDisplay value={ability.value + 1} max={6} /></span>
                                        <Button
                                          className='ms-2'
                                          variant="danger"
                                          size="sm"
                                          onClick={() => handleSpecialtyDelete(specialty.id, ability.id)}
                                        >
                                          x
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                {ability.specialties.length < 3 && (
                                  <Button variant="primary" size="sm" onClick={() => handleSpecialtyModalShow(ability.id)}>Add Specialty</Button>
                                )}
                              </div>

                            </li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </Row>
                  <Modal show={showSpecialtyModal} onHide={handleSpecialtyModalClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Add New Specialty</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type='text'
                            name='name'
                            value={newSpecialty.name}
                            onChange={handleSpecialtyInputChange}
                          />
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant='secondary' onClick={handleSpecialtyModalClose}>
                        Close
                      </Button>
                      <Button variant='primary' onClick={handleSpecialtySubmit}>
                        Add Specialty
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Container>
              );
            })}
          </div>
        </div>

        <div className="background-section">
          <h1 className="text-center my-4">{gameChar.novaName}'s Backgrounds</h1>
          <h3>Bonus Points: {bonusPoints}</h3>
          <div className="row">
            <ul className='list-group'>
              {backgrounds.map((background, bkgrIndex) => (
                <li key={bkgrIndex} className='list-group-item'>
                <div className='row'>
                  <div className='col-md-6 text-end'>
                    {background.name}
                  </div>
                  <div className='col-md-6 text-start'>
                    <span className='me-2'>
                      <SymbolDisplay value={background.value + background.bonusValue} />
                    </span>
                    <ButtonGroup>
                      <Button variant="danger" size='sm' onClick={() => handleBkgrDecrement(bkgrIndex)}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={() => handleBkgrIncrement(bkgrIndex)}>
                        <i className="bi bi-plus-square"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='additional-section'>
          <h1 className="text-center my-4">{gameChar.novaName}'s Additional Stats</h1>
          <h3>Bonus Points: {bonusPoints}</h3>
          <div className='row'>
            <ul className='list-group'>
              <li className='list-group-item'>
                <div className='row'>
                  <div className='col-md-6 text-end'>
                    Willpower
                  </div>
                  <div className='col-md-6 text-start'>
                    <span className='me-2'>
                      <SymbolDisplay value={gameChar.willpowerBonus + 3} max={10} />
                    </span>
                    <ButtonGroup>
                      <Button variant="danger" size='sm' onClick={() => handleWillDecrement()}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={() => handleWillIncrement()}>
                        <i className="bi bi-plus-square"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </li>
              <li className='list-group-item'>
                <div className='row'>
                  <div className='col-md-6 text-end'>
                    Quantum
                  </div>
                  <div className='col-md-6 text-start'>
                    <span className='me-2'>
                      <SymbolDisplay value={gameChar.quantumBonus + 1} max={10} />
                    </span>
                    <ButtonGroup>
                      <Button variant="danger" size='sm' onClick={() => handleQuantDecrement()}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={() => handleQuantIncrement()}>
                        <i className="bi bi-plus-square"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </li>
              <li className='list-group-item'>
                <div className='row'>
                  <div className='col-md-6 text-end'>
                    Initiative
                  </div>
                  <div className='col-md-6 text-start'>
                    <span className='me-3'>
                      {initiative}
                    </span>
                    <ButtonGroup>
                      <Button variant="danger" size='sm' onClick={() => handleInitDecrement()}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={() => handleInitIncrement()}>
                        <i className="bi bi-plus-square"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <Button className="btn btn-primary" type="submit">Submit</Button>
        <Link className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
      </form>
    </Container>
  );

};

export default BonusPoints;
