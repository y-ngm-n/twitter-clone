import React from "react";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from "firebase/auth";
import AuthForm from "../components/AuthForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";


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
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm refreshUser={refreshUser} />
            <div className="authBtns">
                <button onClick={socialBtnClicked} name="google" className="authBtn">
                    Continue with Google <FontAwesomeIcon icon={faGoogle} />
                </button>
                <button onClick={socialBtnClicked} name="github" className="authBtn">
                    Continue with Github <FontAwesomeIcon icon={faGithub} />
                </button>
            </div>
        </div>
    )
}

export default Auth;