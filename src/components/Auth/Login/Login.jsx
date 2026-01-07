import {useState} from "react";
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';

import gLogo from '/images/google.png';
import mailLogo from '/images/emailIcon.jpg';
import closeBtn from '/images/closeBtn.jpg';

import loginCss from './Login.module.css';

import EnterOTP from '../../Auth/EnterOTP/EnterOTP'

let Login = ({ setAuth }) => {
    const { login, sendOTP } = useAuth();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [devOTP, setDevOTP] = useState(null); // Store OTP in dev mode

    let [otpModal, setOTPModal] = useState(false)

    const handleSendOTP = async () => {
        if (phone?.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await sendOTP(phone, email);
            if (result.success) {
                setDevOTP(result.otp); // Store OTP for development
                setOTPModal(true);
                // Show OTP in console for development
                if (result.otp) {
                    console.log('🔐 Development OTP:', result.otp);
                }
            } else {
                setError(result.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await login(email, password);
            if (result.success) {
                setAuth({ closed: true, login: false, signup: false });
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    let loginDiv = !otpModal ? <div className={loginCss.outerDiv}>
        <div className={loginCss.modal}>
            <div className={loginCss.header}>
                <span className={loginCss.ttl}>Login</span>
                <span className={loginCss.closeBtn} onClick={() => setAuth({ closed: true, login: false, signup: false })}>
                    <img className={loginCss.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>

            {error && <div style={{color: 'red', padding: '10px', textAlign: 'center', fontSize: '14px'}}>{error}</div>}

            {loginMethod === 'phone' ? (
                <div className={loginCss.lgBox}>
                    <input 
                        className={loginCss.phoneInp} 
                        type="tel" 
                        placeholder='Phone number ...' 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} 
                        maxLength="10"
                    />
                    <button  
                        className={phone?.length === 10 ? [loginCss.btn, loginCss.Sbtn].join(" ") : loginCss.btn} 
                        onClick={handleSendOTP}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            ) : (
                <div className={loginCss.lgBox}>
                    <input 
                        className={loginCss.phoneInp} 
                        type="email" 
                        placeholder='Email ...' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{marginBottom: '10px'}}
                    />
                    <input 
                        className={loginCss.phoneInp} 
                        type="password" 
                        placeholder='Password ...' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button  
                        className={email && password ? [loginCss.btn, loginCss.Sbtn].join(" ") : loginCss.btn} 
                        onClick={handleEmailLogin}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            )}

            <div className={loginCss.orBreak}><span className={loginCss.orBreakText}>or</span></div>
            <div 
                className={loginCss.socialSignupBox} 
                onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
                style={{cursor: 'pointer'}}
            >
                <img className={loginCss.icon} src={mailLogo} alt="email signup" />
                {loginMethod === 'phone' ? 'Continue with Email' : 'Continue with Phone'}
            </div>
            <div className={loginCss.socialSignupBox} style={{opacity: 0.5, cursor: 'not-allowed'}}>
                <img className={loginCss.icon} src={gLogo} alt="google signup" />
                Continue with Google (Coming Soon)
            </div>
            <hr className={loginCss.break} />
            <div className={loginCss.newToZomato}>New to Zomato? <div className={loginCss.createAcc} onClick={() => setAuth({ closed: false, login: false, signup: true })}>Create Account</div></div>
        </div>
    </div> :  <EnterOTP phone={phone} devOTP={devOTP} setModal={setOTPModal} setAuth={setAuth} />
    return createPortal(loginDiv, document.getElementById('modal'));
}

export default Login;