import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';

import gLogo from '/images/google.png';
import mailLogo from '/images/emailIcon.jpg';
import closeBtn from '/images/closeBtn.jpg';

import signupCss from './Signup.module.css';

let Signup = ({ setAuth }) => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        acceptTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('All fields are required');
            return;
        }

        if (!formData.acceptTerms) {
            setError('Please accept terms and conditions');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });
            setAuth({ closed: true, login: false, signup: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    let loginDiv = <div className={signupCss.outerDiv}>
        <div className={signupCss.modal}>
            <div className={signupCss.header}>
                <span className={signupCss.ttl}>Signup</span>
                <span className={signupCss.closeBtn} onClick={() => setAuth({ closed: true, login: false, signup: false })}>
                    <img className={signupCss.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>
            <form className={signupCss.lgBox} onSubmit={handleSubmit}>
                {error && <div style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{error}</div>}
                <input 
                    className={signupCss.inpBox} 
                    type="text" 
                    name="name"
                    placeholder='Full Name ...' 
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                />
                <input 
                    className={signupCss.inpBox} 
                    type="email" 
                    name="email"
                    placeholder='Email ...' 
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                />
                <input 
                    className={signupCss.inpBox} 
                    type="tel" 
                    name="phone"
                    placeholder='Phone Number ...' 
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                />
                <input 
                    className={signupCss.inpBox} 
                    type="password" 
                    name="password"
                    placeholder='Password ...' 
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                />
                <span className={signupCss.termsTxt}>
                    <input 
                        type="checkbox" 
                        name="acceptTerms" 
                        id="accpect" 
                        className={signupCss.checkBox} 
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <span>
                        I agree to Zomato's <a href="" className={signupCss.termaAnchor}>Terms of Service, Privacy Policy</a> and <a href="" className={signupCss.termaAnchor}>Content Policies</a>
                    </span>
                </span>
                <button 
                    className={signupCss.btn} 
                    type="submit"
                    disabled={loading}
                    style={{opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <div className={signupCss.orBreak}><span className={signupCss.orBreakText}>or</span></div>
            <div className={signupCss.socialSignupBox}>
                <img className={signupCss.icon} src={gLogo} alt="google login" />
                Continue with Google
            </div>
            <hr className={signupCss.break} />
            <div className={signupCss.newToZomato}>Already have an account? <div className={signupCss.createAcc} onClick={() => setAuth({ closed: false, login: true, signup: false })} >Log in</div></div>
        </div>
    </div>
    return createPortal(loginDiv, document.getElementById('modal'));
}

export default Signup;