import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './SignInSlider.css';
import cancelIcon from '../../assets/cancel.png';
import { loginUser, registerUser } from '../../services/api';

interface SignInSliderProps {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, firstname: string) => void;
}

const SignInSlider: React.FC<SignInSliderProps> = ({ show, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (isSignUp) {
        const response = await registerUser(username, email, password, firstname, lastname);
        console.log('response:' + JSON.stringify(response));
        if (response.status === 'PASS' || response.code === '200') {
          setSuccess('User registered successfully! Please sign in.');
          setIsSignUp(false);
          setPassword(''); // Clear password field after successful registration
        } else {
          setError(response.message);
        }
      } else {
        const response = await loginUser(username, password);
        if (response.status === 'SUCCESS') {
          onClose();
          localStorage.setItem('token', response.token!);
          localStorage.setItem('username', username);
          localStorage.setItem('firstname', response.firstname);
          console.log('firstname:' + response.firstname);
          onLoginSuccess(username, response.firstname);
        } else {
          setError(response.message);
        }
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
    
    setPassword(''); // Clear password field after form submission
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setPassword(''); // Clear password when toggling between sign in and sign up
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
          {isSignUp && (
            <>
              <Form.Group controlId="formBasicFirstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formBasicLastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </Form.Group>
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
            </>
          )}
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