import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NavBar() {
  return (
    <div>
      <Navbar bg='dark' variant='dark' fixed='top'>
        <Navbar.Brand>
          <Link className="navbar-brand" to="/">Aberrant Character Creation</Link>
        </Navbar.Brand>
        <Nav className='mr-auto'>
          <Link className='btn btn-outline-light' to='/addCharacter'>Create New Character</Link>
        </Nav>
      </Navbar>
      {/* <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link className="btn btn-outline-light" to="/addCharacter">
            Create New Character
          </Link>
        </div>
      </nav> */}
    </div>
  )
}
