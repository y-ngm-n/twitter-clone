import React, { useState } from "react";
import { storage } from "../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";


const AuthForm = ({ refreshUser }) => {

  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState(false);
  const [err, setErr] = useState("");

  // event listeners
  const inputChanged = (event) => {
    const { target: { name, value } } = event;
    if (name==="email") { setEmail(value); }
    else setPassword(value);
  }
  const submitBtnClicked = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      let result;
      if (account) {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
        const curUser = auth.currentUser;
        const profileImgRef = ref(storage, "src/profile.jpeg");
        const downloadURL = await getDownloadURL(profileImgRef);
        await updateProfile(curUser, {
          displayName: "newUser",
          photoURL: downloadURL
        });
        refreshUser();
      }
      console.log(result);
    } catch (error) { setErr(error.message); }
  }
  const toggleAccount = () => {
      setAccount((cur) => !cur);
  }

  return (
    <>
      <form onSubmit={submitBtnClicked} className="container">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={inputChanged}
          className="authInput"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={inputChanged}
          className="authInput"
          required
        />
        <input
          type="submit"
          value={account ? "Login" : "Register"}
          className="authInput authSubmit"
        />
        {err && <span className="authError">{err}</span> }
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {account ? "Register" : "Login"}
      </span>
    </>
  )
}

export default AuthForm;