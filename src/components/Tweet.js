// Home에 리스팅되는 각각의 tweet에 대한 컴포넌트

import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


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
    <div className="tweet">
      {editing ? (
        <>
          <form onSubmit={editFormSubmitted} className="container tweetEdit">
            <input
              type="text"
              placeholder="Editing..."
              value={newTweet}
              onChange={editInputChanged}
              className="formInput"
              required
              autoFocus
            />
            <input type="submit" value="Update" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.fileURL && <img src={tweetObj.fileURL} />}
          {isMine && (
            <div className="tweet__actions">
              <span onClick={deleteBtnClicked}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Tweet;