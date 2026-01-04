import { createContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut, 
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";
import { auth } from "../database/firebase";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    const updateUserProfile = async (updates) => {
        try {
            await updateProfile(auth.currentUser, updates);
            // Update local state
            setUser({
                ...user,
                ...updates
            });
        } catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    };

    const deleteUserAccount = async (password) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user found");
            }

            // Re-authenticate user before deletion
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            
            // Delete the user account
            await deleteUser(user);
            
            return true;
        } catch (error) {
            console.error("Delete account error:", error);
            throw error;
        }
    };
    
    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            logout,
            updateUserProfile,
            deleteUserAccount 
        }}>
            {children}
        </AuthContext.Provider>
    );
}