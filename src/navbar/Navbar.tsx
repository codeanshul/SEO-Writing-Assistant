import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <img src="Sprinklr_Logo.webp" alt="Sprinklr Logo" width="150" height="45" className="d-inline-block align-text-top" loading='lazy'/>
          <h1 className="main-heading"> SEO Writing Assistant </h1>
        </div>
      </nav>
    </>
  )
}

export default Navbar