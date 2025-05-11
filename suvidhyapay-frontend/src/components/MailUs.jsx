import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from 'react-toastify';

const MailUs = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // EmailJS credentials
  const SERVICE_ID = "service_7yusury";
  const TEMPLATE_ID = "template_g3bkrml";
  const USER_ID = "MuVxvwd1td-HnO_tc";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const templateParams = {
        to_name: "Admin",
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
      setStatus("Email sent successfully!");
      setShowPopup(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("Failed to send email.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2" htmlFor="name">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2" htmlFor="phone">
              Your Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700 mb-2" htmlFor="email">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50"
              rows="4"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Send Message
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-center font-medium ${
            status.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}>
            {status}
          </p>
        )}

        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Success!</h3>
              <p className="mb-4 text-gray-600">Your message has been successfully sent to the admin.</p>
              <button
                onClick={closePopup}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailUs;
