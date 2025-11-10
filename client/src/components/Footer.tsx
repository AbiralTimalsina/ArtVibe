import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-2xl">ArtVibe</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Discover unique artwork and handmade crafts from talented artists worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/products?category=painting" className="text-gray-300 hover:text-white text-sm">
                Paintings
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/products?category=clay-art" className="text-gray-300 hover:text-white text-sm">
                Clay Art
              </Link>
              <span className="text-gray-500">•</span>
              <Link to="/products?category=handicrafts" className="text-gray-300 hover:text-white text-sm">
                Handicrafts
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ArtVibe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}