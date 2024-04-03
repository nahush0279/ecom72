import React from 'react'

function Footer() {
  return (
    <div>
<footer className="page-footer shadow">
  <div className="container py-5">
    <div className="row">
      <div className="col-lg-4 col-md-4 mb-4 mb-lg-0">
        <h5 className="mb-4">Ecommerce</h5>
        <p className="text-muted">
          We are creating High Quality Resources and tools to Aid developers during the development of their projects
        </p>
        <div className="social-icons mt-4 ">
          <button className="btn btn-dark btn-flat p-2 mx-2">
            <i className="pi pi-linkedin"></i>
          </button>
          <button className="btn btn-dark btn-flat p-2 mx-2">
            <i className="pi pi-facebook"></i>
          </button>
          <button className="btn btn-dark btn-flat p-2 mx-2">
            <i className='pi pi-instagram'></i>
          </button>
        </div>
      </div>
      <div className="col-lg-4 col-md-4 mb-4 mb-lg-0">
        <h5 className="mb-4">Help</h5>
        <ul className="list-unstyled mb-0">
          <li>
            <a href="/" className="text-dark">Support</a>
          </li>
          <li>
            <a href="/" className="text-dark">Sign Up</a>
          </li>
          <li>
            <a href="/" className="text-dark">Sign In</a>
          </li>
        </ul>
      </div>
      <div className="col-lg-4 col-md-4 mb-4 mb-lg-0">
        <h5 className="mb-4">Useful Links</h5>
        <ul className="list-unstyled mb-0">
          <li>
            <a href="/" className="text-dark">Resources</a>
          </li>
          <li>
            <a href="/" className="text-dark">About Us</a>
          </li>
          <li>
            <a href="/" className="text-dark">Contact</a>
          </li>
          <li>
            <a href="/" className="text-dark">Blog</a>
          </li>
        </ul>
      </div>
    </div>
    <div className="text-center mt-5">
      <small className="text-muted">&copy; Ecommerce, 2024. All rights reserved.</small>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Footer