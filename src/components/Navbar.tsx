import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const { pathname } = useLocation()

  const linkStyle = (path: string) =>
    `hover:text-green-500 transition ${
      pathname === path ? 'text-green-600 font-semibold' : 'text-gray-700'
    }`

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-700">SEWA Green Team</Link>
        <div className="space-x-6">
          <Link to="/" className={linkStyle('/')}>Home</Link>
          <Link to="/about" className={linkStyle('/about')}>About</Link>
          <Link to="/initiatives" className={linkStyle('/initiatives')}>Initiatives</Link>
          <Link to="/get-involved" className={linkStyle('/get-involved')}>Get Involved</Link>
          <Link to="/contact" className={linkStyle('/contact')}>Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
