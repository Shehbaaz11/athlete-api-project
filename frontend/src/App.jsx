import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedAthletes, setSavedAthletes] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [viewSaved, setViewSaved] = useState(false);

  // Helper to create a unique key for each athlete
  const getAthleteId = (athlete) =>
    (athlete.name + athlete.sport + athlete.duration).toLowerCase().trim();

  // Fetch top 10 athletes
  const fetchAthletes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/top-athletes");
      const data = await res.json();
      setAthletes(data.data || []);
    } catch (error) {
      console.error("Error fetching athletes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved athletes from backend and update savedIds list
  const fetchSavedAthletes = async () => {
    try {
      const res = await fetch("http://localhost:3000/saved-athletes");
      const data = await res.json();
      setSavedAthletes(data || []);
      // Update savedIds so save button disables for saved athletes
      const ids = (data || []).map(getAthleteId);
      setSavedIds(ids);
    } catch (error) {
      console.error("Error fetching saved athletes:", error);
    }
  };

  // Save athlete and update savedIds and saved list
  const saveAthlete = async (athlete) => {
    try {
      const res = await fetch("http://localhost:3000/save-athlete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(athlete),
      });
      const data = await res.json();
      if (data.message === "Athlete saved") {
        // Update saved athletes list and savedIds
        await fetchSavedAthletes();
      } else {
        console.error("Failed to save athlete:", data);
      }
    } catch (error) {
      console.error("Error saving athlete:", error);
    }
  };

  // Delete saved athlete by id
  const deleteAthlete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/delete-athlete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.message === "Athlete deleted") {
        await fetchSavedAthletes();
      } else {
        console.error("Failed to delete athlete:", data);
      }
    } catch (error) {
      console.error("Error deleting athlete:", error);
    }
  };

  useEffect(() => {
    fetchSavedAthletes();
  }, []);

  return (
    <div className="App">
      <h1>🏋️‍♂️ Arthlete API Viewer</h1>

      {/* Toggle Buttons */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setViewSaved(false)}
          disabled={!viewSaved}
          style={{
            marginRight: 10,
            padding: "8px 16px",
            backgroundColor: viewSaved ? "#ccc" : "purple",
            color: viewSaved ? "#000" : "white",
            cursor: viewSaved ? "default" : "pointer",
          }}
        >
          View Top Athletes
        </button>
        <button
          onClick={() => setViewSaved(true)}
          disabled={viewSaved}
          style={{
            padding: "8px 16px",
            backgroundColor: viewSaved ? "#ccc" : "purple",
            color: viewSaved ? "#000" : "white",
            cursor: viewSaved ? "default" : "pointer",
          }}
        >
          View Saved Athletes
        </button>
      </div>

      {/* Top Athletes List */}
      {!viewSaved && (
        <>
          {!athletes.length && (
            <p>Click the button below to fetch top 10 athletes.</p>
          )}

          {!loading && !athletes.length && (
            <button onClick={fetchAthletes} style={{
              marginLeft: "10rem",}}  >Show Top 10 Athletes</button>
          )}

          {loading && <p>Loading...</p>}

          {athletes.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Sport</th>
                  <th>Duration</th>
                  <th>Save</th>
                </tr>
              </thead>
              <tbody>
                {athletes.map((athlete, index) => {
                  const id = getAthleteId(athlete);
                  const isSaved = savedIds.includes(id);

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{athlete.name}</td>
                      <td>{athlete.sport}</td>
                      <td>{athlete.duration} min</td>
                      <td>
                        <button
                          onClick={() => saveAthlete(athlete)}
                          disabled={isSaved}
                          style={{
                            backgroundColor: isSaved ? "green" : "black",
                            color: "white",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: isSaved ? "default" : "pointer",
                          }}
                        >
                          {isSaved ? "SAVED" : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Saved Athletes List */}
      {viewSaved && (
        <div className="saved-section">
          <h2>✅ Saved Athletes</h2>
          {savedAthletes.length === 0 ? (
            <p>No saved athletes yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Sport</th>
                  <th>Duration</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {savedAthletes.map((athlete, index) => (
                  <tr key={athlete._id}>
                    <td>{index + 1}</td>
                    <td>{athlete.name}</td>
                    <td>{athlete.sport}</td>
                    <td>{athlete.duration}</td>
                    <td>
                      <button
                        onClick={() => deleteAthlete(athlete._id)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
