import { v4 as uuidv4 } from "uuid";

import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";


const TweetFactory = ({ curUser }) => {

  // states
  const [tweet, setTweet] = useState("");
  const [fileURL, setFileURL] = useState("");

  // event listeners
  const tweetInputChanged = (event) => {
    setTweet(event.target.value);
  }
  const tweetFormSubmitted = async (event) =>{
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
    setFileURL(null);
  }

  // return
  return (
    <form onSubmit={tweetFormSubmitted}>
      <input
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
        value={tweet}
        onChange={tweetInputChanged}
        required
      />
      <input type="file" accept="image/*" onChange={fileInputChanged} />
      <input type="submit" value="Tweet" />
      {fileURL && (
        <div>
          <img src={fileURL} alt="img" width="50px" height="50px" />
          <button onClick={fileClearBtnClicked}>Clear</button>
        </div>
      )}
    </form>
  )
}

export default TweetFactory;