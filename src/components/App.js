import { useState, useEffect } from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";


function App() {
  const [isInit, setIsInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [curUser, setCurUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setIsInit(true);
      if (user) {
        setIsLoggedIn(true);
        setCurUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        });
      }
      else {
        setIsLoggedIn(false);
        setCurUser(null);
      }
    });
  }, []);

  const refreshUser = () => {
    const user = auth.currentUser;
    setCurUser({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid
  });
  }

  return (
    <>
      {isInit ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          curUser={curUser}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing . . ." 
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Switter</footer> */}
    </>
  );
}

export default App;