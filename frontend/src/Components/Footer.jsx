import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-blue-400" />
              RapidAid
            </h3>
            <p className="text-gray-400 mb-4">
              Providing comprehensive healthcare solutions at your fingertips.
              Your health is our top priority.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/avinashchoudhary.exe" // Replace with your actual LinkedIn profile URL
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                target="_blank" // This will open the link in a new tab
                rel="noopener noreferrer" // Security best practice when using target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/your-profile" // Replace with your actual LinkedIn profile URL
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                target="_blank" // This will open the link in a new tab
                rel="noopener noreferrer" // Security best practice when using target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Doctors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Medicine Suggestion
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Hospital Suggestion
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Book Ambulance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  SOS Alert
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Health Insurance
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                >
                  Medical Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">Bhopal Madhya Pradesh</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (800) HEALTH-1</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">support@rapidaid.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} RapidAid. All rights reserved.
          </p>
          <div className="mt-2 space-x-4 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
