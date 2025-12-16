"use client";
 
import { useContext, createContext, useState, useEffect } from "react";
import {
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail, 
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth } from "./firebase";
 
const AuthContext = createContext();

 
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const sendEmailLink = async (email) => {
    const actionCodeSettings = {
      url: window.location.origin + '/auth/complete',
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const firebaseSignOut = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) email = window.prompt('Enter email for confirmation');
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => window.localStorage.removeItem('emailForSignIn'))
          .catch(console.error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, sendEmailLink, firebaseSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};


