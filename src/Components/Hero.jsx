import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <img src="/images/hero_icon.png" alt="Desert Rat 3D Printing"/>
      <h1 className="text-4xl font-bold">Bring your ideas to life, one layer at a time.</h1>
      <Link to="/portfolio">
        <button className='btn btn-lg btn-primary my-6 text-white px-10'>
          Go to Portfolio
        </button>
      </Link>
    </div>
  </div>
</div>
  )
}

export default Hero