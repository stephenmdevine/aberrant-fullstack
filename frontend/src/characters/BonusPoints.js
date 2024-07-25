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
    setSelectedAbilityId(abilityId);
    setShowSpecialtyModal(true);
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
  }
  
  const handleSpecialtySubmit = async () => {
    if (selectedAbilityId) {
      try {
        const response = await axios.post(`http://localhost:8080/api/specialties/ability/${selectedAbilityId}`, newSpecialty);
        setAbilities((prevAbilities) =>
          prevAbilities.map((ability) =>
            ability.id === selectedAbilityId ? { ...ability, specialties: [...ability.specialties, response.data] } : ability
          )
        );
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

  return (
    <Container>
      <h1 className="text-center my-4">{gameChar.novaName}'s Attributes</h1>
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
                                      {specialty.name}: {ability.value}
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
        <Button className="btn btn-primary" type="submit">Submit</Button>
        <Link className="btn btn-outline-danger mx-2" to="/">Cancel</Link>
      </form>
    </Container>
  );

};

export default BonusPoints;
