import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp as apiVerifyOtp } from '../services/api';
import { auth, signInWithPhoneNumber, initRecaptcha } from '../services/firebase';

const Login = () => {
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 = Mobile, 2 = OTP
    const [loading, setLoading] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Init invisible recaptcha on mount
        initRecaptcha('sign-in-button');
    }, []);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formattedMobile = mobile.startsWith('+') ? mobile : `+91${mobile}`; // Default to India

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formattedMobile, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
            alert('OTP Sent via Firebase!');
        } catch (error) {
            console.error("Firebase Auth Error:", error);
            alert('Failed to send OTP: ' + error.message);
            // Reset recaptcha
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.render().then(widgetId => {
                    window.grecaptcha.reset(widgetId);
                });
            }
        } finally {
            setLoading(false);
        }
    };

   const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!confirmationResult) {
    alert("Please request OTP again");
    setStep(1);
    setLoading(false); // ✅ important
    return;
  }

  try {
    // Format mobile again (safe & consistent)
    const formattedMobile = mobile.startsWith('+')
      ? mobile
      : `+91${mobile}`;

    // 1. Verify OTP with Firebase
    const result = await confirmationResult.confirm(otp);
    const user = result.user;
    const idToken = await user.getIdToken();

    console.log("Firebase Verified. ID Token:", idToken);

    // 2. Send Firebase token to backend for JWT
    const res = await apiVerifyOtp(formattedMobile, idToken);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    navigate('/app');
  } catch (err) {
    console.error(err);
    alert('Invalid OTP or Server Error');
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login to Transporter</h2>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="tel"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="9876543210"
                            />
                        </div>
                        {/* Invisible Recaptcha Button Anchor */}
                        <div id="sign-in-button"></div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                        >
                            {loading ? 'Sending...' : 'Get OTP'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="123456"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
