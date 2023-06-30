import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Sprinklr_Logo.png" alt="Sprinklr Logo" width="150" height="45" className="d-inline-block align-text-top" />
          </a>
          <h1 className= "main-heading"> SEO Checker Tool </h1>
        </div>
      </nav>
    </>
  )
}

export default Navbar