import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const Profile = ({ curUser, refreshUser }) => {

    const [newName, setNewName] = useState(curUser.displayName);
    const [newPhoto, setNewPhoto] = useState(curUser.photoURL);

    const auth = getAuth();
    const logoutNavigate = useNavigate();

    const logoutBtnClicked = () => {
        auth.signOut();
        logoutNavigate("/");
    }
    const nameInputChanged = (event) => {
        setNewName(event.target.value);
    }
    const nameFormSubmitted = async (event) => {
        event.preventDefault();
        if (newName && newName !== curUser.displayName) {
            await updateProfile(auth.currentUser, { displayName: newName, photoURL: newPhoto });
            refreshUser();
        }
    }

    const getMyTweets = async () => {
        const q = query(
            collection(db, "tweets"),
            where("userId", "==", curUser.uid),
            orderBy("createdAt")
        );
        const myTweets = await getDocs(q);
        console.log(myTweets.docs.map(doc => doc.data()));
    }
    useEffect(() => {
        getMyTweets();
    }, []);

    return (
        <div className="container">
            {/* <div>
                <img src={curUser.photoURL} alt="img" width="50px" height="50px" />
                <h4>{curUser.displayName}</h4>
            </div> */}
            <form onSubmit={nameFormSubmitted} className="profileForm">
                <input
                    type="text"
                    placeholder="Set your name"
                    value={newName}
                    onChange={nameInputChanged}
                    className="formInput"
                    autoFocus
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={logoutBtnClicked}>
                Log Out
            </span>
        </div>
    )
}

export default Profile;