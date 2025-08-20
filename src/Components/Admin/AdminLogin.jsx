import React from 'react'

const AdminLogin = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content flex-col">
    <div className="text-center lg:text-left mb-4">
      <h1 className="text-5xl font-bold">Welcome Admin!</h1>
    </div>
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="label text-white">Email</label>
          <input type="email" className="input" placeholder="Email" />
          <label className="label text-white">Password</label>
          <input type="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </div>
    </div>
  </div>
</div>
  )
}

export default AdminLogin