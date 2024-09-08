import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './SignInSlider.css';
import cancelIcon from '../../assets/cancel.png';
import { registerUser } from '../../services/api';

interface SignInSliderProps {
  show: boolean;
  onClose: () => void;
}

const SignInSlider: React.FC<SignInSliderProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isSignUp) {
      try {
        const response = await registerUser(username, email, password);
        console.log('response:' + JSON.stringify(response));
        if (response.status === 'PASS' || response.code === '200') {
          setSuccess('User registered successfully! Please sign in.');
          setIsSignUp(false);
        } else{
          setError(response.message);
        }
      } catch (error: any) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      } 
    } else {
      console.log('Sign in with:', email, password);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  return (
    <div className={`sign-in-slider ${show ? 'show' : ''}`}>
      <div className="sign-in-content">
        <button className="close-button" onClick={onClose}>
          <img src={cancelIcon} alt="Close" className="close-icon" />
        </button>
        <h2>{isSignUp ? 'Sign Up' : 'Sign In'} to Urban Kicks</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
         <Form onSubmit={handleSubmit}>
          {isSignUp && (
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="dark" type="submit" className="submit-button">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </Form>
        <p className="toggle-sign-up" onClick={toggleSignUp}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default SignInSlider;