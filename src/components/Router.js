import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "../components/Navigation";

const AppRouter = ({ isLoggedIn, curUser, refreshUser }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation curUser={curUser} />}
      {isLoggedIn ? (
        <div
          style={{
            maxWidth: 890,
            width: "100%",
            margin: "0 auto",
            marginTop: 80,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Home curUser={curUser} />} />
            <Route path="/profile" element={<Profile curUser={curUser} refreshUser={refreshUser} />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Auth refreshUser={refreshUser} />} />
        </Routes>
      )}
    </Router>
  )
}

export default AppRouter;