import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import * as OTPAuth from "otpauth";
import { QRCodeSVG } from "qrcode.react";
import { Turnstile } from "@marsidev/react-turnstile";
import Swal from 'sweetalert2';

const Mfa_google = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [secret, setSecret] = useState("");
    const [otpURL, setOtpURL] = useState("");
    const [token, setToken] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState(null);
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

    useEffect(() => {
        if (!location.state?.email || !sessionStorage.getItem('tempUserId')) {
            navigate('/login', { replace: true });
            return;
        }

        const timestamp = location.state?.timestamp;
        if (!timestamp || (Date.now() - timestamp) > 300000) {
            navigate('/login', { replace: true });
            return;
        }

        const secret = OTPAuth.Secret.generate();
        setSecret(secret.base32);

        const otpAuth = new OTPAuth.TOTP({
            issuer: "SuvidhaPay",
            label: location.state.email,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret.base32
        });

        setOtpURL(otpAuth.toString());
    }, [location.state, navigate]);

    const verifyOTP = async () => {
        if (!token) {
            setError("Please enter the verification code");
            return;
        }

        try {
            const totp = new OTPAuth.TOTP({
                issuer: "SuvidhaPay",
                label: location.state.email,
                algorithm: "SHA1",
                digits: 6,
                period: 30,
                secret: secret
            });

            const delta = totp.validate({ token });

            if (delta !== null) {
                setIsVerified(true);

                const userId = sessionStorage.getItem('tempUserId');
                const email = sessionStorage.getItem('tempEmail');
                const name = sessionStorage.getItem('tempName');

                localStorage.setItem('userId', userId);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', name);

                sessionStorage.removeItem('tempUserId');
                sessionStorage.removeItem('tempEmail');
                sessionStorage.removeItem('tempName');

                await Swal.fire({
                    icon: 'success',
                    title: 'Authentication Successful',
                    text: 'Welcome to SuvidhaPay!',
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate('/dashboard', { replace: true });
            } else {
                throw new Error("Invalid verification code");
            }
        } catch (error) {
            setError(error.message);
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.message
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-200">
            {location.state?.email ? (
                <div className="w-96 rounded-3xl shadow-lg p-8 bg-white">
                    <Link
                        to="/login"
                        className="mb-6 inline-flex items-center px-4 py-2 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                        <span className="mr-2">←</span> Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-gray-800">
                            Two-Factor Auth
                        </h1>
                        <p className="text-sm text-gray-600">
                            Step 2/2 - Google Authenticator
                        </p>
                    </div>

                    {secret && (
                        <div className="text-center mb-6">
                            <p className="text-sm text-gray-600 mb-4">
                                Scan this QR code with your Google Authenticator app
                            </p>
                            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                                <QRCodeSVG value={otpURL} size={200} />
                            </div>
                            <p className="mt-4 text-xs text-gray-500 break-words">
                                Or enter this code manually: {secret}
                            </p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter 6-digit verification code
                            </label>
                            <input
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-900"
                                maxLength="6"
                            />
                        </div>

                        <div className="flex justify-center">
                            <Turnstile siteKey={siteKey} />
                        </div>

                        <button
                            onClick={verifyOTP}
                            className="w-full py-2 rounded-lg text-white font-medium transition-colors bg-blue-600 hover:bg-blue-700"
                        >
                            Verify & Continue
                        </button>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Invalid access. Please log in first.</p>
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Go to Login
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Mfa_google;
