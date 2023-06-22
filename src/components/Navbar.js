import React from 'react'

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Sprinklr_Logo.png" alt="" width="110" height="35" className="d-inline-block align-text-top" />
          </a>
          <h4 className= "text-center"> SEO Writing Assistant </h4>
        </div>
      </nav>
    </>
  )
}

export default Navbar