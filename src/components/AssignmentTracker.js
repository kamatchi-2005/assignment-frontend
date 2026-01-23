import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [projectName, setProjectName] = useState("");

  const fetchAssignments = async () => {
    const res = await axios.get("http://localhost:8080/api/assignments");
    setAssignments(res.data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const addAssignment = async () => {
    if(!studentName || !projectName) return alert("Enter all fields");
    await axios.post("http://localhost:8080/api/assignments", { studentName, projectName });
    setStudentName("");
    setProjectName("");
    fetchAssignments();
  };

  const updateStatus = async (id) => {
    const assignment = assignments.find(a => a.id === id);
    await axios.put(`http://localhost:8080/api/assignments/${id}`, {
      ...assignment,
      status: "Completed"
    });
    fetchAssignments();
  };

  const deleteAssignment = async (id) => {
    await axios.delete(`http://localhost:8080/api/assignments/${id}`);
    fetchAssignments();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Student Assignment Tracker</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={addAssignment}>
          Add Assignment
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Project</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.studentName}</td>
              <td>{a.projectName}</td>
              <td>{a.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  disabled={a.status === "Completed"}
                  onClick={() => updateStatus(a.id)}
                >
                  Complete
                </button>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => deleteAssignment(a.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentTracker;
