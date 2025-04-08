import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountSettings.css';
import { MdArrowBack, MdLock } from 'react-icons/md';
import { Form, Button, Alert } from 'react-bootstrap';
import { updatePassword } from '../../services/api';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const username = localStorage.getItem('username');
      
      if (!username) {
        setError('You must be logged in to update your password');
        return;
      }

      const response = await updatePassword(username, password);
      
      if (response.status === 'SUCCESS') {
        setSuccess('Password updated successfully');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(response.message || 'Failed to update password');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <MdArrowBack />
        </button>
        <h1 className="page-title">Account Settings</h1>
      </div>

      <div className="settings-section">
        <div className="section-title">
          <MdLock />
          <h2>Change Password</h2>
        </div>

        {error && <Alert variant="danger" className="custom-alert-danger">{error}</Alert>}
        {success && <Alert className="alert-success">{success}</Alert>}

        <Form onSubmit={handlePasswordUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button 
            variant="dark" 
            type="submit" 
            className="update-password-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AccountSettings; 