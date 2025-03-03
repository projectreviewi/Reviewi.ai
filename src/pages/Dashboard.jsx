import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FaHome, FaFlag, FaCheckCircle, FaChartBar } from "react-icons/fa";
import PostedReviews from "./PostedReviews";
import FlaggedReviews from "./FlaggedReviews";
import AutoPostedReviews from "./AutoPostedReviews";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Reviewi.ai</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <FaHome /> Home
              </Link>
            </li>
            <li>
              <Link to="/posted-reviews">
                <FaCheckCircle /> Posted Reviews
              </Link>
            </li>
            <li>
              <Link to="/flagged-reviews">
                <FaFlag /> Flagged Reviews
              </Link>
            </li>
            <li>
              <Link to="/auto-posted-reviews">
                <FaChartBar /> Auto-Posted Reviews
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<h1>Welcome to Reviewi.ai Dashboard</h1>} />
          <Route path="/posted-reviews" element={<PostedReviews />} />
          <Route path="/flagged-reviews" element={<FlaggedReviews />} />
          <Route path="/auto-posted-reviews" element={<AutoPostedReviews />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
