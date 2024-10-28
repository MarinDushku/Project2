import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Homepage.css';

const Homepage = () => {
  useEffect(() => {
    // Smooth scroll function
    const handleScroll = (e, section) => {
      e.preventDefault();
      const targetSection = document.querySelector(section);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    });

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach((section) => observer.observe(section));

    // Event listeners for smooth scrolling
    document.querySelector('a[href="#about"]').addEventListener('click', (e) => handleScroll(e, '.about-us'));
    document.querySelector('a[href="#contact"]').addEventListener('click', (e) => handleScroll(e, '.contact-us'));
    document.querySelector('a[href="#featured"]').addEventListener('click', (e) => handleScroll(e, '.featured-products'));
  }, []);

  return (
    
    <div className="Homepage">
   
      {/* Header Section */}
      <header className="Homepage-header fade-in-section">
        <div className="logo-container">
          <h1>MyShop</h1>
        </div>
        <nav className="navigation">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#featured">Featured</a></li> {/* Added Featured Section Link */}
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login"><button className="get-started-btn">Get Started</button></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero fade-in-section">
        <div className="hero-content">
          <h1>Discover Amazing Products</h1>
          <p>Your one-stop destination for everything you need.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/600x400" alt="Shopping" />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products fade-in-section">
        <h2>Featured Products</h2>
        <div className="product-list">
          <div className="product-item">
            <img src="https://via.placeholder.com/200" alt="Product 1" />
            <p>Product 1</p>
            <span>$29.99</span>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/200" alt="Product 2" />
            <p>Product 2</p>
            <span>$49.99</span>
          </div>
          <div className="product-item">
            <img src="https://via.placeholder.com/200" alt="Product 3" />
            <p>Product 3</p>
            <span>$19.99</span>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us fade-in-section">
        <h2>How MyShop Works</h2>
        <p className="about-description">
          Welcome to MyShop! We’ve designed our platform to connect buyers with trusted sellers, offering an easy and secure online shopping experience.
          <span className="highlight">Here’s how it works:</span>
        </p>
        <ul className="about-list">
          <li>Sign up as a user or a store owner to get started.</li>
          <li>Users can browse various stores, discover exciting products, and add items to their cart.</li>
          <li>Store owners can easily create and manage their stores, add items, and track sales.</li>
          <li>Admins oversee the platform, ensuring that both users and store owners have a smooth experience.</li>
          <li>Once you find something you love, purchase the item securely through our platform.</li>
        </ul>
        <p className="about-description">
          MyShop is all about making online shopping simple, reliable, and fun. Whether you’re here to buy or sell, we’ve got you covered!
        </p>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us fade-in-section">
        <div className="contact-us-content">
          <h2>Contact Us</h2>
          <p>Have questions or need assistance? We're here to help! Feel free to reach out to us using the information below, and a member of our team will be happy to assist you.</p>
          <p><strong>Email:</strong> support@myshop.com</p>
          <p><strong>Phone:</strong> (123) 456-7890</p>
          <p><strong>Office Hours:</strong> Monday - Friday, 9 AM - 6 PM (PST)</p>
        </div>
        <div className="contact-form-container">
          <h3>Send us a Message</h3>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="send-message-btn">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
