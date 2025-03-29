import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Transform Your Home with Premium Textiles
          </h1>
          <p className={styles.subtitle}>
            Discover our collection of luxurious bedsheets, towels, floor mats,
            and pillow covers crafted with the finest materials for your
            comfort.
          </p>
          <div className={styles.buttons}>
            <Link to="/products" className={styles.primaryButton}>
              Shop Collection
            </Link>
            <Link to="/about" className={styles.secondaryButton}>
              Learn More
            </Link>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img
            src="hero.jpg"
            alt="Luxurious bedroom with premium bedsheets and pillows"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
