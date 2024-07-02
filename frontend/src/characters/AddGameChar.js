import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AddGameChar() {

    let navigate = useNavigate();

    const [gameChar, setGameChar] = useState({
        player: "",
        name: "",
        novaName: ""
    });

    const {player, name, novaName} = gameChar;

    const onInputChange = (e) => {
        setGameChar({ ...gameChar, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:8080/character', gameChar);
        navigate('/');
    };

  return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Basic Character Information</h2>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor='Player' className='form-label'>
                            Player
                        </label>
                        <input
                        type={'text'}
                        className='form-control'
                        placeholder="Enter player's name"
                        name='player'
                        value={player}
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='Name' className='form-label'>
                            Character Name
                        </label>
                        <input
                        type={'text'}
                        className='form-control'
                        placeholder="Enter character name"
                        name='name'
                        value={name}
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='NovaName' className='form-label'>
                            Nova Name
                        </label>
                        <input
                        type={'text'}
                        className='form-control'
                        placeholder="Enter Nova name"
                        name='novaName'
                        value={novaName}
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <button type='submit' className='btn btn-outline-primary'>Submit</button>
                    <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
                </form>
            </div>
        </div>
    </div>
  )
}
