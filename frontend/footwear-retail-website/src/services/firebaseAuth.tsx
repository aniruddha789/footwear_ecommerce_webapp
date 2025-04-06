import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { clearAuthData } from './api'; // Make sure this is properly imported

export const signUpWithEmailAndVerify = async (email: string): Promise<string> => {
  try {
    // Create temporary password for Firebase (not used for login)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create Firebase user just for verification purposes
    const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword);
    const user = userCredential.user;
    
    // Send verification email
    await sendEmailVerification(user);
    
    // Return Firebase UID to store in your own system
    return user.uid;
  } catch (error: any) {
    console.error('Firebase auth error:', error);
    throw new Error(error.message);
  }
};

export const isEmailVerified = (firebaseUid: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Set up an observer for auth state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.uid === firebaseUid) {
        unsubscribe(); // Stop listening
        resolve(user.emailVerified);
      }
    });
  });
};

// New function for Google Sign-in
export const signInWithGoogle = async (): Promise<{
  firebaseUid: string;
  email: string;
  displayName: string;
  isVerified: boolean;
  photoURL: string | null;
}> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    return {
      firebaseUid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      isVerified: user.emailVerified,
      photoURL: user.photoURL
    };
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(error.message);
  }
};

// Add this function to sign out from Firebase
export const firebaseSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase sign out error:', error);
  }
};

// Setup auth state listener to sync Firebase and backend sessions
export const setupAuthSync = (): void => {
  onAuthStateChanged(auth, (user) => {
    const token = localStorage.getItem('token');
    
    // If backend session is gone but Firebase session exists, sign out from Firebase
    if (!token && user) {
      firebaseSignOut();
    }
  });
};
