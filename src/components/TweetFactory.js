import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const TweetFactory = ({ curUser }) => {

  // states
  const [tweet, setTweet] = useState("");
  const [fileURL, setFileURL] = useState("");

  // event listeners
  const tweetInputChanged = (event) => {
    setTweet(event.target.value);
  }
  const tweetFormSubmitted = async (event) =>{
    if (tweet === "") return;
    let downloadURL = "";
    if (fileURL) {
      event.preventDefault();
      const fileRef = ref(storage, `${curUser.uid}/${uuidv4()}`)
      await uploadString(fileRef, fileURL, "data_url");
      downloadURL = await getDownloadURL(fileRef);
    }
    try {
      await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        userId: curUser.uid,
        fileURL: downloadURL
      });
    } catch (e) { console.error(e); }
    setTweet("");
    setFileURL(null);
  }
  const fileInputChanged = (event) => {
    const { target: { files } } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishEvent) => {
        setFileURL(finishEvent.currentTarget.result);
    }
    if (file) { reader.readAsDataURL(file) };
  }
  const fileClearBtnClicked = () => {
    setFileURL("");
  }

  // return
  return (
    <form onSubmit={tweetFormSubmitted} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={tweet}
          onChange={tweetInputChanged}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={fileInputChanged}
        style={{
          opacity: 0,
        }}
      />
      {fileURL && (
        <div className="factoryForm__attachment">
          <img
            src={fileURL}
            style={{
              backgroundImage: fileURL,
            }}
          />
          <div className="factoryForm__clear" onClick={fileClearBtnClicked}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}

export default TweetFactory;