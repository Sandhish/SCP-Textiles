import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginSignup.module.css';
import { login, signup } from '../../Services/authService';
import { useAuth } from '../../Context/AuthContext';

const LoginSignup = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { email, password } = formData;
        const response = await login({ email, password });

        auth.login(response.user);

        navigate('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { name, email, password } = formData;
        const response = await signup({ name, email, password });

        auth.login(response.user);

        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsAnimating(true);
    setError('');
    setTimeout(() => {
      setIsLogin(!isLogin);
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginSignupContainer}>
        <div className={styles.formWrapper}>
          <div className={`${styles.headerSection} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLogin ? 'Sign in to access your account' : 'Join us for cozy home textiles'}</p>
          </div>

          <div className={styles.tabs}>
            <button className={`${styles.tabButton} ${isLogin ? styles.activeTab : ''}`} onClick={() => isLogin ? null : toggleForm()} >
              Login
            </button>
            <button className={`${styles.tabButton} ${!isLogin ? styles.activeTab : ''}`} onClick={() => !isLogin ? null : toggleForm()} >
              Sign Up
            </button>
          </div>


          <form onSubmit={handleSubmit} className={`${styles.form} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
            {!isLogin && (
              <div className={`${styles.formGroup} ${styles.slideDown}`}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                  className={styles.input} required />
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className={styles.input} required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                className={styles.input} required />
            </div>

            {!isLogin && (
              <div className={`${styles.formGroup} ${styles.slideDown}`}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} className={styles.input} required />
              </div>
            )}

            {isLogin && (
              <div className={styles.forgotPassword}>
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            )}

            {error && <div className={styles.errorMessage}>{error}</div>}

            <button type="submit" className={styles.submitButton} disabled={loading} >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>

            <div className={styles.togglePrompt}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleForm} className={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageContent}>
            <h2>Premium Home Textiles</h2>
            <p>Discover comfort and elegance for your home</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;