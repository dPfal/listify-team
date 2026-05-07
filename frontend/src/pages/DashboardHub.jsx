import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus } from "react-icons/fi";
import "./Dashboard.css"; // We can reuse your existing styles for now!

function DashboardHub() {
  const [lists, setLists] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token");
      // This hits the Facade pattern endpoint we built!
      const response = await fetch("/api/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setLists(data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const handleCreateNewList = async () => {
    const listName = prompt("Enter a name for your new list:");
    if (!listName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: listName }),
      });
      
      if (response.ok) {
        fetchLists(); // Refresh the grid!
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">
      <div className="phone-frame">
        <div className="dashboard-topbar">
          <h2 className="greeting">👋 Hi, {username}!</h2>
          <button className="icon-button logout-button" onClick={handleLogout}>
            <FiLogOut />
          </button>
        </div>

        <div className="title-row">
          <div className="dashboard-title">My Lists</div>
        </div>

        <div className="category-list">
          {lists.length === 0 ? (
            <div className="empty-state">
              <p>No lists yet</p>
              <p className="empty-sub">Tap + to create your first list</p>
            </div>
          ) : (
            lists.map((list) => (
              <div 
                key={list._id} 
                className="category-card" 
                style={{ cursor: "pointer", marginBottom: "15px", padding: "20px", textAlign: "center", fontWeight: "bold" }}
                onClick={() => navigate(`/dashboard/${list._id}`)}
              >
                {list.name} 
                <div style={{ fontSize: "12px", color: "gray", marginTop: "5px" }}>
                  {list.itemCount} items inside
                </div>
              </div>
            ))
          )}
        </div>

        <button className="floating-add-button" onClick={handleCreateNewList}>
          <FiPlus />
        </button>
      </div>
    </div>
  );
}

export default DashboardHub;
