import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';

const AuthPage = ({ setPage }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, signup, loading: authLoading } = useAuth();
  const { showError } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      setPage('home'); // Redirect to home on success
    } catch (err) {
      showError(err.message);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-amber-900 font-serif">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLoginView && (
              <Input
                id="name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" className="w-full !py-3" disabled={authLoading}>
              {authLoading ? (isLoginView ? 'Logging in...' : 'Signing up...') : (isLoginView ? 'Login' : 'Sign Up')}
            </Button>
          </form>
          
          <div className="text-center">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
              }}
              className="text-sm text-amber-800 hover:underline"
            >
              {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Login'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;