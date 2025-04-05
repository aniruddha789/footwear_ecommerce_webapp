import { createRoot, Root } from 'react-dom/client';
import CustomAlert from '../components/CustomAlert/CustomAlert';
import React from 'react';

// Keep track of active alerts to prevent duplicates
let activeAlerts = new Map<string, { root: Root, container: HTMLDivElement }>();

export const customAlert = (message: string) => {
  // If we already have an alert with this message, don't create another one
  if (activeAlerts.has(message)) {
    return;
  }
  
  // Create a new container for this alert
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  
  // Store reference to this alert
  activeAlerts.set(message, { root, container });
  
  const handleClose = () => {
    // Clean up when the alert is closed
    if (activeAlerts.has(message)) {
      const { root, container } = activeAlerts.get(message)!;
      root.unmount();
      document.body.removeChild(container);
      activeAlerts.delete(message);
    }
  };

  // Render the alert
  root.render(
    React.createElement(CustomAlert, { message, onClose: handleClose })
  );
}; 