import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';

export default function ViewGameChar() {

    const [gameChar, setGameChar] = useState({
        player: "",
        name: "",
        novaName: ""
    });

    const { id } = useParams();

    useEffect(() => {
        loadGameChar();
    }, []);

    const loadGameChar = async () => {
        const result = await axios.get(`http://localhost:8080/character/${id}`);
        setGameChar(result.data);
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>{gameChar.novaName} Details</h2>
                    <div className='card'>
                        <div className='card-header'>
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                    <b>Player: </b>
                                    {gameChar.player}
                                </li>
                                <li className='list-group-item'>
                                    <b>Name: </b>
                                    {gameChar.name}
                                </li>
                                <li className='list-group-item'>
                                    <b>Nova Name: </b>
                                    {gameChar.novaName}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className='btn btn-primary my-2' to={'/'}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
