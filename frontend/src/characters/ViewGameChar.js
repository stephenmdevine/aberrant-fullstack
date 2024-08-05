import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import AttributeDisplay from './components/attributes/AttributeDisplay';
import BackgroundsDisplay from './components/BackgroundsDisplay';
import SymbolDisplay from './components/SymbolDisplay';

export default function ViewGameChar() {

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
    const physicalAttributes = attributes.slice(0, 3);
    const mentalAttributes = attributes.slice(3, 6);
    const socialAttributes = attributes.slice(6, 9);
    const abilities = gameChar.abilities;
    const backgrounds = gameChar.backgrounds;
    const flaws = gameChar.flaws;
    const merits = gameChar.merits;
    const quantumPool = gameChar.quantumPoolBonus + 20 + ((gameChar.quantumBonus + 1) * 2);

    const taint = gameChar.baseTaint + gameChar.taint;
    const megaAttributes = gameChar.megaAttributes;
    const enhancements = megaAttributes.enhancements;
    const powers = gameChar.powers;

    // Function to get attribute value by name
    const getAttributeValue = (attributeName) => {
      const attribute = attributes.find(attr => attr.name === attributeName);
      return attribute ? attribute.value : 0; // Return 0 if the attribute is not found
    };

    // Calculate initiative
    const dexterityValue = getAttributeValue('Dexterity');
    const witsValue = getAttributeValue('Wits');
    const staminaValue = getAttributeValue('Stamina');
    const initiative = dexterityValue + witsValue + gameChar.initiativeBonus;
    const run = dexterityValue + 12;
    const sprint = (dexterityValue * 3) + 20;
    const bashing = staminaValue;
    const lethal = Math.floor(staminaValue / 2);

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 border rounded p-4 mt-2 shadow'>
                    <Container>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>{gameChar.novaName} Character Sheet</h1>
                        <Row>
                            <Col sm={6}>
                                <ul className='list-group list-group-flush' style={{textAlign: 'left'}}>
                                    <li className='list-group-item'><b>Player: </b>{gameChar.player}</li>
                                    <li className='list-group-item'><b>Character Name: </b>{gameChar.name}</li>
                                    <li className='list-group-item'><b>Nova Name: </b>{gameChar.novaName}</li>
                                </ul>
                            </Col>
                            <Col sm={6}>
                                <ul className='list-group list-group-flush' style={{textAlign: 'left'}}>
                                    <li className='list-group-item'><b>Concept: </b>{gameChar.concept}</li>
                                    <li className='list-group-item'><b>Nature: </b>{gameChar.nature}</li>
                                    <li className='list-group-item'><b>Allegiance: </b>{gameChar.allegiance}</li>
                                </ul>
                            </Col>
                            {/* <Col sm={4}>
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'><b>Description: </b>{gameChar.description}</li>
                                <li className='list-group-item'><b>Experience: </b>{gameChar.experiencePoints}</li>
                            </ul>
                            </Col> */}
                        </Row>
                    </Container>

                    <Container className='my-4'>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>Attributes & Abilities</h1>
                        <Row>
                            <Col sm={4}>
                                {physicalAttributes.map((attribute, index) => (
                                    <AttributeDisplay
                                        key={index}
                                        attribute={attribute}
                                        abilities={abilities}
                                    />
                                ))}
                            </Col>
                            <Col sm={4}>
                                {mentalAttributes.map((attribute, index) => (
                                    <AttributeDisplay
                                        key={index}
                                        attribute={attribute}
                                        abilities={abilities}
                                    />
                                ))}
                            </Col>
                            <Col sm={4}>
                                {socialAttributes.map((attribute, index) => (
                                    <AttributeDisplay
                                        key={index}
                                        attribute={attribute}
                                        abilities={abilities}
                                    />
                                ))}
                            </Col>
                        </Row>
                    </Container>

                    <Container className='my-4'>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>Advantages</h1>
                        <Row>
                            <Col sm={4}>
                                <h3>Backgrounds</h3>
                                <BackgroundsDisplay backgrounds={backgrounds} />
                                <h3 className='pt-4'>Willpower</h3>
                                <h3 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={gameChar.willpowerBonus + gameChar.willpowerNova + 3} max={10} /></h3>
                                <h3 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={0} max={10} box={true} /></h3>
                                <h3 className='pt-4'>Taint</h3>
                                <h3 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={gameChar.taint + gameChar.baseTaint} max={10} /></h3>
                                <h3 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={0} max={10} box={true} /></h3>
                                {gameChar.taint > 3 && (
                                    <h3 className='pt-4'>Aberrations</h3>
                                )}
                                <h3 className='pt-4'>Quantum</h3>
                                <h3 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={gameChar.quantumBonus + 1} max={10} /></h3>
                            </Col>
                            <Col sm={4}>
                                <h3>Mega-Attributes</h3>
                                <h3 className='pt-4'>Flaws</h3>
                                <ListGroup className='mb-3'>
                                    {flaws.map((flaw, index) => (
                                        <ListGroup.Item key={index}>
                                            {flaw.name} <span className='badge bg-warning'>{flaw.value}</span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                            <Col sm={4}>
                                <h3>Quantum Powers</h3>
                                <h3 className='pt-4'>Merits</h3>
                                <ListGroup className='mb-3'>
                                    {merits.map((merit, index) => (
                                        <ListGroup.Item key={index}>
                                            {merit.name} <span className='badge bg-primary'>{merit.value}</span>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Col>
                        </Row>
                    </Container>

                    <Container className='my-4'>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>Quantum Pool ({quantumPool})</h1>
                        <h4 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={quantumPool} max={40} /></h4>
                        <h4 style={{textAlignLast: 'justify', textAlign: 'justify'}}><SymbolDisplay value={0} max={40} box={true} /></h4>
                    </Container>

                    <Container className='my-4'>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>Combat</h1>
                        <Row className='py-4'>
                            <Col sm={3}>
                            <h3>Initiative</h3>
                            <div className='p-1'>
                                <h2 className='border rounded'>{initiative}</h2>
                            </div>
                            </Col>
                            <Col sm={5}>
                            <h3>Movement</h3>
                            <Row className='p-1'>
                                <Col sm={3} className='border rounded p-1'><h5>7m</h5></Col>
                                <Col sm={3} className='border rounded p-1'><h5>{run}m</h5></Col>
                                <Col sm={3} className='border rounded p-1'><h5>{sprint}m</h5></Col>
                                <Col sm={3} className='border rounded p-1'><h5></h5></Col>
                            </Row>
                            <Row>
                                <Col sm={3}>Walk</Col>
                                <Col sm={3}>Run</Col>
                                <Col sm={3}>Sprint</Col>
                                <Col sm={3}>other</Col>
                            </Row>
                            </Col>
                            <Col sm={4}>
                            <h3>Soak</h3>
                            <Row className='p-1'>
                                <Col sm={6} className='border rounded p-1'><h5>{bashing}</h5></Col>
                                <Col sm={6} className='border rounded p-1'><h5>{lethal}</h5></Col>
                            </Row>
                            <Row>
                                <Col sm={6}>Bashing</Col>
                                <Col sm={6}>Lethal</Col>
                            </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Link className='btn btn-primary my-2' to={'/'}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
