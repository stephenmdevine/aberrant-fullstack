import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import AttributeDisplay from './components/attributes/AttributeDisplay';
import BackgroundsDisplay from './components/BackgroundsDisplay';

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
    const abilities = gameChar.abilities;
    const backgrounds = gameChar.backgrounds;

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-12 border rounded p-4 mt-2 shadow'>
                    <Container>
                    <h2 className='text-center m-4'>{gameChar.novaName} Details</h2>
                        <Row>
                            <Col sm={4}>
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'><b>Player: </b>{gameChar.player}</li>
                                <li className='list-group-item'><b>Character Name: </b>{gameChar.name}</li>
                                <li className='list-group-item'><b>Nova Name: </b>{gameChar.novaName}</li>
                            </ul>
                            </Col>
                            <Col sm={4}>
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'><b>Concept: </b>{gameChar.concept}</li>
                                <li className='list-group-item'><b>Nature: </b>{gameChar.nature}</li>
                                <li className='list-group-item'><b>Allegiance: </b>{gameChar.allegiance}</li>
                            </ul>
                            </Col>
                            <Col sm={4}>
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'><b>Description: </b>{gameChar.description}</li>
                                <li className='list-group-item'><b>Experience: </b>{gameChar.experiencePoints}</li>
                            </ul>
                            </Col>
                        </Row>
                    </Container>
                    <Container className='col-md-4'>
                        {attributes.map((attribute, index) => (
                            <AttributeDisplay
                            key={index}
                            attrName={attribute.name}
                            attrValue={attribute.value}
                            abilities={abilities}
                            />
                        ))}
                    </Container>
                    <Container>
                        <h3>Backgrounds</h3>
                        <BackgroundsDisplay backgrounds={backgrounds}/>
                    </Container>
                    <Link className='btn btn-primary my-2' to={'/'}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
