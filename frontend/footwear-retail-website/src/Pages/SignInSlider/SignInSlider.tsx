import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './SignInSlider.css';
import cancelIcon from '../../assets/cancel.png';
interface SignInSliderProps {
  show: boolean;
  onClose: () => void;
}

const SignInSlider: React.FC<SignInSliderProps> = ({ show, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log('Sign in with:', email, password);
  };

  return (
    <div className={`sign-in-slider ${show ? 'show' : ''}`}>
      <div className="sign-in-content">
        <button className="close-button" onClick={onClose}>
          <img src={cancelIcon} alt="Close" className="close-icon" />
        </button>
        <h2>Sign In to Urban Kicks</h2>
        <Form onSubmit={handleSubmit}>
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

          <Button variant="primary" type="submit">
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default SignInSlider;