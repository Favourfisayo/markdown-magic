import React, { useState } from "react";
import { FileText, Sparkles, Mail, ArrowRight, CheckCircle } from "lucide-react";
import AuthFunctions from "../Auth/AuthFunctions";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { handleMagicLinkLogin } = AuthFunctions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await handleMagicLinkLogin(email);
      setIsEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsEmailSent(false);
    setEmail("");
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
              <div className="relative flex items-center">
                <FileText className="w-7 h-7 text-blue-400 drop-shadow" strokeWidth={2.2} />
                <Sparkles
                  className="absolute -top-2 -right-2 w-5 h-5 text-purple-400 animate-pulse"
                  strokeWidth={2.2}
                  style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Markdown Magic</h1>
            <p className="text-slate-400">Transform your ideas into beautiful markdown</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              We've sent a magic link to <span className="font-medium text-white">{email}</span>. 
              Click the link in your email to sign in instantly.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 text-blue-300 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>Magic link expires in 15 minutes</span>
              </div>
            </div>

            <button
              onClick={handleTryAgain}
              className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              Try Different Email
            </button>
          </div>

          <div className="text-center mt-8 text-slate-400 text-sm">
            <p>© 2025 Markdown Magic. Crafted with ❤️ from Favour for writers.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <div className="relative flex items-center">
              <FileText className="w-7 h-7 text-blue-400 drop-shadow" strokeWidth={2.2} />
              <Sparkles
                className="absolute -top-2 -right-2 w-5 h-5 text-purple-400 animate-pulse"
                strokeWidth={2.2}
                style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Markdown Magic</h1>
          <p className="text-slate-400">Transform your ideas into beautiful markdown</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
            <p className="text-slate-300 text-sm">
              Enter your email to receive a magic link for instant access
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Mail className="animate-pulse w-5 h-5" />
                  <span>Sending Magic Link...</span>
                </>
              ) : (
                <>
                  <span>Send Magic Link</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>© 2025 Markdown Magic. Crafted with ❤️ for writers.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;