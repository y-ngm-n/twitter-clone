import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Tweet from "../components/Tweet";
import TweetFactory from "../components/TweetFactory";


const Home = ({ curUser }) => {

  // states
  const [tweets, setTweets] = useState([]);

  // onSnapshot 등록 -> db를 실시간으로 확인할 수 있음
  useEffect(() => {
    const q = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTweets(tweetArr);
    });
  }, []);

  // return
  return (
    <div className="container">
      <TweetFactory curUser={curUser} />
      <div style={{ marginTop: 30 }}>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isMine={tweet.userId===curUser.uid}
          />
        ))}
      </div>
    </div>
  )
}

export default Home;