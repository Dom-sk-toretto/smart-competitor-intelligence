import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { SparklesIcon, CloseIcon } from '../components/icons';

// --- Sign Up Modal Component ---
const SignUpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account created successfully! (Demo)');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeInUp" style={{ animationDuration: '0.3s' }}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Create Your AI Account</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex border-b border-slate-700 mb-4">
            <button onClick={() => setActiveTab('email')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'email' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'}`}>
              Sign up with Email
            </button>
            <button onClick={() => setActiveTab('phone')} className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'phone' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400'}`}>
              Sign up with Phone
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'email' ? (
              <>
                <InputField id="signup-name" label="Full Name" type="text" placeholder="John Doe" />
                <InputField id="signup-email" label="Email" type="email" placeholder="you@example.com" />
                <InputField id="signup-password" label="Password" type="password" placeholder="••••••••" />
              </>
            ) : (
              <>
                <InputField id="signup-phone" label="Phone Number" type="tel" placeholder="+1 (555) 123-4567" />
                <InputField id="signup-code" label="Verification Code" type="text" placeholder="123456" />
              </>
            )}
            <button type="submit" className="w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Forgot Password Modal Component ---
const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Password reset link sent to your email! (Demo)');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeInUp" style={{ animationDuration: '0.3s' }}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md m-4">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-slate-400 text-sm">Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
                    <InputField id="reset-email" label="Email" type="email" placeholder="you@example.com" />
                    <button type="submit" className="w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Helper Input Field Component ---
const InputField: React.FC<{ id: string; label: string; type: string; placeholder?: string }> = ({ id, label, type, placeholder }) => (
    <div>
        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor={id}>
            {label}
        </label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            required
            className="w-full bg-slate-800/70 border border-slate-600 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
        />
    </div>
);


const LoginPage: React.FC = () => {
  const auth = useContext(AuthContext);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    auth?.login();
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0F1F] overflow-hidden relative">
        {/* Particle background */}
        <div className="absolute inset-0 z-0 opacity-30">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-400 rounded-full"
              style={{
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0); }
          }
        `}</style>
        
        <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl z-10 animate-fadeInUp">
          <div className="text-center mb-8">
            <SparklesIcon className="h-12 w-12 text-[#06B6D4] mx-auto mb-4"/>
            <h1 className="text-3xl font-bold text-white">Smart Competitor Intelligence</h1>
            <p className="text-gray-400 mt-2">Login to your AI Dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue="demo@competitor.ai"
                className="w-full bg-slate-800/70 border border-slate-600 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                defaultValue="password"
                className="w-full bg-slate-800/70 border border-slate-600 rounded-lg py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#06B6D4] transition-all"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
               <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-300"
               >
                Forgot Password?
               </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
              >
                Login
              </button>
            </div>
          </form>
           <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setShowSignUp(true)}
                className="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-300"
              >
                New here? Create an AI Account
              </button>
          </div>
        </div>
      </div>
      
      <SignUpModal isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </>
  );
};

export default LoginPage;
