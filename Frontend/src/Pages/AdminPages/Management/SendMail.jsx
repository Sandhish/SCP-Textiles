import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import styles from './Management.module.css';

const SendMail = () => {
    const [mailData, setMailData] = useState({
        to: '',
        subject: '',
        body: ''
    });

    const [sendStatus, setSendStatus] = useState({
        sending: false,
        success: false,
        error: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMailData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSendStatus({ sending: true, success: false, error: false });

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            setSendStatus({ sending: false, success: true, error: false });
            setMailData({ to: '', subject: '', body: '' });

            setTimeout(() => {
                setSendStatus(prev => ({ ...prev, success: false }));
            }, 5000);
        } catch (error) {
            setSendStatus({ sending: false, success: false, error: true });

            setTimeout(() => {
                setSendStatus(prev => ({ ...prev, error: false }));
            }, 5000);
        }
    };

    return (
        <div className={styles.managementContainer}>
            <div className={styles.formContainer}>
                <h2 className={styles.pageTitle}>
                    <Mail size={24} style={{ marginRight: '10px' }} />
                    Send Email
                </h2>

                {sendStatus.success && (
                    <div className={styles.mailSuccessMessage}>
                        <CheckCircle size={20} />
                        Email sent successfully!
                    </div>
                )}

                {sendStatus.error && (
                    <div className={styles.mailErrorMessage}>
                        <AlertCircle size={20} />
                        Failed to send email. Please try again.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="to" className={styles.formLabel}>To</label>
                        <input
                            type="email"
                            id="to"
                            name="to"
                            value={mailData.to}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                            placeholder="recipient@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={mailData.subject}
                            onChange={handleInputChange}
                            className={styles.formInput}
                            required
                            placeholder="Enter email subject"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="body" className={styles.formLabel}>Message</label>
                        <textarea
                            id="body"
                            name="body"
                            value={mailData.body}
                            onChange={handleInputChange}
                            className={styles.formTextarea}
                            required
                            placeholder="Type your message here..."
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.formSubmitButton}
                        disabled={sendStatus.sending}
                    >
                        {sendStatus.sending ? 'Sending...' : 'Send Email'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendMail;