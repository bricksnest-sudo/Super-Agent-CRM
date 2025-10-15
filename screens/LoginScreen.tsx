import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Icon } from '../components/common/Icon';

export const LoginScreen: React.FC = () => {
    const { login, signup } = useAppContext();
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

    // Login state
    const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('raj.sharma@superagent.com');
    const [loginPassword, setLoginPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Signup state
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    
    // Forgot Password state
    const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
    const [recoveryMessage, setRecoveryMessage] = useState('');


    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setRecoveryMessage('');
        setIsLoading(true);

        setTimeout(() => {
            const success = login(loginEmailOrPhone, loginPassword);
            if (!success) {
                setError('Invalid credentials. Please try again.');
            }
            setIsLoading(false);
        }, 1000);
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setRecoveryMessage('');
        
        if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
            setError('All fields are required.');
            return;
        }
        if (signupPassword !== signupConfirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            signup({
                name: signupName,
                email: signupEmail,
                phone: signupPhone,
                pass: signupPassword,
            });
            // No need to setIsLoading(false) as the component will unmount on success
        }, 1000);
    };

    const handleRecovery = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setRecoveryMessage('');
        if (!recoveryIdentifier.trim()) {
            setError('Please enter your email or phone number.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setRecoveryMessage('If an account exists for that identifier, a recovery link has been sent.');
            setIsLoading(false);
            setRecoveryIdentifier(''); // Clear the input on success
        }, 1500);
    }

    const commonInputClass = "mt-1 block w-full p-3 border rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary";

    const getTitle = () => {
        if (view === 'login') return 'Welcome back!';
        if (view === 'signup') return 'Create your account';
        if (view === 'forgot') return 'Recover Account';
        return '';
    }

    const getSubtitle = () => {
        if (view === 'login') return 'Please login to your account.';
        if (view === 'signup') return 'Get started with Super Agent CRM.';
        if (view === 'forgot') return 'Enter your email or phone to get a reset link.';
        return '';
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center mb-8">
                    <Icon path="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zM15 6.75h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75zm.75 2.25h.75v.75h-.75v-.75zm-.75 2.25h.75v.75h-.75v-.75z" className="w-12 h-12 mx-auto text-primary" />
                    <h1 className="text-3xl font-bold text-gray-800 mt-2">{getTitle()}</h1>
                    <p className="text-gray-500">{getSubtitle()}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md">
                    {view === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">Email or Phone</label>
                                <input id="emailOrPhone" type="text" value={loginEmailOrPhone} onChange={(e) => setLoginEmailOrPhone(e.target.value)} className={commonInputClass} placeholder="you@example.com" autoComplete="username" />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input id="password" type={showPassword ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={commonInputClass} placeholder="••••••••" autoComplete="current-password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    <Icon path={showPassword ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} className="w-5 h-5" />
                                </button>
                            </div>
                             <div className="text-sm">
                                <button type="button" onClick={() => { setView('forgot'); setError(''); setRecoveryMessage(''); }} className="font-semibold text-primary hover:underline">
                                    Forgot Password or User ID?
                                </button>
                            </div>
                        </form>
                    )}
                    {view === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label htmlFor="signupName" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input id="signupName" type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} className={commonInputClass} placeholder="Raj Sharma" autoComplete="name" />
                            </div>
                            <div>
                                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input id="signupEmail" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className={commonInputClass} placeholder="you@example.com" autoComplete="email" />
                            </div>
                             <div>
                                <label htmlFor="signupPhone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input id="signupPhone" type="tel" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className={commonInputClass} placeholder="+919876543210" autoComplete="tel" />
                            </div>
                            <div>
                                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                <input id="signupPassword" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className={commonInputClass} placeholder="••••••••" autoComplete="new-password" />
                            </div>
                             <div>
                                <label htmlFor="signupConfirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input id="signupConfirmPassword" type="password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} className={commonInputClass} placeholder="••••••••" autoComplete="new-password" />
                            </div>
                        </form>
                    )}
                    {view === 'forgot' && (
                        <form onSubmit={handleRecovery} className="space-y-6">
                            <div>
                                <label htmlFor="recoveryIdentifier" className="block text-sm font-medium text-gray-700">Email or Phone</label>
                                <input id="recoveryIdentifier" type="text" value={recoveryIdentifier} onChange={(e) => setRecoveryIdentifier(e.target.value)} className={commonInputClass} placeholder="Enter your registered email or phone" />
                            </div>
                        </form>
                    )}

                    {error && <p className="text-red-500 text-sm text-center pt-4">{error}</p>}
                    {recoveryMessage && <p className="text-green-600 text-sm text-center pt-4">{recoveryMessage}</p>}
                     <div className="pt-6">
                        <button onClick={view === 'login' ? handleLogin : view === 'signup' ? handleSignup : handleRecovery} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-blue-300 transition-colors">
                           {isLoading ? (
                               view === 'login' ? 'Signing in...' :
                               view === 'signup' ? 'Creating account...' :
                               'Sending...'
                           ) : (
                               view === 'login' ? 'Sign In' :
                               view === 'signup' ? 'Sign Up' :
                               'Send Recovery Link'
                           )}
                        </button>
                    </div>

                     <div className="text-center mt-6 text-sm">
                        <p className="text-gray-600">
                           {view === 'login' && "Don't have an account?"}
                           {view === 'signup' && 'Already have an account?'}
                           {view === 'forgot' && 'Remembered your password?'}
                           <button type="button" onClick={() => { setView(view === 'signup' ? 'login' : 'signup'); if(view === 'forgot') setView('login'); setError(''); setRecoveryMessage('');}} className="font-semibold text-primary hover:underline ml-1">
                               {view === 'login' && 'Sign Up'}
                               {view === 'signup' && 'Sign In'}
                               {view === 'forgot' && 'Back to Login'}
                           </button>
                        </p>
                    </div>
                </div>
                {view === 'login' && (
                    <div className="text-center mt-4 text-sm text-gray-500">
                        <p>Demo credentials:</p>
                        <p>Email: <span className="font-semibold">raj.sharma@superagent.com</span></p>
                        <p>Password: <span className="font-semibold">password123</span></p>
                    </div>
                )}
            </div>
        </div>
    );
};