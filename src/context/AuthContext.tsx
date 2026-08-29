import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, getDoc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateCachedUserData: (data: any) => void;
  refetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  updateCachedUserData: () => {},
  refetchUserData: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [userData, setUserData] = useState<any | null>(() => {
    try {
      const cached = localStorage.getItem('cached_current_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  
  const [loading, setLoading] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('cached_current_user');
    } catch {
      return true;
    }
  });

  const updateCachedUserData = (newData: any) => {
    if (!newData) {
      setUserData(null);
      try {
        localStorage.removeItem('cached_current_user');
      } catch {}
      return;
    }
    setUserData((prev: any) => {
      const merged = { ...(prev || {}), ...newData };
      try {
        localStorage.setItem('cached_current_user', JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const refetchUserData = async () => {
    const currentUid = auth.currentUser?.uid || userData?.id;
    if (!currentUid) return;

    try {
      const docSnap = await getDoc(doc(db, 'users', currentUid));
      if (docSnap.exists()) {
        const full = { id: docSnap.id, ...docSnap.data() };
        updateCachedUserData(full);
      }
    } catch (e) {
      console.warn("Could not refetch user data:", e);
    }
  };

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const emailLower = currentUser.email ? currentUser.email.toLowerCase() : '';

        unsubscribeDoc = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const fullUserData = { id: docSnap.id, ...docSnap.data() };
            updateCachedUserData(fullUserData);
            setLoading(false);
          } else {
            // Document doesn't exist by UID directly in Firestore
            try {
              let legacyData: any = null;
              if (emailLower) {
                const q = query(collection(db, 'users'), where('email', '==', emailLower));
                const querySnap = await getDocs(q);
                if (!querySnap.empty) {
                  const docSnapFallback = querySnap.docs[0];
                  legacyData = docSnapFallback.data();
                  try {
                    await setDoc(doc(db, 'users', currentUser.uid), {
                      ...legacyData,
                      id: currentUser.uid
                    });
                    if (docSnapFallback.id !== currentUser.uid) {
                      await deleteDoc(doc(db, 'users', docSnapFallback.id));
                    }
                  } catch (e) {
                    console.error("Migration error", e);
                  }
                }
              }

              if (!legacyData) {
                try {
                  const cachedStr = localStorage.getItem('cached_current_user');
                  if (cachedStr) {
                    const cachedObj = JSON.parse(cachedStr);
                    if (cachedObj && (cachedObj.id === currentUser.uid || cachedObj.email === emailLower)) {
                      legacyData = cachedObj;
                    }
                  }
                } catch (e) {
                  console.warn("Error reading cached user data:", e);
                }
              }

              const isAdminEmail = emailLower === 'ahmed@admin.com' || emailLower === 'a73905337@gmail.com';
              const finalUserData = legacyData ? { ...legacyData, id: currentUser.uid } : {
                id: currentUser.uid,
                email: emailLower || `${currentUser.uid}@tafawwoq.app`,
                name: currentUser.displayName || (isAdminEmail ? 'مدير النظام' : (emailLower ? emailLower.split('@')[0] : 'مستخدم')),
                phone: '01000000000',
                governorate: 'القاهرة',
                role: isAdminEmail ? 'admin' : 'student',
                createdAt: new Date().toISOString(),
                isApproved: true,
                stars: 0,
                points: 0,
                balance: 0
              };

              await setDoc(doc(db, 'users', currentUser.uid), finalUserData, { merge: true });
              updateCachedUserData(finalUserData);
              setLoading(false);
            } catch (err) {
              console.error("Error creating/recovering user doc:", err);
              setLoading(false);
            }
          }
        }, (error) => {
          console.error("Error in user real-time listener:", error);
          setLoading(false);
        });
      } else {
        if (unsubscribeDoc) {
          unsubscribeDoc();
          unsubscribeDoc = null;
        }

        // If user is not currently in Firebase Auth state, check if we have active cache
        try {
          const cachedStr = localStorage.getItem('cached_current_user');
          if (cachedStr) {
            const parsed = JSON.parse(cachedStr);
            if (parsed && parsed.id) {
              setUserData(parsed);
              setLoading(false);
              return;
            }
          }
        } catch {}

        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const logout = async () => {
    try {
      localStorage.removeItem('cached_current_user');
    } catch {}
    setUserData(null);
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, updateCachedUserData, refetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
