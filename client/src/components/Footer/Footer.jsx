import React, { useContext } from "react";
import { MovieContext } from "../../Context/MovieContext";
import { FaGithub, FaWhatsapp, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <p>© MoviePoint | Developed by Vardhan Sinh</p>
        </div>

        <div className="footer-socials">
          <a
            href="https://github.com/vardhan781"
            target="_blank"
            rel="noreferrer"
          >
            <FaGithub size={20} />
          </a>
          <a href="https://wa.me/9725312744" target="_blank" rel="noreferrer">
            <FaWhatsapp size={20} />
          </a>
          <a
            href="https://instagram.com/vardhan_sinh_16"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
