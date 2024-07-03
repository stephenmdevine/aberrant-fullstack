import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

export default function EditGameChar() {

    let navigate = useNavigate();

    const { id } = useParams();

    const [gameChar, setGameChar] = useState({
        player: "",
        name: "",
        novaName: "",
        concept: "",
        nature: "",
        allegiance: "",
        description: "",
        attributePoints: 15,
        abilityPoints: 23,
        backgroundPoints: 7,
        bonusPoints: 15,
        novaPoints: 30,
        experiencePoints: 0
    });

    const {player, name, novaName, 
        concept, nature, allegiance, description, 
        attributePoints, abilityPoints, backgroundPoints, 
        bonusPoints, novaPoints, experiencePoints} = gameChar;

    const onInputChange = (e) => {
        setGameChar({ ...gameChar, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        loadGameChar();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/character/${id}`, gameChar);
        navigate('/');
    };

    const loadGameChar = async () => {
        const result = await axios.get(`http://localhost:8080/character/${id}`);
        setGameChar(result.data);
    };

  return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Basic Character Information</h2>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className='mb-3'>
                        <label htmlFor='Player' className='form-label'>Player</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Your name" 
                        name='player' 
                        value={player} 
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='Name' className='form-label'>Character Name</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Your character's 'real' name" 
                        name='name' 
                        value={name} 
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='NovaName' className='form-label'>Nova Name</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Your superhero name" 
                        name='novaName' 
                        value={novaName} 
                        onChange={(e) => onInputChange(e)} />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor='Concept' className='form-label'>Concept</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Your character's profession, personality, or interests" 
                        name='concept' 
                        value={concept} 
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='Nature' className='form-label'>Nature</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Your character's core being" 
                        name='nature' 
                        value={nature} 
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='Allegiance' className='form-label'>Allegiance</label>
                        <input 
                        type={'text'} 
                        className='form-control' 
                        placeholder="Who your character works for" 
                        name='allegiance' 
                        value={allegiance} 
                        onChange={(e) => onInputChange(e)} />
                    </div>
                    <div>
                        <label htmlFor='Description' className='form-label'>Description</label>
                        <textarea 
                        className='form-control' 
                        placeholder="Describe your character" 
                        name='description' 
                        value={description} 
                        onChange={(e) => onInputChange(e)}></textarea>
                    </div>

                    <div className='my-4'>
                        <h3>Character Creation Points Initialization</h3>
                        <div className='input-group d-flex h-100 align-items-center justify-content-center'>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='AttributePoints' className='form-label'>Attribute Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='attributePoints' 
                                value={attributePoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='AbilityPoints' className='form-label'>Ability Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='abilityPoints' 
                                value={abilityPoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='BackgroundPoints' className='form-label'>Background Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='backgroundPoints' 
                                value={backgroundPoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                        </div>

                        <div className='input-group d-flex h-100 align-items-center justify-content-center'>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='BonusPoints' className='form-label'>Bonus Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='bonusPoints' 
                                value={bonusPoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='NovaPoints' className='form-label'>Nova Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='novaPoints' 
                                value={novaPoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                            <div className='mb-3 w-25 px-2'>
                                <label htmlFor='ExperiencePoints' className='form-label'>Experience Points</label>
                                <input 
                                type={'number'} 
                                className='form-control text-center' 
                                name='experiencePoints' 
                                value={experiencePoints} 
                                onChange={(e) => onInputChange(e)} />
                            </div>
                        </div>
                    </div>

                    <button type='submit' className='btn btn-outline-primary'>Submit</button>
                    <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
                </form>
            </div>
        </div>
    </div>
  );
}
