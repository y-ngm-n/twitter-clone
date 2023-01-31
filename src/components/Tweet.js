// Home에 리스팅되는 각각의 tweet에 대한 컴포넌트

import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";


const Tweet = ({ tweetObj, isMine }) => {

  // states
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  // event listeners
  const toggleEditing = () => {
    setEditing(cur => !cur);
  }
  const deleteBtnClicked = async () => {
    const ok = window.confirm("Are you sure?");
    if (ok) {
      await deleteDoc(doc(db, "tweets", tweetObj.id));
      if (tweetObj.fileURL) {
        const targetFile = ref(storage, tweetObj.fileURL);
        await deleteObject(targetFile);
      }
    }
  }
  const editInputChanged = (event) => {
    setNewTweet(event.target.value);
  }
  const editFormSubmitted = async (event) => {
    event.preventDefault();
    console.log(tweetObj);
    await updateDoc(doc(db, "tweets", tweetObj.id), { "text": newTweet });
    setEditing(false);
  }

  // return
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={editFormSubmitted}>
            <input
              type="text"
              placeholder="Editing..."
              value={newTweet}
              onChange={editInputChanged}
              required
            />
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEditing}>Cancle</button>
        </>
      ) : (
        <>
          {tweetObj.fileURL && <img src={tweetObj.fileURL} alt="img" width="150px" height="150px" />}
          <h4>{tweetObj.text}</h4>
          {isMine && (<>
            <button onClick={toggleEditing}>Edit</button>
            <button onClick={deleteBtnClicked}>Delete</button>
          </>)}
        </>
      )}
    </div>
  )
}

export default Tweet;