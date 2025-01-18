import axios from "axios";
import React, { createContext, useEffect } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "https://taskman-qp1e.onrender.com/api/v1";

export const TasksProvider = ({ children }) => {
  const userId = useUserContext().user._id;

  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [task, setTask] = React.useState({});

  const [isEditing, setIsEditing] = React.useState(false);
  const [priority, setPriority] = React.useState("all");
  const [activeTask, setActiveTask] = React.useState(null);
  const [modalMode, setModalMode] = React.useState("");
  const [profileModal, setProfileModal] = React.useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        toast.error(data.message || "Invalid request. Please try again.");
      } else if (status === 404) {
        toast.error("Resource not found. Please check the URL.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } else if (error.request) {
      toast.error("No response from the server. Please check your network.");
    } else {
      toast.error(defaultMessage);
    }
    console.error(defaultMessage, error);
  };

  // Get all tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      handleError(error, "Error getting tasks");
    } finally {
      setLoading(false);
    }
  };

  // Get a single task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      handleError(error, "Error getting task");
    } finally {
      setLoading(false);
    }
  };

  // Create a task
  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task);
      setTasks([...tasks, res.data]);
      toast.success("Task created successfully!");
    } catch (error) {
      handleError(error, "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${task._id}`, task);
      const newTasks = tasks.map((tsk) =>
        tsk._id === res.data._id ? res.data : tsk
      );
      setTasks(newTasks);
      toast.success("Task updated successfully!");
    } catch (error) {
      handleError(error, "Error updating task");
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      // remove the task from the tasks array
      await axios.delete(`${serverUrl}/task/${taskId}`);
      const newTasks = tasks.filter((tsk) => tsk._id !== taskId);
      setTasks(newTasks);
      toast.success("Task deleted successfully!");
    } catch (error) {
      handleError(error, "Error deleting task");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    getTasks();
  }, [userId]);

  console.log("Active tasks", activeTasks);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        tasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
