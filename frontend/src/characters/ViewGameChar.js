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

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 border rounded p-4 mt-2 shadow'>
                    <Container>
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>{gameChar.novaName} Character Sheet</h1>
                        <Row>
                            <Col sm={6}>
                                <ul className='list-group list-group-flush'>
                                    <li className='list-group-item'><b>Player: </b>{gameChar.player}</li>
                                    <li className='list-group-item'><b>Character Name: </b>{gameChar.name}</li>
                                    <li className='list-group-item'><b>Nova Name: </b>{gameChar.novaName}</li>
                                </ul>
                            </Col>
                            <Col sm={6}>
                                <ul className='list-group list-group-flush'>
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
                                <h3><SymbolDisplay value={gameChar.willpowerBonus + 3} max={10} /></h3>
                                <h3 className='pt-4'>Taint</h3>
                                <h3><SymbolDisplay value={gameChar.taint} max={10} /></h3>
                                <h3 className='pt-4'>Quantum</h3>
                                <h3><SymbolDisplay value={gameChar.quantumBonus + 1} max={10} /></h3>
                            </Col>
                            <Col sm={4}>
                                <h3>Mega-Attributes</h3>
                                <h3 className='pt-4'>Flaws</h3>
                                <ListGroup className='mb-3'>
                                    {flaws.map((flaw, index) => (
                                        <ListGroup.Item key={index}>
                                            {flaw.name} <span className='badge bg-danger'>{flaw.value}</span>
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
                        <h1 className='text-center p-2 bg-primary bg-gradient text-white rounded'>Quantum Pool</h1>
                        <h3><SymbolDisplay value={quantumPool} max={35} /> ({quantumPool})</h3>
                    </Container>
                    <Link className='btn btn-primary my-2' to={'/'}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
