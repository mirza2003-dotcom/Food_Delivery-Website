import {useEffect, useState, useRef} from 'react';
import { createPortal } from 'react-dom'
import { useAuth } from '../../../context/AuthContext';

import closeBtn from '/images/closeBtn.jpg';

import css from './EnterOTP.module.css'

let EnterOTP = ({setModal, setAuth = () => {}, phone, devOTP}) => {
    const { verifyOTP, sendOTP } = useAuth();
    let [count, setCount] = useState(60);
    let [otp, setOtp] = useState(['', '', '', '', '', '']);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState('');
    const inputRefs = useRef([]);

    // Auto-fill OTP in development mode
    useEffect(() => {
        if (devOTP && process.env.NODE_ENV === 'development') {
            const otpArray = devOTP.toString().split('');
            setOtp(otpArray);
        }
    }, [devOTP]);

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const loginHandler = async () => {
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        if (!phone) {
            setError('Phone number is missing. Please try again.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyOTP(phone, otpCode);
            setModal(false); 
            setAuth(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!phone) {
            setError('Phone number is missing. Please try again.');
            return;
        }

        try {
            await sendOTP(phone);
            setCount(60);
            setOtp(['', '', '', '', '', '']);
            setError('');
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
        }
    };

    useEffect(()=>{
        if (!count) return;

        let interval = setInterval(()=>{
            if(count > 0){
                setCount(val => val - 1);
            }
        }, [1000])
    
        return () => clearInterval(interval);

    }, [count])

    const domObj = <div className={css.outerDiv}>
        <div className={css.innerDiv}>
            <div className={css.header}>
                <div className={css.title}>Enter OTP</div>
                <span className={css.closeBtn} onClick={() => setModal(false)}>
                    <img className={css.closeBtnImg} src={closeBtn} alt="close button" />
                </span>
            </div>
            <div className={css.body}>
                <div className={css.txt1}>OTP sent to {phone}</div>
                {devOTP && <div style={{color: '#4CAF50', marginBottom: '10px', fontSize: '12px'}}>Development OTP: {devOTP}</div>}
                {error && <div style={{color: 'red', marginBottom: '10px', fontSize: '14px'}}>{error}</div>}
                <div className={css.OTPBox}>
                    {otp.map((digit, index) => (
                        <div key={index} className={css.otpNumBox}>
                            <input 
                                ref={el => inputRefs.current[index] = el}
                                className={css.inpBox} 
                                type="text" 
                                maxLength="1" 
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                disabled={loading}
                            />
                        </div>
                    ))}
                </div>
                <div 
                    onClick={loginHandler} 
                    className={css.okBtn}
                    style={{opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer'}}
                >
                    {loading ? 'Verifying...' : 'OK'}
                </div>
                <div className={css.footerBox}>
                    <div className={css.time}>Time: {count}s</div>
                    <div className={css.footerTxt}>Didn't receive OTP? <span 
                        className={css.resendTxt} 
                        onClick={count === 0 ? handleResendOTP : undefined}
                        style={{opacity: count === 0 ? 1 : 0.5, cursor: count === 0 ? 'pointer' : 'not-allowed'}}
                    >Resend Now</span></div>
                </div>
            </div>
        </div>
    </div>

    return createPortal(domObj, document.getElementById('modal'));
}

export default EnterOTP;