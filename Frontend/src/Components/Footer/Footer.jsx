import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn, FaPinterest, FaYoutube, FaEnvelope } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <h2 className={styles.logo}><code>SCP Textile</code></h2>
                    <div className={styles.socialIcons}>
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaXTwitter /></a>
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaPinterest /></a>
                        <a href="#"><FaYoutube /></a>
                    </div>
                </div>

                <div className={styles.middleSection}>
                    <div className={styles.column}>
                        <h4>Features</h4>
                        <ul>
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Products</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Cancellation & Refund</a></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Nearby Services</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h4>Contact</h4>
                        <p className={styles.address}>
                            76-A, Myladi <br />
                            Gnanipalayam(PO), <br />
                            Vellode, Erode-638112, <br />
                            TamilNadu, India
                        </p>
                        <p className={`${styles.contactNumber} ${styles.address}`}>96006 16125</p>
                        <p className={`${styles.contactEmail} ${styles.address}`}>info@scptextile.com</p>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <h4><FaEnvelope /> Stay connected with Us!</h4>
                    <div className={styles.newsletter}>
                        <input type="email" placeholder="Enter your e-mail" />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
