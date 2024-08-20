import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, ListGroup, Modal, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SymbolDisplay from './SymbolDisplay';

const ExperiencePoints = () => {
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
    const [taint, setTaint] = useState(0);
    const [tainted, setTainted] = useState(false);
    // State for Nova characteristics
    const [megaAttributes, setMegaAttributes] = useState([]);
    const [powers, setPowers] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    //   // Function to get attribute value by name
    const getAttributeValue = (attributeName) => {
        const attribute = attributes.find(attr => attr.name === attributeName);
        return attribute ? (attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue) : 0; // Return 0 if the attribute is not found
    };

    //   // Calculate initiative
    const dexterityValue = getAttributeValue('Dexterity');
    const witsValue = getAttributeValue('Wits');
    const initiative = dexterityValue + witsValue + gameChar.initiativeBonus + gameChar.initiativeExp;

    useEffect(() => {
        loadGameChar();
    }, []);

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
            setTaint(result.data.taint);
            setMegaAttributes(result.data.megaAttributes);
            setPowers(result.data.powers);
        } catch (error) {
            console.error('Error loading character:', error);
        }
    };

    if (!gameChar) {
        return <div>Loading...</div>;
    }

    const expCost = (value) => {
        if (!tainted) {
            return value;
        } else {
            return Math.ceil(value / 2);
        }
    };

    //   // Ability specialty modal
    const handleSpecialtyModalShow = (abilityId) => {
        if (expPoints > 0) {
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
        const totalValue = attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue;

        if (totalValue < 5) {
            if (expPoints - expSpent < (totalValue * 4)) {
                alert('Not enough experience');
                return;
            }
            const newAttributes = [...attributes];
            newAttributes[index].expValue += 1;
            setAttributes(newAttributes);
            setExpSpent(expSpent + (totalValue * 4));
        }
    };

    const handleAbilIncrement = (attrIndex, abilIndex) => {
        const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
        const ability = attrAbilities[abilIndex];
        const totalValue = ability.value + ability.bonusValue + ability.novaValue + ability.expValue;

        const cost = totalValue === 0 ? 3 : (totalValue * 2);

        if (totalValue < 5) {
            if (expPoints - expSpent < cost) {
                alert('Not enough experience');
                return;
            }
            const newAbilities = [...abilities];
            const index = abilities.indexOf(ability);
            newAbilities[index].expValue += 1;
            setAbilities(newAbilities);
            setExpSpent(expSpent + cost);
        }
    };

    const handleBkgrIncrement = (index) => {

        const background = backgrounds[index];
        const totalValue = background.value + background.bonusValue + background.novaValue + background.expValue;

        const cost = totalValue === 0 ? 2 : (totalValue * 2);

        if (totalValue < 5) {
            if (expPoints - expSpent < cost) {
                alert('Not enough experience');
                return;
            }
            const newBackgrounds = [...backgrounds];
            newBackgrounds[index].expValue += 1;
            setBackgrounds(newBackgrounds);
            setExpSpent(expSpent + cost);

            if (background.name === 'Node' && totalValue > 2) {
                setTaint(taint + 1);
            }
        }
    };

    const handleWillIncrement = () => {
        const totalValue = gameChar.willpowerBonus + gameChar.willpowerNova + gameChar.willpowerExp + 3;
        if (totalValue < 10 && expPoints - expSpent >= totalValue) {
            setGameChar(prevChar => ({
                ...prevChar,
                willpowerExp: prevChar.willpowerExp + 1
            }));
            setExpSpent(expSpent + totalValue);
        }
    };

    const handleQuantIncrement = () => {
        const totalValue = gameChar.quantumBonus + gameChar.quantumNova + gameChar.quantumExp + 1;
        const cost = expCost(totalValue * 8);
        if (totalValue < 10 && expPoints - expSpent >= cost) {
            setGameChar(prevChar => ({
                ...prevChar,
                quantumExp: prevChar.quantumExp + 1
            }));
            setExpSpent(expSpent + cost);
        }
    };

    const handleMegaAttrIncrement = (index) => {

        const megaAttribute = megaAttributes[index];
        const maxValue = getAttributeValue(megaAttribute.name.slice(5));

        const totalValue = megaAttribute.value + megaAttribute.expValue;
        const cost = totalValue === 0 ? expCost(6) : expCost(totalValue * 5);

        if (totalValue < maxValue && expPoints - expSpent >= cost) {
            const newMegaAttributes = [...megaAttributes];
            newMegaAttributes[index].expValue += 1;
            setMegaAttributes(newMegaAttributes);
            setExpSpent(expSpent + cost);
        }
    };

    const handlePowerIncrement = (index) => {
        const power = powers[index];
        const totalValue = power.value + power.expValue;
        const powerCost = PowerCost(totalValue, power.level + (power.hasExtra ? 1 : 0));
        const cost = expCost(powerCost);

        if (totalValue < 5 && expPoints - expSpent >= cost) {
            const newPowers = [...powers];
            const updatedPower = { ...newPowers[index], expValue: power.expValue + 1 };
            newPowers[index] = updatedPower;
            setPowers(newPowers);
            setExpSpent(expSpent + cost);
        }
    };

    const handleInitIncrement = () => {
        const cost = initiative;
        if (expPoints - expSpent >= cost) {
            setGameChar(prevChar => ({
                ...prevChar,
                initiativeExp: prevChar.initiativeExp + 1
            }));
            setExpSpent(expSpent + cost);
        }
    };

    const handleAttrDecrement = (index) => {
        const attribute = attributes[index];
        const totalValueBeforeDecrement = attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue;

        if (attribute.expValue > 0) {
            const newAttributes = [...attributes];
            newAttributes[index].expValue -= 1;
            setAttributes(newAttributes);

            const decrementCost = (totalValueBeforeDecrement - 1) * 4;
            setExpSpent(expSpent - decrementCost);
        }
    };

    const handleAbilDecrement = (attrIndex, abilIndex) => {
        const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
        const ability = attrAbilities[abilIndex];
        const totalValueBeforeDecrement = ability.value + ability.bonusValue + ability.novaValue + ability.expValue;

        if (ability.expValue > 0) {
            const newAbilities = [...abilities];
            const index = abilities.indexOf(ability);
            newAbilities[index].expValue -= 1;
            setAbilities(newAbilities);

            let decrementCost;
            if (totalValueBeforeDecrement === 1) {
                decrementCost = 3;
            } else {
                decrementCost = (totalValueBeforeDecrement - 1) * 2;
            }
            setExpSpent(expSpent - decrementCost);
        }
    };

    const handleBkgrDecrement = (index) => {
        const background = backgrounds[index];
        const totalValueBeforeDecrement = background.value + background.bonusValue + background.novaValue + background.expValue;

        if (background.expValue > 0) {
            const newBackgrounds = [...backgrounds];
            newBackgrounds[index].expValue -= 1;
            setBackgrounds(newBackgrounds);

            let decrementCost;
            if (totalValueBeforeDecrement === 1) {
                decrementCost = 2;
            } else {
                decrementCost = (totalValueBeforeDecrement - 1) * 2;
            }
            setExpSpent(expSpent - decrementCost);

            if (background.name === 'Node' && background.value + background.bonusValue + background.novaValue + background.expValue > 2) {
                setTaint(taint - 1);
            }
        }
    };

    const handleWillDecrement = () => {
        const totalValue = gameChar.willpowerBonus + gameChar.willpowerNova + gameChar.willpowerExp + 3 - 1;

        if (gameChar.willpowerExp > 0) {
            setGameChar(prevChar => ({
                ...prevChar,
                willpowerExp: prevChar.willpowerExp - 1
            }));
            setExpSpent(expSpent - totalValue);
        }
    };

    const handleQuantDecrement = () => {
        const totalValue = gameChar.quantumBonus + gameChar.quantumNova + gameChar.quantumExp + 0;
        const cost = expCost(totalValue * 8);

        if (gameChar.quantumExp > 0) {
            setGameChar(prevChar => ({
                ...prevChar,
                quantumExp: prevChar.quantumExp - 1
            }));
            setExpSpent(expSpent - cost);
        }
    };

    const handleMegaAttrDecrement = (index) => {
        const megaAttribute = megaAttributes[index];

        const totalValue = megaAttribute.value + megaAttribute.expValue - 1;

        let cost;
        if (totalValue === 0) {
            cost = 6;
        } else {
            cost = expCost(totalValue * 5);
        }

        if (megaAttribute.expValue > 0) {
            const newMegaAttributes = [...megaAttributes];
            newMegaAttributes[index].expValue -= 1;
            setMegaAttributes(newMegaAttributes);
            setExpSpent(expSpent - cost);
        }
    };

    const handlePowerDecrement = (index) => {
        const power = powers[index];
        const totalValue = power.value + power.expValue - 1;
        const powerCost = PowerCost(totalValue, power.level + Number(power.hasExtra));
        const cost = expCost(powerCost);

        if (power.expValue > 0) {
            const newPowers = [...powers];
            const updatedPower = { ...newPowers[index], expValue: power.expValue - 1 };
            newPowers[index] = updatedPower;
            setPowers(newPowers);
            setExpSpent(expSpent - cost);
        }
    };

    const handleInitDecrement = () => {
        const cost = initiative - 1
            ;
        if (gameChar.initiativeExp > 0) {
            setGameChar(prevChar => ({
                ...prevChar,
                initiativeExp: prevChar.initiativeExp - 1
            }));
            setExpSpent(expSpent - cost);
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
                setExpSpent(expSpent + 1);
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

        const MegaAttributeDTOs = megaAttributes.map(megaAttribute => ({
            name: megaAttribute.name,
            value: megaAttribute.value,
            expValue: megaAttribute.expValue,
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
                axios.put(`http://localhost:8080/allocateMegaAttributePoints/${id}`, {
                    megaAttributes: MegaAttributeDTOs,
                }),
                axios.put(`http://localhost:8080/character/${id}`, {
                    bonusPoints: bonusPoints,
                    novaPoints: novaPoints,
                    experiencePoints: expPoints,
                    expSpent: expSpent,
                    baseTaint: gameChar.baseTaint,
                    taint: gameChar.taint,
                    willpowerBonus: gameChar.willpowerBonus,
                    willpowerNova: gameChar.willpowerNova,
                    willpowerExp: gameChar.willpowerExp,
                    quantumBonus: gameChar.quantumBonus,
                    quantumNova: gameChar.quantumNova,
                    quantumExp: gameChar.quantumExp,
                    quantumPoolBonus: gameChar.quantumPoolBonus,
                    quantumPoolExp: gameChar.quantumPoolExp,
                    initiativeBonus: gameChar.initiativeBonus,
                    initiativeExp: gameChar.initiativeExp,
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
            setExpSpent(expSpent - 1);
        } catch (error) {
            console.error('Error deleting specialty:', error);
        }
    };

    const handlePowerDelete = async (index) => {
        const powerId = powers[index].id;
    
        try {
            await axios.delete(`http://localhost:8080/api/powers/${powerId}`);
            const updatedPowers = powers.filter((_, i) => i !== index);
            setPowers(updatedPowers);
            alert('Power deleted successfully.');
        } catch (error) {
            console.error('Error deleting power:', error);
            alert('Failed to delete power.');
        }
    };

    return (
        <Container fluid>
            {/* Fixed Navbar and Header */}
            <header style={{ position: 'fixed', top: 56, width: '100%', backgroundColor: '#f8f9fa', zIndex: 1030, padding: 15 }}>
                <TaintedButton
                    tainted={tainted}
                    setTainted={setTainted}
                />
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="text-center">{gameChar.novaName}'s Attributes & Abilities</h1>
                        </Col>
                    </Row>
                    <Row className="align-items-center py-2">
                        <Col>
                            <h3 className="d-flex justify-content-center align-items-center">
                                <ExpToSpendDisplay
                                    expPoints={expPoints}
                                    expSpent={expSpent}
                                />
                                <AddExpPointsButton
                                    expPoints={expPoints}
                                    setExpPoints={setExpPoints}
                                />
                            </h3>
                        </Col>
                    </Row>
                </Container>
            </header>
            {/* Main Content */}
            <main style={{ paddingTop: '125px' }}>
                <form onSubmit={handleSubmit}>
                    {/* Attributes and Abilities Section */}
                    <section className="attribute-section mb-5">
                        {attributes.slice(0, 9).map((attribute, attrIndex) => {
                            const attrAbilities = abilities.filter(ability => ability.associatedAttribute == attribute.name);
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
                                                <h4 className='me-2 pt-1'><SymbolDisplay value={attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue} /></h4>
                                                <ButtonGroup className='border rounded shadow'>
                                                    <Button variant="light" onClick={() => handleAttrDecrement(attrIndex)}>
                                                        <i className="bi bi-dash-square"></i>
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handleAttrIncrement(attrIndex)}
                                                        disabled={attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue === 5}>
                                                        <i className="bi bi-plus-square"></i>
                                                    </Button>
                                                </ButtonGroup>
                                                <h4 className='ps-2 pt-1'>{
                                                    (attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue) < 5 ?
                                                        (attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue) * 4 : ""
                                                }</h4>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {attribute.value + attribute.bonusValue + attribute.novaValue + attribute.expValue >= 4 && (
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
                                                                    <SymbolDisplay value={ability.value + ability.bonusValue + ability.novaValue + ability.expValue} />
                                                                </span>
                                                                <ButtonGroup className='border rounded shadow mb-2'>
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
                                                                        <div className='d-flex justify-content-center align-items-center mt-1'>
                                                                            <span>{specialty.name} <SymbolDisplay
                                                                                value={ability.value + ability.bonusValue + ability.novaValue + ability.expValue + 1} max={6}
                                                                            /></span>
                                                                            <button
                                                                                type='button'
                                                                                className=' btn-close border border-danger ms-2'
                                                                                aria-label='Close'
                                                                                title='Delete'
                                                                                onClick={() => handleSpecialtyDelete(specialty.id, ability.id)}
                                                                            ></button>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {ability.specialties.length < 3 && (
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    className='mt-2'
                                                                    onClick={() => handleSpecialtyModalShow(ability.id)}
                                                                >Add Specialty</Button>
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
                                                <SymbolDisplay value={background.value + background.bonusValue + background.novaValue + background.expValue} />
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
                                            <SymbolDisplay value={gameChar.willpowerBonus + gameChar.willpowerNova + gameChar.willpowerExp + 3} max={10} />
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
                                            <SymbolDisplay value={gameChar.quantumBonus + gameChar.quantumNova + gameChar.quantumExp + 1} max={10} />
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

                    {/* Mega Attributes Section */}
                    <section className='mega-section my-4'>
                        <h1>{gameChar.novaName}'s Mega-Attributes & Enhancements</h1>
                        {megaAttributes.map((megaAttribute, megaIndex) => {
                            return (
                                <Container key={megaAttribute.name} className="my-4">
                                    <Row>
                                        <Col className="text-center">
                                            <h4>{megaAttribute.name}</h4>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center">
                                            <div className="btn-toolbar justify-content-center" role="toolbar">
                                                <h4 className='me-2'><SymbolDisplay value={megaAttribute.value + megaAttribute.expValue} /></h4>
                                                <ButtonGroup className='border rounded shadow'>
                                                    <Button variant="light" onClick={() => handleMegaAttrDecrement(megaIndex)}>
                                                        <i className="bi bi-dash-square"></i>
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handleMegaAttrIncrement(megaIndex)}>
                                                        <i className="bi bi-plus-square"></i>
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="text-center">
                                            {megaAttribute.value + megaAttribute.expValue > 0 && (
                                                <EnhancementManager
                                                    megaAttributeId={megaAttribute.id}
                                                    expPoints={expPoints}
                                                    expSpent={expSpent}
                                                    setExpSpent={setExpSpent}
                                                    tainted={tainted}
                                                />

                                            )}
                                        </Col>
                                    </Row>
                                </Container>
                            );
                        })}

                    </section>

                    {/* SUPERPOWERS! */}
                    <section className='mega-section my-4'>
                        <h1>{gameChar.novaName}'s Quantum Powers</h1>
                        {powers.map((power, powIndex) => {
                            return (
                                <Container key={power.name} className='my-4 py-2 border rounded col-md-6'>
                                    <Row>
                                        <div className='row'>
                                            <div className='col-md-1'>
                                                {powIndex}
                                            </div>
                                            <div className='col-md-10'>
                                                <h4>{power.name}</h4>

                                            </div>
                                            <div className='col-md-1'>
                                                <button
                                                    type='button'
                                                    className=' btn-close border border-danger ms-4'
                                                    aria-label='Close'
                                                    title='Delete'
                                                onClick={() => handlePowerDelete(powIndex)}
                                                ></button>
                                            </div>
                                        </div>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="btn-toolbar d-flex justify-content-center" role="toolbar">
                                                <h4 className='me-2'><SymbolDisplay value={power.value + power.expValue} /></h4>
                                                <ButtonGroup className='border rounded shadow'>
                                                    <Button variant="light" onClick={() => handlePowerDecrement(powIndex)}>
                                                        <i className="bi bi-dash-square"></i>
                                                    </Button>
                                                    <Button variant="primary" onClick={() => handlePowerIncrement(powIndex)}>
                                                        <i className="bi bi-plus-square"></i>
                                                    </Button>
                                                </ButtonGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col><b>Level:</b> {power.level}</Col>
                                    </Row>
                                    <Row>
                                        <Col><b>Quantum Minimum:</b> {power.quantumMinimum}</Col>
                                    </Row>
                                    <Row>
                                        <Col><b>Dice Pool:</b> {power.attrName} + {power.name} ({power.attrValue + power.value + power.expValue})</Col>
                                    </Row>
                                    {power.hasExtra && (
                                        <Row>
                                            <Col><b>Extra:</b> {power.extraName}</Col>
                                        </Row>
                                    )}
                                </Container>
                            );
                        })}
                        <NewPowerManager
                            attributes={attributes}
                            powers={powers}
                            setPowers={setPowers}
                            expPoints={expPoints}
                            expSpent={expSpent}
                            setExpSpent={setExpSpent}
                            id={id}
                            tainted={tainted}
                        />
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

export default ExperiencePoints;




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

                // Check if the response data has a quality name
                if (response.data && response.data.name) {
                    setExistingQuality(response.data.name);
                } else {
                    setExistingQuality(''); // Set to an empty string or handle it as needed
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('No quality found for this attribute.');
                    setExistingQuality(''); // Handle the case where no quality exists
                } else {
                    console.error('Error fetching quality:', error);
                }
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



const EnhancementManager = ({ megaAttributeId, expPoints, expSpent, setExpSpent, tainted }) => {
    // State to hold the quality name entered by the user
    const [enhancementName, setEnhancementName] = useState('');
    // State to hold the existing quality name (if any) for placeholder
    const [existingEnhancements, setExistingEnhancements] = useState([]);

    // Fetch existing quality for the attribute when the component mounts
    const fetchEnhancements = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/megaAttributes/${megaAttributeId}/enhancements`);
            setExistingEnhancements(response.data);
        } catch (error) {
            console.error('Error fetching enhancement:', error);
        }
    };

    useEffect(() => {
        fetchEnhancements();
    }, [megaAttributeId]);

    const expCost = (value) => {
        if (!tainted) {
            return value;
        } else {
            return Math.ceil(value / 2);
        }
    };

    // Handle input changes
    const handleEnhancementChange = (event) => {
        setEnhancementName(event.target.value);
    };

    // Save or update the quality
    const saveEnhancement = async () => {
        const enhancementCost = existingEnhancements.length > 0 ? expCost(5) : 0;

        if (expPoints - expSpent < enhancementCost) {
            alert('Not enough experience points');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/megaAttributes/${megaAttributeId}/enhancements`, { name: enhancementName });
            setExistingEnhancements([...existingEnhancements, { name: enhancementName }]);
            setEnhancementName(''); // Clear the input field
            if (enhancementCost > 0) {
                setExpSpent(expSpent + enhancementCost);
            }
        } catch (error) {
            console.error('Error saving enhancement:', error);
        }
    };

    const handleDeleteEnhancement = async (megaAttributeId, enhancementId) => {
        const enhancementCostReturn = existingEnhancements.length > 1 ? expCost(5) : 0;

        try {
            const response = await axios.delete(`http://localhost:8080/api/megaAttributes/${megaAttributeId}/enhancements/${enhancementId}`);
            if (enhancementCostReturn > 0) {
                setExpSpent(expSpent - enhancementCostReturn);
            }
            fetchEnhancements();
        } catch (error) {
            console.error('Error deleting enhancement:', error);
        }
    };

    return (
        <div className='py-2'>
            <div className='m-2'>
                {existingEnhancements.map((enhancement, index) => (
                    <div className='d-flex justify-content-center align-items-center' key={index}>
                        <h6 className='pt-1'>{enhancement.name}</h6>
                        <button
                            type='button'
                            className=' btn-close border border-danger ms-2'
                            aria-label='Close'
                            title='Delete'
                            onClick={() => handleDeleteEnhancement(megaAttributeId, enhancement.id)}
                        ></button>
                    </div>
                ))}
            </div>
            <input
                type="text"
                className='me-2'
                value={enhancementName}
                onChange={handleEnhancementChange}
                placeholder={"Enter Enhancement Name"}
            />
            <Button
                variant='primary'
                onClick={saveEnhancement}>
                Add Enhancement
            </Button>
        </div>
    );
};



const NewPowerManager = ({ attributes, powers, setPowers, expPoints, expSpent, setExpSpent, id, tainted }) => {

    const [newPower, setNewPower] = useState({
        name: "",
        value: 0,
        expValue: 1,
        level: 1,
        quantumMinimum: 1,
        hasExtra: false,
        extraName: "",
        attributeId: 0
    });

    const expCost = (value) => {
        if (!tainted) {
            return Number(value);
        } else {
            return Math.ceil(value / 2);
        }
    };

    const handlePowerInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const parsedValue = type === 'checkbox' ? checked : (name === 'level' || name === 'quantumMinimum') ? Number(value) : value;

        if (name === 'level' && parsedValue === 6) {
            setNewPower({
                ...newPower,
                level: parsedValue,
                hasExtra: false
            });
        } else {
            setNewPower({
                ...newPower,
                [name]: type === 'checkbox' ? checked : parsedValue
            });
        }
    };

    const handleAddPower = async (e) => {
        e.preventDefault();
        console.log("Power save initiated...");
        console.log(newPower.attributeId);

        const powerCost = Number(PowerCost(0, Number(newPower.level) + Number(newPower.hasExtra)));
        const cost = expCost(powerCost);

        if (isNaN(expPoints - expSpent)) {
            console.error('Invalid expPoints value:', expPoints);
            return;
        }

        if (expPoints - expSpent < cost) {
            alert('Not enough experience points');
            return;
        }

        setExpSpent(prev => {
            const newPoints = Number(prev) + Number(cost);
            return newPoints;
        });

        try {
            const response = await axios.post(`http://localhost:8080/api/powers/${id}`, newPower);
            console.log(newPower.name + " saved.");
            const updatedPowers = [...powers, response.data];
            setPowers(updatedPowers);
        } catch (error) {
            console.error('Error saving power:', error);
        }

        setNewPower({
            name: "",
            value: 0,
            expValue: 1,
            level: 1,
            quantumMinimum: 1,
            hasExtra: false,
            extraName: "",
            attributeId: null,
        });
    };

    return (
        <Container className='border rounded col-md-6'>
            <h2>New Power</h2>
            <div className='row'>
                <div className='col-md-6 text-end'>
                    <label>Power Name</label>
                </div>
                <div className='col-md-6 text-start'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='power name'
                        name='name'
                        value={newPower.name}
                        onChange={handlePowerInputChange}
                    />
                </div>
            </div>
            <div className='row'>
                <div className='col-md-5 text-end'>
                    <label>Base Power Level (with no extras)</label>
                </div>
                <div className='col-md-6 text-start'>
                    <input
                        type="range"
                        min={1}
                        max={6}
                        className="form-range"
                        name='level'
                        value={newPower.level}
                        onChange={handlePowerInputChange}
                    />
                </div>
                <div className='col-md-1 text-start'>{newPower.level}</div>
            </div>
            <div className='row'>
                <div className='col-md-5 text-end'>
                    <label>Minimum Quantum</label>
                </div>
                <div className='col-md-5 text-start'>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        className="form-range"
                        name='quantumMinimum'
                        value={newPower.quantumMinimum}
                        onChange={handlePowerInputChange}
                    />
                </div>
                <div className='col-md-1 text-start'>{newPower.quantumMinimum}</div>
            </div>
            <div className='row'>
                <div className='col-md-6 text-end'>
                    <label>Associated Attribute</label>
                </div>
                <div className='col-md-6 text-start'>
                    <select
                        name='attributeId'
                        value={newPower.attributeId}
                        onChange={handlePowerInputChange}
                        className='form-select'
                    >
                        {attributes.map(attr => (
                            <option key={attr.id} value={attr.id}>
                                {attr.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='text-center'>
                <div className='form-check-reverse form-check-inline'>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        name='hasExtra'
                        id='hasExtra'
                        checked={newPower.hasExtra}
                        onChange={handlePowerInputChange}
                    />
                    <label className='form-check-label' htmlFor='hasExtra'>
                        Extra
                    </label>
                </div>
            </div>
            {newPower.hasExtra && (
                <div className='row'>
                    <div className='col-md-6 text-end'>
                        <label>Extra Name</label>
                    </div>
                    <div className='col-md-6 text-start'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='extra name'
                            name='extraName'
                            value={newPower.extraName}
                            onChange={handlePowerInputChange}
                        />
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-center my-4">
                <Button
                    className="btn btn-primary me-2"
                    onClick={handleAddPower}
                // type='submit'
                >Add This Power</Button>
            </div>
        </Container>
    );
};



const TaintedButton = ({ tainted, setTainted }) => {

    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", float: "right", bottom: -50, right: 150 }}>
                <input
                    type="checkbox"
                    class="btn-check"
                    id="btn-check-outlined"
                    onChange={() => {
                        setTainted(!tainted);
                    }}
                    autocomplete="off" />
                <label class="btn btn-outline-primary" for="btn-check-outlined">Buy Tainted</label>
            </div>
        </div>

    );
};



const PowerCost = (currentRating, powerLevel) => {
    if (currentRating === 0) {
        return powerLevel * 3;
    }
    switch (powerLevel) {
        case 1:
            return currentRating * 3;
        case 2:
            return currentRating * 5;
        case 3:
            return currentRating * 7;
        case 4:
            return currentRating * 9;
        case 5:
            return currentRating * 12;
        case 6:
            return currentRating * 15;
        default:
            return 0;
    }
};



const ExpToSpendDisplay = ({ expPoints, expSpent }) => {
    const filledSymbol = '⍉';
    const emptySymbol = '⭘';

    const symbols = [];

    for (let i = 0; i < expPoints; i++) {
        symbols.push(i < expSpent ? filledSymbol : emptySymbol);
    }

    return (
        <div style={{ textAlignLast: 'justify', textAlign: 'justify' }}>
            {symbols.map((symbol, index) => (
                <React.Fragment key={index}>
                    <span>{symbol}</span>
                    {(index + 1) % 5 === 0 && index !== expPoints - 1 && (
                        <span >|</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );

};



const AddExpPointsButton = ({ expPoints, setExpPoints }) => {
    const [show, setShow] = useState(false);
    const [newExp, setNewExp] = useState(0);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleAddExpPoints = () => {
        const parsedExp = parseInt(newExp, 10);
        if (!isNaN(parsedExp) && parsedExp > 0) {
            setExpPoints(expPoints + parsedExp);
        }
        handleClose();
    };

    return (
        <>
            <Button variant="success" onClick={handleShow}>
                Add Experience Points
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Experience Points</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter amount"
                        value={newExp}
                        onChange={(e) => setNewExp(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddExpPoints}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};