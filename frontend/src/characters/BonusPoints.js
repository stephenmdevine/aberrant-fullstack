import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, ListGroup, Modal, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SymbolDisplay from './components/SymbolDisplay';

const BonusPoints = () => {
  const [gameChar, setGameChar] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [backgrounds, setBackgrounds] = useState([]);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name: '', value: 0 });
  const [selectedAbilityId, setSelectedAbilityId] = useState(null);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [novaPoints, setNovaPoints] = useState(0);
  const [expPoints, setExpPoints] = useState(0);
  const [expSpent, setExpSpent] = useState(0);
  const [baseTaint, setBaseTaint] = useState(0);
  const [taint, setTaint] = useState(0);
  // State for flaws and merits
  const [flaws, setFlaws] = useState([]);
  const [merits, setMerits] = useState([]);
  const [newFlaw, setNewFlaw] = useState({ name: '', value: 0 });
  const [newMerit, setNewMerit] = useState({ name: '', value: 0 });
  const { id } = useParams();
  const navigate = useNavigate();

  // Function to get attribute value by name
  const getAttributeValue = (attributeName) => {
    const attribute = attributes.find(attr => attr.name === attributeName);
    return attribute ? (attribute.value + attribute.bonusValue) : 0; // Return 0 if the attribute is not found
  };

  // Calculate initiative
  const dexterityValue = getAttributeValue('Dexterity');
  const witsValue = getAttributeValue('Wits');
  const initiative = dexterityValue + witsValue + gameChar.initiativeBonus;

  useEffect(() => {
    loadGameChar();
  }, []);

  useEffect(() => {
    const nodeBackground = backgrounds.find(background => background.name == 'Node');

    if (nodeBackground && nodeBackground.value > 2) {
      console.log(nodeBackground.value);
      const newTaint = nodeBackground.value - 2;
      setBaseTaint(newTaint);
      console.log(baseTaint);
    }
  }, [backgrounds]);

  // Load all game character details
  const loadGameChar = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/character/${id}`);
      setGameChar(result.data);
      setAttributes(result.data.attributes);
      setAbilities(result.data.abilities);
      setBackgrounds(result.data.backgrounds);
      setBonusPoints(result.data.bonusPoints);
      setNovaPoints(result.data.novaPoints);
      setExpPoints(result.data.experiencePoints);
      setExpSpent(result.data.expSpent);
      setBaseTaint(result.data.baseTaint);
      setTaint(result.data.taint);
      setFlaws(result.data.flaws);
      setMerits(result.data.merits);
    } catch (error) {
      console.error('Error loading character:', error);
    }
  };

  if (!gameChar) {
    return <div>Loading...</div>;
  }

  // Ability specialty modal
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

  // Handle flaw/merit form changes
  const handleFlawChange = (e) => setNewFlaw({ ...newFlaw, [e.target.name]: e.target.value });
  const handleMeritChange = (e) => setNewMerit({ ...newMerit, [e.target.name]: e.target.value });

  // Handle flaw/merit form submissions
  const handleAddFlaw = async () => {
    const flawValue = parseInt(newFlaw.value, 10);
    const flawData = { ...newFlaw, gameCharId: id };

    try {
      await axios.post(`http://localhost:8080/${id}/flaws`, flawData);
      setFlaws([...flaws, flawData]);
      setNewFlaw({ name: '', value: 0 });
      setBonusPoints(bonusPoints + flawValue);
    } catch (error) {
      console.error('Error adding flaw: ', error);
    }
  };

  const handleAddMerit = async () => {
    const meritValue = parseInt(newMerit.value, 10);
    const meritData = { ...newMerit, gameCharId: id };

    if (bonusPoints >= meritValue) {
      try {
        await axios.post(`http://localhost:8080/${id}/merits`, meritData);
        setMerits([...merits, newMerit]);
        setNewMerit({ name: '', value: 0 });
        setBonusPoints(bonusPoints - meritValue);
      } catch (error) {
        console.log('Error adding merit: ', error);
      }
    }
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

  const handleAbilIncrement = (attrIndex, abilIndex) => {
    const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
    const ability = attrAbilities[abilIndex];

    if (ability.value + ability.bonusValue < 5 && bonusPoints >= 2) {
        const newAbilities = [...abilities];
        const index = abilities.indexOf(ability);
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

        if (background.name === 'Node' && background.value + background.bonusValue > 2) {
          setTaint(taint + 1);
        }
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

  const handleAbilDecrement = (attrIndex, abilIndex) => {
    const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
    const ability = attrAbilities[abilIndex];

    if (ability.bonusValue > 0) {
        const newAbilities = [...abilities];
        const index = abilities.indexOf(ability);
        newAbilities[index].bonusValue -= 1;
        setAbilities(newAbilities);
        setBonusPoints(bonusPoints + 2);
    }
  };

  const handleBkgrDecrement =  (index) => {
    const background = backgrounds[index];

    if (background.bonusValue > 0) {
        const newBackgrounds = [...backgrounds];
        newBackgrounds[index].bonusValue -= 1;
        setBackgrounds(newBackgrounds);
        setBonusPoints(bonusPoints + 1);

        if (background.name === 'Node' && background.value + background.bonusValue > 2) {
          setTaint(taint - 1);
        }
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
    
    const gameCharUpdateData = {
      // Include all the necessary fields and lists from your state
      bonusPoints: bonusPoints,
      novaPoints: novaPoints,
      willpowerBonus: gameChar.willpowerBonus,
      quantumBonus: gameChar.quantumBonus,
      initiativeBonus: gameChar.initiativeBonus,
      taint: gameChar.taint,
    };

    const attributeDTOs = attributes.map(attribute => ({
        name: attribute.name,
        value: attribute.value,
        bonusValue: attribute.bonusValue,
        novaValue: attribute.novaValue,
        expValue: attribute.expValue,
    }));

    const abilityDTOs = abilities.map(ability => ({
        name: ability.name,
        value: ability.value,
        bonusValue: ability.bonusValue,
        novaValue: ability.novaValue,
        expValue: ability.expValue,
    }));

    const backgroundDTOs = backgrounds.map(background => ({
        name: background.name,
        value: background.value,
        bonusValue: background.bonusValue,
        novaValue: background.novaValue,
        expValue: background.expValue,
    }));

    try {
        await Promise.all([
            axios.put(`http://localhost:8080/allocateAttributePoints/${id}`, {
                attributes: attributeDTOs,
            }),
            axios.put(`http://localhost:8080/allocateAbilityPoints/${id}`, {
                abilities: abilityDTOs,
            }),
            axios.put(`http://localhost:8080/allocateBackgroundPoints/${id}`, {
                backgrounds: backgroundDTOs,
            }),
            axios.put(`http://localhost:8080/character/${id}`, {
              bonusPoints: bonusPoints,
              novaPoints: novaPoints,
              experiencePoints: expPoints,
              expSpent: expSpent,
              baseTaint: baseTaint,
              taint: taint,
              willpowerBonus: gameChar.willpowerBonus,
              quantumBonus: gameChar.quantumBonus,
              willpowerNova: gameChar.willpowerNova,
              quantumNova: gameChar.quantumNova,
              initiativeBonus: gameChar.initiativeBonus,
            })
        ]);

        alert("Character successfully updated");
        navigate('/');
    } catch (error) {
        console.error('Error updating character:', error);
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

  const handleFlawDelete = async (flawId, flawValue) => {
    try {
      await axios.delete(`http://localhost:8080/api/flawsAndMerits/${flawId}/flaw`);
      setFlaws((prevFlaws) =>
        prevFlaws.filter((flaw) => flaw.id !== flawId)
      );
      setBonusPoints(bonusPoints - parseInt(flawValue, 10));
    } catch (error) {
      console.error('Error deleting flaw:', error);
    }
  };

  const handleMeritDelete = async (meritId, meritValue) => {
    try {
      await axios.delete(`http://localhost:8080/api/flawsAndMerits/${meritId}/merit`);
      setMerits((prevMerits) =>
        prevMerits.filter((merit) => merit.id !== meritId)
      );
      setBonusPoints(bonusPoints + parseInt(meritValue, 10));
    } catch (error) {
      console.error('Error deleting merit:', error);
    }
  };

  return (
    <Container fluid>
      {/* Fixed Navbar and Header */}
      <header style={{ position: 'fixed', top: 56, width: '100%', backgroundColor: '#f8f9fa', zIndex: 1030, padding: 15 }}>
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="text-center">{gameChar.novaName}'s Attributes & Abilities</h1>
            </Col>
          </Row>
          <Row className="align-items-center py-2">
            <Col>
              <h3 className="text-center">Bonus Points: {bonusPoints}</h3>
            </Col>
          </Row>
        </Container>
      </header>
      {/* Main Content */}
      <main style={{ paddingTop: '120px' }}>
        <form onSubmit={handleSubmit}>
          {/* Attributes and Abilities Section */}
          <section className="attribute-section mb-5">
            {attributes.slice(0, 9).map((attribute, attrIndex) => {
              const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attribute.name);
              return (
                <Container key={attribute.name} className="my-4">
                  <Row>
                    <Col className="text-center">
                      <h4>{attribute.name}</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <div className="btn-toolbar justify-content-center" role="toolbar">
                        <h4 className='me-2'><SymbolDisplay value={attribute.value + attribute.bonusValue} /></h4>
                        <ButtonGroup className='border rounded shadow'>
                          <Button variant="light" onClick={() => handleAttrDecrement(attrIndex)}>
                            <i className="bi bi-dash-square"></i>
                          </Button>
                          <Button variant="primary" onClick={() => handleAttrIncrement(attrIndex)}>
                            <i className="bi bi-plus-square"></i>
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    {attribute.value + attribute.bonusValue >= 4 && (
                      <QualityManager attributeId={attribute.id} />
                    )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-center">
                      <ul className='list-group'>
                        {attrAbilities.map((ability, abilIndex) => (
                          <li key={abilIndex} className='list-group-item'>
                            <div className='row align-items-center'>
                              <div className='col-md-6 text-end'>
                                {ability.name}
                              </div>
                              <div className='col-md-6 text-start'>
                                <span className='me-2'>
                                  <SymbolDisplay value={ability.value + ability.bonusValue} />
                                </span>
                                <ButtonGroup className='border rounded shadow'>
                                  <Button variant="light" size='sm' onClick={() => handleAbilDecrement(attrIndex, abilIndex)}>
                                    <i className="bi bi-dash-square"></i>
                                  </Button>
                                  <Button variant="primary" size='sm' onClick={() => handleAbilIncrement(attrIndex, abilIndex)}>
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
                                      <span>{specialty.name} <SymbolDisplay value={ability.value + ability.bonusValue + 1} max={6} /></span>
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
                </Container>
              );
            })}
          </section>
          {/* Backgrounds Section */}
          <section className="background-section mb-5">
            <h1 className="text-center my-4">{gameChar.novaName}'s Backgrounds</h1>
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
                      <ButtonGroup className='border rounded shadow'>
                        <Button variant="light" size='sm' onClick={() => handleBkgrDecrement(bkgrIndex)}>
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
          </section>
          {/* Additional Stats Section */}
          <section className='additional-section'>
            <h1 className="text-center my-4">{gameChar.novaName}'s Additional Stats</h1>
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
                    <ButtonGroup className='border rounded shadow'>
                      <Button variant="light" size='sm' onClick={handleWillDecrement}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={handleWillIncrement}>
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
                    <ButtonGroup className='border rounded shadow'>
                      <Button variant="light" size='sm' onClick={handleQuantDecrement}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={handleQuantIncrement}>
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
                    <ButtonGroup className='border rounded shadow'>
                      <Button variant="light" size='sm' onClick={handleInitDecrement}>
                        <i className="bi bi-dash-square"></i>
                      </Button>
                      <Button variant="primary" size='sm' onClick={handleInitIncrement}>
                        <i className="bi bi-plus-square"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          {/* Flaws Section */}
          <section className='flaws-section my-4'>
            <h3>Flaws</h3>
            <ListGroup className='mb-3'>
              {flaws.map((flaw, index) => (
                <ListGroup.Item key={index}>
                  {flaw.name} <span className='badge bg-warning'>{flaw.value}</span>
                  <Button
                    className='ms-2'
                    variant="danger"
                    size="sm"
                    onClick={() => handleFlawDelete(flaw.id, flaw.value)}
                  >
                    x
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Flaw Name"
                    value={newFlaw.name}
                    onChange={handleFlawChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="value"
                    placeholder="Value"
                    value={newFlaw.value}
                    onChange={handleFlawChange}
                    min={1}
                    max={7}
                  />
                </Col>
                <Col>
                  <Button variant="primary" onClick={handleAddFlaw}>Add Flaw</Button>
                </Col>
              </Row>
            </Form>
          </section>

          {/* Merits Section */}
          <section className='merits-section my-4'>
            <h3>Merits</h3>
            <ListGroup className='mb-3'>
              {merits.map((merit, index) => (
                <ListGroup.Item key={index}>
                  {merit.name} <span className='badge bg-primary'>{merit.value}</span>
                  <Button
                    className='ms-2'
                    variant="danger"
                    size="sm"
                    onClick={() => handleMeritDelete(merit.id, merit.value)}
                  >
                    x
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Merit Name"
                    value={newMerit.name}
                    onChange={handleMeritChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="value"
                    placeholder="Value"
                    value={newMerit.value}
                    onChange={handleMeritChange}
                    min={1}
                    max={7}
                  />
                </Col>
                <Col>
                  <Button variant="primary" onClick={handleAddMerit}>Add Merit</Button>
                </Col>
              </Row>
            </Form>
          </section>
          {/* Submit and Cancel Buttons */}
          <div className="d-flex justify-content-center my-4">
            <Button className="btn btn-primary me-2" type="submit">Submit</Button>
            <Link className="btn btn-outline-danger" to="/">Cancel</Link>
          </div>
        </form>
      </main>
      {/* Specialty Modal */}
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
};

export default BonusPoints;




const QualityManager = ({ attributeId }) => {
  // State to hold the quality name entered by the user
  const [qualityName, setQualityName] = useState('');
  // State to hold the existing quality name (if any) for placeholder
  const [existingQuality, setExistingQuality] = useState('');

  // Fetch existing quality for the attribute when the component mounts
  useEffect(() => {
    const fetchQuality = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/attributes/${attributeId}/quality`);
        setExistingQuality(response.data.name);
      } catch (error) {
        console.error('Error fetching quality:', error);
      }
    };

    fetchQuality();
  }, [attributeId]);

  // Handle input changes
  const handleQualityChange = (event) => {
    setQualityName(event.target.value);
  };

  // Save or update the quality
  const saveQuality = async () => {
    try {
      await axios.post(`http://localhost:8080/api/attributes/${attributeId}/quality`, { name: qualityName });
      setExistingQuality(qualityName); // Update the existing quality name with the new one
      setQualityName(''); // Clear the input field
    } catch (error) {
      console.error('Error saving quality:', error);
    }
  };

  return (
    <div className='py-2'>
      <input
        type="text"
        className='me-2'
        value={qualityName}
        onChange={handleQualityChange}
        placeholder={existingQuality || "Enter Quality Name"}
      />
      <Button 
      variant='primary' 
      onClick={saveQuality}>
        Save Quality
        </Button>
    </div>
  );
};
