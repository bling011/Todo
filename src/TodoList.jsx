import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSun, FaMoon, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

export default function TodoList() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [task, setTask] = useState("");
  const [agenda, setAgenda] = useState("");
  const [goal, setGoal] = useState("");
  const [date, setDate] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [taskHistory, setTaskHistory] = useState(() => JSON.parse(localStorage.getItem("taskHistory")) || []);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [tasks, taskHistory, darkMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addTask = () => {
    if (!task || !date) return;
    const newTask = { text: task, agenda, goal, date, time: new Date().toLocaleString() };
    if (editingIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingIndex] = newTask;
      setTasks(updatedTasks);
      setEditingIndex(null);
    } else {
      setTasks([...tasks, newTask]);
      setTaskHistory([...taskHistory, newTask]);
    }
    setTask("");
    setAgenda("");
    setGoal("");
    setDate("");
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.text);
    setAgenda(taskToEdit.agenda);
    setGoal(taskToEdit.goal);
    setDate(taskToEdit.date);
    setEditingIndex(index);
  };

  return (
    <div className={`container-fluid vh-100 d-flex flex-column align-items-center justify-content-center ${darkMode ? "dark-mode" : "light-mode"}`}>
      <button className="btn-toggle" onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      <h1>Task Manager</h1>
      <span>{currentTime}</span>
      <div className="input-group mb-3 w-50">
        <input type="text" className="form-control" placeholder="Task" value={task} onChange={(e) => setTask(e.target.value)} />
        <input type="text" className="form-control" placeholder="Agenda" value={agenda} onChange={(e) => setAgenda(e.target.value)} />
        <input type="text" className="form-control" placeholder="Goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
        <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn btn-primary" onClick={addTask}>{editingIndex !== null ? "Update" : <FaPlus />}</button>
      </div>
      <div className="w-50">
        {tasks.map((t, index) => (
          <div key={index} className="task-box">
            <div>
              <strong>{t.text}</strong>
              <div className="task-details">Agenda: {t.agenda} | Goal: {t.goal} | Date: {t.date} | Time: {t.time}</div>
            </div>
            <button className="btn btn-warning me-2" onClick={() => editTask(index)}><FaEdit /></button>
            <button className="btn btn-danger" onClick={() => setTasks(tasks.filter((_, i) => i !== index))}><FaTrash /></button>
          </div>
        ))}
      </div>
      <div className="history-section w-50 mt-3">
        <h2>Task History</h2>
        <ul className="list-group">
          {taskHistory.map((entry, index) => (
            <li key={index} className="list-group-item bg-transparent border-0 text-white">
              {entry.text} - {entry.agenda} - {entry.goal} - {entry.date} - {entry.time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
