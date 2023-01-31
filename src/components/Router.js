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
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home curUser={curUser} />} />
            <Route path="/profile" element={<Profile curUser={curUser} refreshUser={refreshUser} />} />
          </>
        ) : (
          <Route path="/" element={<Auth refreshUser={refreshUser} />} />
        )}
      </Routes>
    </Router>
  )
}

export default AppRouter;