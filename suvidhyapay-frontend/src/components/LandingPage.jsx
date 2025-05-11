import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaChartLine, FaArrowRight, FaMobileAlt,FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaLinkedin } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';
import { motion } from 'framer-motion';

const LandingPage = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    return () => {
      const elements = document.querySelectorAll('button, a');
      elements.forEach(element => {
        element.removeEventListener('click', null);
      });
    };
  }, []);

  const handleError = (error) => {
    console.error('Error in LandingPage:', error);
    toast.error('Something went wrong. Please try again.');
  };

  const handleNavigation = (path) => {
    try {
      navigate(path);
    } catch (error) {
      handleError(error);
    }
  };

  // Update image URLs with reliable sources
  const defaultLogo = 'https://cdn3.iconfinder.com/data/icons/payment-method-1/64/_Payment_Gateway-512.png';
  const defaultHeroImage = 'https://img.freepik.com/free-vector/digital-payment-abstract-concept-illustration_335657-3903.jpg';

  const fallbackLogo = 'https://cdn4.iconfinder.com/data/icons/payment-method/160/payment_method_digital_wallet-512.png';
  const fallbackHeroImage = 'https://img.freepik.com/free-vector/banking-payment-realistic-composition_1284-24279.jpg';

  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "Bank-grade security for all your transactions",
    },
    {
      icon: <FaBolt className="w-6 h-6" />,
      title: "Instant Transfers",
      description: "Send money instantly to anyone, anywhere",
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Track your spending with detailed insights",
    },
    {
      icon: <FaMobileAlt className="w-6 h-6" />,
      title: "Real-time Notifications",
      description: "Stay updated with instant payment alerts",
    },
  ];

  const testimonials = [
    
    {
      name: 'Rajiv Nair',
      role: 'Marketer',
      content: 'Their customer support is top-notch.',
      image: 'https://i.pravatar.cc/100?img=7',
    },
    {
      name: 'David Jones',
      role: 'Photographer',
      content: 'Its fast, secure, and very easy to use!',
      image: 'https://i.pravatar.cc/100?img=8',
    },
    {
      name: 'Twinkle Sony',
      role: 'Consultant',
      content: 'This has simplified my payment process.',
      image: 'https://i.pravatar.cc/100?img=9',
    },
  ];

  const statistics = [
    { value: "10+", label: "Active Users" },
    { value: "1", label: "Countries Served" },
    { value: "95%", label: "Uptime" },
    { value: "24/7", label: "Support" },
  ];

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const CustomArrow = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 transform -translate-y-1/2 ${
        direction === 'left' ? 'left-0 -ml-6' : 'right-0 -mr-6'
      } z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all`}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
    >
      {direction === 'left' ? <FaChevronLeft size={20} /> : <FaChevronRight size={20} />}
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleGetStarted = () => {
    handleNavigation(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <ErrorBoundary onError={handleError}>
      <div className="relative bg-white">
        <ToastContainer />
        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white shadow-md transition-transform duration-300">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-2">
           
                <div className="text-2xl font-bold text-blue-700">SuvidhaPay</div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600">
                  Testimonials
                </a>
                <a href="#team" className="text-gray-600 hover:text-blue-600">
                  Our Team
                </a>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <button
                  onClick={handleGetStarted}
                  className="py-2 px-4 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
                  {isAuthenticated ? 'Dashboard' : 'Get Started'}
                </button>
              </div>

              {/* Desktop Get Started Button */}
              <button
                onClick={handleGetStarted}
                className="hidden md:block py-3 px-7 text-base font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition"
              >
                {isAuthenticated ? 'Dashboard' : 'Get Started'}
              </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100">
                <nav className="flex flex-col space-y-4">
                  <a 
                    href="#features" 
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#testimonials" 
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Testimonials
                  </a>
                  <a 
                    href="#team" 
                    className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Our Team
                  </a>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              {/* Left side content */}
              <div className="flex-1 text-left">
                <motion.h1
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mb-6 text-4xl font-bold leading-tight md:text-6xl lg:text-7xl text-gray-900"
                >
                  Next-Gen Digital <span className="text-blue-600">Payment</span> Solutions
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-9 text-xl md:text-2xl text-gray-600"
                >
                  Experience lightning-fast, secure, and seamless transactions with SuvidhaPay. 
                  Join millions of users who trust us for their daily payment needs. 🚀
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center py-4 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    Get Started <FaArrowRight className="ml-2" />
                  </button>
                  <button
                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center py-4 px-8 text-base font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    Learn More
                  </button>
                </motion.div>
              </div>
              
              {/* Right side image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex-1 max-w-[500px]"
              >
                <img
                  src={defaultHeroImage}
                  alt="Digital Payment Solutions"
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                  onError={(e) => {
                    if (e.target.src !== fallbackHeroImage) {
                      e.target.src = fallbackHeroImage;
                    }
                  }}
                  loading="eager" // Add eager loading for above-the-fold content
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Add Statistics Section after Hero */}
        <section className="py-16 bg-blue-600">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add CTA Section before Footer */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="container px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Payment Experience?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join millions of satisfied users who trust SuvidhaPay for their payment needs.
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center py-4 px-8 text-base font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-lg transition"
              >
                Start Now <FaArrowRight className="ml-2" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="relative px-8">
              <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="p-6">
                    <div className="p-6 bg-white rounded-xl shadow-sm">
                      <p className="mb-4 text-gray-600">{testimonial.content}</p>
                      <div className="flex items-center">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </section>

        {/* Add Team Section before Mail Us */}
        <section id="team" className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're a dedicated group of professionals committed to revolutionizing
                digital payments and providing the best service to our users.
              </p>
            </motion.div>

            {/* Team Members Grid */}
            <div className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    name: "V Roshan Sai",
                    role: "Team Lead",
                    linkedin: "https://www.linkedin.com/in/roshan-anantha-sai-vasani-572b11291/",
                    description: "Experienced team leader with expertise in fintech solutions.",
                  },
                  {
                    name: "K R S Nammalwar",
                    role: "Frontend Developer",
                    linkedin: "https://www.linkedin.com/in/nammalwar-raja-sai/",
                    description: "Passionate about creating intuitive user interfaces.",
                  },
                  {
                    name: "Sai Varshith G",
                    role: "Backend Developer",
                    linkedin: "http://www.linkedin.com/in/sai-varshith-9466a8281",
                    description: "Specialized in scalable backend architecture.",
                  },
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="relative mb-4">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-32 h-32 rounded-full mx-auto object-cover"
                          onError={(e) => {
                            if (e.target.src !== member.fallbackImage) {
                              e.target.src = member.fallbackImage;
                            }
                          }}
                          loading="lazy" // Add lazy loading for below-the-fold content
                        />
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-0 right-1/3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          <FaLinkedin size={20} />
                        </a>
                      </div>
                      <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 text-center mb-3">{member.role}</p>
                      <p className="text-gray-600 text-center">{member.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-blue-600 py-16 rounded-lg">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-white mb-12"
                >
                  <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                  <p className="max-w-2xl mx-auto">
                    We believe in innovation, integrity, and putting our customers first.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {[
                    {
                      title: "Innovation",
                      description:
                        "Constantly pushing boundaries to deliver cutting-edge solutions",
                    },
                    {
                      title: "Integrity",
                      description:
                        "Building trust through transparent and ethical practices",
                    },
                    {
                      title: "Customer Focus",
                      description:
                        "Dedicated to providing exceptional service and support",
                    },
                  ].map((value, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white/10 rounded-lg p-6 text-white text-center"
                    >
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-blue-100">{value.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

// Add Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10">
          <h1>Something went wrong.</h1>
          <button onClick={() => window.location.reload()} className="mt-4 text-blue-600">
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LandingPage;