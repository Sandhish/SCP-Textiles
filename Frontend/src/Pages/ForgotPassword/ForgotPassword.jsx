import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { sendOTP, verifyOTP, updatePassword } from '../../Services/authService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isAnimating, setIsAnimating] = useState(false);
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const startResendTimer = () => {
        setCanResend(false);
        setTimer(60);

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(intervalRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    const nextStep = () => {
        setIsAnimating(true);
        setError('');
        setTimeout(() => {
            setCurrentStep(currentStep + 1);
            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }, 300);
    };

    const prevStep = () => {
        setIsAnimating(true);
        setError('');
        setTimeout(() => {
            setCurrentStep(currentStep - 1);
            setTimeout(() => {
                setIsAnimating(false);
            }, 50);
        }, 300);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (error) setError('');

            if (value !== '' && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
        if (error) setError('');
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await sendOTP(email);
            console.log('OTP sent successfully:', response);
            startResendTimer();
            nextStep();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (canResend) {
            setResendLoading(true);
            setError('');

            try {
                await sendOTP(email);
                startResendTimer();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
            } finally {
                setResendLoading(false);
            }
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyOTP(email, otpValue);
            nextStep();
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwords.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const otpValue = otp.join('');
            await updatePassword(email, otpValue, passwords.password);

            alert('Password has been reset successfully!');
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const renderEmailForm = () => (
        <form onSubmit={handleSubmitEmail} className={`${styles.form} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} className={styles.input}
                    required placeholder="Enter your registered email" />
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading} >
                {loading ? 'Processing...' : 'Send OTP'}
            </button>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.backLink}>
                <button type="button" onClick={() => navigate('/login')} className={styles.toggleLink}>
                    Back to Login
                </button>
            </div>
        </form>
    );

    const renderOtpForm = () => (
        <form onSubmit={handleVerifyOtp} className={`${styles.form} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.otpContainer}>
                <label className={styles.label}>Enter 6-digit OTP sent to {email}</label>
                <div className={styles.otpInputs}>
                    {otp.map((digit, index) => (
                        <input key={index} id={`otp-${index}`} type="text" maxLength="1" value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)} className={styles.otpInput} required />
                    ))}
                </div>
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading} >
                {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className={styles.resendContainer}>
                {timer > 0 ? (
                    <span>Resend OTP in {formatTime(timer)}</span>
                ) : (
                    <>
                        <span>Didn't receive OTP? </span>
                        <button type="button" className={`${styles.toggleLink} ${!canResend || resendLoading ? styles.disabledLink : ''}`}
                            onClick={handleResendOtp} disabled={!canResend || resendLoading} >
                            {resendLoading ? 'Sending...' : 'Resend'}
                        </button>
                    </>
                )}
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.backLink}>
                <button type="button" onClick={prevStep} className={styles.toggleLink} disabled={loading || resendLoading}>
                    Back
                </button>
            </div>
        </form>
    );

    const renderResetForm = () => (
        <form onSubmit={handleResetPassword} className={`${styles.form} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>New Password</label>
                <input type="password" id="password" name="password" value={passwords.password} onChange={handlePasswordChange}
                    className={styles.input} required placeholder="Enter new password" />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={passwords.confirmPassword}
                    onChange={handlePasswordChange} className={styles.input} required placeholder="Confirm new password" />
            </div>
            <button type="submit" className={styles.submitButton} disabled={loading} >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.backLink}>
                <button type="button" onClick={prevStep} className={styles.toggleLink} disabled={loading}>
                    Back
                </button>
            </div>
        </form>
    );

    const getHeaderContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "Forgot Your Password?",
                    subtitle: "Enter your email to receive a one-time password"
                };
            case 2:
                return {
                    title: "Verify OTP",
                    subtitle: "Enter the 6-digit code sent to your email"
                };
            case 3:
                return {
                    title: "Reset Password",
                    subtitle: "Create a new secure password"
                };
            default:
                return {
                    title: "Forgot Password",
                    subtitle: "Follow the steps to reset your password"
                };
        }
    };

    const renderProgressIndicator = () => (
        <div className={styles.progressContainer}>
            <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.activeStep : ''}`}>1</div>
            <div className={`${styles.progressLine} ${currentStep >= 2 ? styles.activeLine : ''}`}></div>
            <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.activeStep : ''}`}>2</div>
            <div className={`${styles.progressLine} ${currentStep >= 3 ? styles.activeLine : ''}`}></div>
            <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.activeStep : ''}`}>3</div>
        </div>
    );

    const { title, subtitle } = getHeaderContent();

    return (
        <div className={styles.container}>
            <div className={styles.forgotPasswordContainer}>
                <div className={styles.formWrapper}>
                    <div className={`${styles.headerSection} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </div>

                    {renderProgressIndicator()}

                    {currentStep === 1 && renderEmailForm()}
                    {currentStep === 2 && renderOtpForm()}
                    {currentStep === 3 && renderResetForm()}
                </div>

                <div className={styles.imageSection}>
                    <div className={styles.imageContent}>
                        <h2>Account Recovery</h2>
                        <p>We'll help you get back to exploring our premium home textiles</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;