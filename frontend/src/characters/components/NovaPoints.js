import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Form, ListGroup, Modal, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SymbolDisplay from './SymbolDisplay';

const NovaPoints = () => {
    const [gameChar, setGameChar] = useState({});
    const [attributes, setAttributes] = useState([]);
    const [abilities, setAbilities] = useState([]);
    const [backgrounds, setBackgrounds] = useState([]);
    const [bonusPoints, setBonusPoints] = useState(0);
    const [novaPoints, setNovaPoints] = useState(0);
    const [expPoints, setExpPoints] = useState(0);
    const [expSpent, setExpSpent] = useState(0);
    const [taint, setTaint] = useState(0);
    const [tainted, setTainted] = useState(false);
    // State for flaws and merits
    const [flaws, setFlaws] = useState([]);
    const [merits, setMerits] = useState([]);
    // State for Nova characteristics
    const [megaAttributes, setMegaAttributes] = useState([]);
    const [powers, setPowers] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadGameChar();
    }, []);

    useEffect(() => {
        // Update the Nova Points spent and free increases on attribute changes
        calculateFreeAttrIncreases();
    }, [attributes]);
    useEffect(() => {
        // Update the Nova Points spent and free increases on ability changes
        calculateFreeAbilIncreases();
    }, [abilities]);
    useEffect(() => {
        // Update the Nova Points spent and free increases on ability changes
        calculateFreeBkgrIncreases();
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
            setTaint(result.data.taint);
            setFlaws(result.data.flaws);
            setMerits(result.data.merits);
            setMegaAttributes(result.data.megaAttributes);
            setPowers(result.data.powers);
        } catch (error) {
            console.error('Error loading character:', error);
        }
    };

    if (!gameChar) {
        return <div>Loading...</div>;
    }

    // Function to get attribute value by name
    const getAttributeValue = (attributeName) => {
        const attribute = attributes.find(attr => attr.name === attributeName);
        return attribute ? attribute.value : 0; // Return 0 if the attribute is not found
    };

    const novaCost = (value) => {
        if (!tainted) {
            return value;
        } else {
            return Math.ceil(value / 2);
        }
    };

    const calculateTotalAttrNovaValue = () => {
        return attributes.reduce((sum, attr) => sum + attr.novaValue, 0);
    };
    const calculateTotalAbilNovaValue = () => {
        return abilities.reduce((sum, attr) => sum + attr.novaValue, 0);
    };
    const calculateTotalBkgrNovaValue = () => {
        return backgrounds.reduce((sum, attr) => sum + attr.novaValue, 0);
    };

    const calculateFreeAttrIncreases = () => {
        const totalNovaValue = calculateTotalAttrNovaValue();
        return (3 - (totalNovaValue % 3)) % 3;
    };
    const calculateFreeAbilIncreases = () => {
        const totalNovaValue = calculateTotalAbilNovaValue();
        return (6 - (totalNovaValue % 6)) % 6;
    };
    const calculateFreeBkgrIncreases = () => {
        const totalNovaValue = calculateTotalBkgrNovaValue();
        return (5 - (totalNovaValue % 5)) % 5;
    };

    const handleAttrIncrement = (index) => {

        const attribute = attributes[index];
        const totalValue = attribute.value + attribute.bonusValue + attribute.novaValue;

        if (totalValue < 5) {
            const freeIncreases = calculateFreeAttrIncreases();

            if (freeIncreases === 0 && novaPoints < 1) {
                alert('Not enough nova points');
                return;
            }
            const newAttributes = [...attributes];
            newAttributes[index].novaValue += 1;
            setAttributes(newAttributes);
            if (freeIncreases === 0) {
                setNovaPoints(novaPoints - 1);
            }
        }
    };

    const handleAbilIncrement = (attrIndex, abilIndex) => {
        const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
        const ability = attrAbilities[abilIndex];

        if (ability.value + ability.bonusValue + ability.novaValue < 5) {
            const freeIncreases = calculateFreeAbilIncreases();

            if (freeIncreases === 0 && novaPoints < 1) {
                alert('Not enough nova points');
                return;
            }
            const newAbilities = [...abilities];
            const index = abilities.indexOf(ability);
            newAbilities[index].novaValue += 1;
            setAbilities(newAbilities);
            if (freeIncreases === 0) {
                setNovaPoints(novaPoints - 1);
            }
        }
    };

    const handleBkgrIncrement = (index) => {

        const background = backgrounds[index];
        const totalValue = background.value + background.bonusValue + background.novaValue;

        if (totalValue < 5) {
            const freeIncreases = calculateFreeBkgrIncreases();

            if (freeIncreases === 0 && novaPoints < 1) {
                alert('Not enough nova points');
                return;
            }
            const newBackgrounds = [...backgrounds];
            newBackgrounds[index].novaValue += 1;
            setBackgrounds(newBackgrounds);
            if (freeIncreases === 0) {
                setNovaPoints(novaPoints - 1);
            }

            if (background.name === 'Node' && background.value + background.bonusValue + background.novaValue > 2) {
                setTaint(taint + 1);
            }
        }
    };

    const handleWillIncrement = () => {
        const totalValue = gameChar.willpowerNova + 3;
        if (totalValue < 10 && novaPoints >= 1) {
            setGameChar(prevChar => ({
                ...prevChar,
                willpowerNova: prevChar.willpowerNova + 1
            }));
            setNovaPoints(novaPoints - 1);
        }
    };

    const handleQuantIncrement = () => {
        const totalValue = gameChar.quantumNova + 1;
        const cost = novaCost(5);
        if (totalValue < 10 && novaPoints >= cost) {
            setGameChar(prevChar => ({
                ...prevChar,
                quantumNova: prevChar.quantumNova + 1
            }));
            setNovaPoints(novaPoints - cost);
        }
    };

    const handleMegaAttrIncrement = (index) => {

        const megaAttribute = megaAttributes[index];
        const maxValue = getAttributeValue(megaAttribute.name.slice(5));
        const cost = novaCost(3);

        if (megaAttribute.value < maxValue && novaPoints >= cost) {
            const newMegaAttributes = [...megaAttributes];
            newMegaAttributes[index].value += 1;
            setMegaAttributes(newMegaAttributes);
            setNovaPoints(novaPoints - cost);
        }
    };

    const handlePowerIncrement = (index) => {
        const power = powers[index];
        const powerCost = (2 * (power.level + power.hasExtra - 1)) + 1;
        const cost = novaCost(powerCost);

        if (power.value < 5 && novaPoints >= cost) {
            const newPowers = [...powers];
            if (power.level + power.hasExtra === 1 && tainted) {
                newPowers[index].value += 2;
            } else {
                newPowers[index].value += 1;
            }
            setPowers(newPowers);
            setNovaPoints(novaPoints - cost);
        }
    };

    const handleAttrDecrement = (index) => {
        const attribute = attributes[index];

        if (attribute.novaValue > 0) {
            const newAttributes = [...attributes];
            newAttributes[index].novaValue -= 1;
            setAttributes(newAttributes);

            const totalNovaValue = calculateTotalAttrNovaValue() - 1;

            if ((totalNovaValue + 1) % 3 === 0) {
                setNovaPoints(novaPoints + 1);
            }
        }
    };

    const handleAbilDecrement = (attrIndex, abilIndex) => {
        const attrAbilities = abilities.filter(ability => ability.associatedAttribute === attributes[attrIndex].name);
        const ability = attrAbilities[abilIndex];

        if (ability.novaValue > 0) {
            const newAbilities = [...abilities];
            const index = abilities.indexOf(ability);
            newAbilities[index].novaValue -= 1;
            setAbilities(newAbilities);

            const totalNovaValue = calculateTotalAbilNovaValue() - 1;

            if ((totalNovaValue + 1) % 6 === 0) {
                setNovaPoints(novaPoints + 1);
            }
        }
    };

    const handleBkgrDecrement = (index) => {
        const background = backgrounds[index];

        if (background.novaValue > 0) {
            const newBackgrounds = [...backgrounds];
            newBackgrounds[index].novaValue -= 1;
            setBackgrounds(newBackgrounds);

            const totalNovaValue = calculateTotalBkgrNovaValue() - 1;

            if ((totalNovaValue + 1) % 5 === 0) {
                setNovaPoints(novaPoints + 1);
            }

            if (background.name === 'Node' && background.value + background.bonusValue + background.novaValue > 2) {
                setTaint(taint - 1);
            }
        }
    };

    const handleWillDecrement = () => {
        if (gameChar.willpowerNova > 0) {
            setGameChar(prevChar => ({
                ...prevChar,
                willpowerNova: prevChar.willpowerNova - 1
            }));
            setNovaPoints(novaPoints + 1);
        }
    };

    const handleQuantDecrement = () => {
        const cost = novaCost(5);

        if (gameChar.quantumNova > 0) {
            setGameChar(prevChar => ({
                ...prevChar,
                quantumNova: prevChar.quantumNova - 1
            }));
            setNovaPoints(novaPoints + cost);
        }
    };

    const handleMegaAttrDecrement = (index) => {
        const megaAttribute = megaAttributes[index];
        const cost = novaCost(3);

        if (megaAttribute.value > 0) {
            const newMegaAttributes = [...megaAttributes];
            newMegaAttributes[index].value -= 1;
            setMegaAttributes(newMegaAttributes);
            setNovaPoints(novaPoints + cost);
        }
    };

    const handlePowerDecrement = (index) => {
        const power = powers[index];
        const powerCost = (2 * (power.level + power.hasExtra - 1)) + 1;
        const cost = novaCost(powerCost);

        if (power.value > 0) {
            const newPowers = [...powers];
            if (power.level + power.hasExtra === 1 && tainted) {
                newPowers[index].value -= 2;
            } else {
                newPowers[index].value -= 1;
            }
            setPowers(newPowers);
            setNovaPoints(novaPoints + cost);
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

        const PowerDTOs = powers.map(power => ({
            name: power.name,
            value: power.value,
            expValue: power.expValue,
            level: power.level,
            quantumMinimum: power.quantumMinimum,
            hasExtra: power.hasExtra,
            extraName: power.extraName,
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
                            <h3 className="text-center">Nova Points: {novaPoints}</h3>
                            <span><b>Free Attributes: </b>{calculateFreeAttrIncreases()} | <b>Free Abilities: </b>{calculateFreeAbilIncreases()} | <b>Free Backgrounds: </b>{calculateFreeBkgrIncreases()}</span>
                        </Col>
                    </Row>
                </Container>
            </header>
            {/* Main Content */}
            <main style={{ paddingTop: '150px' }}>
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
                                                <h4 className='me-2'><SymbolDisplay value={attribute.value + attribute.bonusValue + attribute.novaValue} /></h4>
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
                                            {attribute.value + attribute.bonusValue + attribute.novaValue >= 4 && (
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
                                                                    <SymbolDisplay value={ability.value + ability.bonusValue + ability.novaValue} />
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
                                                                            <span>{specialty.name} <SymbolDisplay value={ability.value + ability.bonusValue + ability.novaValue + 1} max={6} /></span>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
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
                                                <SymbolDisplay value={background.value + background.bonusValue + background.novaValue} />
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
                                            <SymbolDisplay value={gameChar.willpowerBonus + gameChar.willpowerNova + 3} max={10} />
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
                                            <SymbolDisplay value={gameChar.quantumBonus + gameChar.quantumNova + 1} max={10} />
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
                                                <h4 className='me-2'><SymbolDisplay value={megaAttribute.value} /></h4>
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
                                            {megaAttribute.value > 0 && (
                                                <EnhancementManager
                                                    megaAttributeId={megaAttribute.id}
                                                    novaPoints={novaPoints}
                                                    setNovaPoints={setNovaPoints}
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
                                        <h4>{power.name}</h4>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="btn-toolbar justify-content-center" role="toolbar">
                                                <h4 className='me-2'><SymbolDisplay value={power.value} /></h4>
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
                                        <Col><b>Dice Pool:</b> {power.attrName} + {power.name} ({power.attrValue + power.value})</Col>
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
                            novaPoints={novaPoints}
                            setNovaPoints={setNovaPoints}
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
        </Container>
    );
};

export default NovaPoints;




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
        // const fetchQuality = async () => {
        //     try {
        //         const response = await axios.get(`http://localhost:8080/api/attributes/${attributeId}/quality`);
        //         setExistingQuality(response.data.name);
        //     } catch (error) {
        //         console.error('Error fetching quality:', error);
        //     }
        // };

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



const EnhancementManager = ({ megaAttributeId, novaPoints, setNovaPoints, tainted }) => {
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

    const novaCost = (value) => {
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
        const enhancementCost = existingEnhancements.length > 0 ? novaCost(3) : 0;

        if (novaPoints < enhancementCost) {
            alert('Not enough nova points');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/megaAttributes/${megaAttributeId}/enhancements`, { name: enhancementName });
            setExistingEnhancements([...existingEnhancements, { name: enhancementName }]);
            setEnhancementName(''); // Clear the input field
            if (enhancementCost > 0) {
                setNovaPoints(novaPoints - enhancementCost);
            }
        } catch (error) {
            console.error('Error saving enhancement:', error);
        }
    };

    const handleDeleteEnhancement = async (megaAttributeId, enhancementId) => {
        const enhancementCostReturn = existingEnhancements.length > 1 ? novaCost(3) : 0;

        try {
            const response = await axios.delete(`http://localhost:8080/api/megaAttributes/${megaAttributeId}/enhancements/${enhancementId}`);
            if (enhancementCostReturn > 0) {
                setNovaPoints(novaPoints + enhancementCostReturn);
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
                    <div className='p-1' key={index}>
                        <span>{enhancement.name}</span>
                        <Button
                            className='ms-2'
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteEnhancement(megaAttributeId, enhancement.id)}
                        >
                            x
                        </Button>
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



const NewPowerManager = ({ attributes, powers, setPowers, novaPoints, setNovaPoints, id, tainted }) => {

    const [newPower, setNewPower] = useState({
        name: "",
        value: 1,
        expValue: 0,
        level: 1,
        quantumMinimum: 1,
        hasExtra: false,
        extraName: "",
        attributeId: 0
    });

    const novaCost = (value) => {
        if (!tainted) {
            return Number(value);
        } else {
            return Math.ceil(value / 2);
        }
    };

    const handlePowerInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const parsedValue = type === 'checkbox' ? checked : (name === 'level' || name === 'quantumMinimum') ? Number(value) : value;

        if (name === 'level' && parsedValue === 3) {
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

        const powerCost = (2 * (Number(newPower.level) + Number(newPower.hasExtra) - 1)) + 1;
        const cost = novaCost(powerCost);

        if (isNaN(novaPoints)) {
            console.error('Invalid novaPoints value:', novaPoints);
            return;
        }

        if (newPower.level + newPower.hasExtra === 1 && tainted) {
            newPower.value = 2;
        }

        if (novaPoints < cost) {
            alert('Not enough nova points');
            return;
        }

        setNovaPoints(prev => {
            const newPoints = Number(prev) - Number(cost);
            return newPoints >= 0 ? newPoints : 0;  // Ensure it doesn't go below zero
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
            value: 1,
            expValue: 0,
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
                <div className='col-md-6 text-end'>
                    <label>Base Power Level (with no extras)</label>
                </div>
                <div className='col-md-3 text-start'>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        className="form-range"
                        name='level'
                        value={newPower.level}
                        onChange={handlePowerInputChange}
                    />
                </div>
                <div className='col-md-1 text-start'>{newPower.level}</div>
            </div>
            <div className='row'>
                <div className='col-md-6 text-end'>
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
                        <option value={null}>No Attribute</option>
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
