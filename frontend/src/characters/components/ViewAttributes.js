import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SymbolDisplay from './SymbolDisplay';

const CharacterAttributes = ({ attributes }) => {
    return (
        <div className='container'>
            {attributes.map((attribute, index) => (
                <div className='row mb-2' key={index}>
                    <div className='col-6 text-left'>
                        <strong>{attribute.name}: </strong>
                    </div>
                    <div className='col-6'>
                        <SymbolDisplay value={attribute.value} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default function ViewAttributes() {

    const [attributes, setAttributes] = useState([
        { name: "Strength", value: 0 },
        { name: "Perception", value: 0 },
        { name: "Appearance", value: 0 },
        { name: "Dexterity", value: 0 },
        { name: "Intelligence", value: 0 },
        { name: "Manipulation", value: 0 },
        { name: "Stamina", value: 0 },
        { name: "Wits", value: 0 },
        { name: "Charisma", value: 0 }
    ]);

    const { id } = useParams();

    useEffect(() => {
        loadAttributes();
    }, []);

    const loadAttributes = async () => {
        const result = await axios.get(`http://localhost:8080/attributes/${id}`);
        setAttributes(result.data);
    };

    return (
        <div className='col-md-6 border rounded p-4 mt-2 shadow'>
            <h3>Attributes</h3>
            <CharacterAttributes attributes={attributes} />
            {/* <Container>
                <Row>
                    <Col sm={4}>
                        <h4>Physical</h4>
                    </Col>
                    <Col sm={4}>
                        <h4>Mental</h4>
                    </Col>
                    <Col sm={4}>
                        <h4>Social</h4>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    {attributes.map((attribute, index) => (
                        <Col key={index} sm={4}>
                            <div className="attribute-card">
                                <h5>{attribute.name}</h5>
                                <h3><b>{attribute.value}</b></h3>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container> */}
        </div>
    );
}
