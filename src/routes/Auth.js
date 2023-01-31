import React from "react";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from "firebase/auth";
import AuthForm from "../components/AuthForm";


const Auth = ({ refreshUser }) => {

    // event listeners
    const socialBtnClicked = async (event) => {
        const { target: { name } } = event;
        let provider;
        try {
            const auth = getAuth();
            if (name==="google") { provider = new GoogleAuthProvider(); }
            else if (name==="github") { provider = new GithubAuthProvider(); }
            const result = await signInWithPopup(auth, provider);
            console.log(result);
        } catch (error) { console.error(error) }
    }

    // return
    return (
        <div>
            <AuthForm refreshUser={refreshUser} />
            <div>
                <button name="google" onClick={socialBtnClicked}>Continue with Google</button>
                <button name="github" onClick={socialBtnClicked}>Continue with Github</button>
            </div>
        </div>
    )
}

export default Auth;