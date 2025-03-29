import React from "react";
import styles from "./About.module.css";

const About = () => {
    return (
        <section id="about" className={styles.aboutSection}>
            <h1 className={styles.aboutHeader}>About</h1>
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <img src="logo.png" alt="About Us" className={styles.aboutImage} />
                </div>

                <div className={styles.textContainer}>
                    <h2 className={styles.heading}>Who We Are</h2>
                    <p className={styles.description}>
                        We are passionate about providing high-quality handloom products crafted with tradition and love.
                        Our journey started with a vision to bring authenticity and elegance into every home.
                        Join us in celebrating the beauty of craftsmanship.
                    </p>
                    <p className={styles.highlightText}>
                        "Bringing Culture, Elegance, and Tradition Together."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
