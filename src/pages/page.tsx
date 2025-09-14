// import React from "react";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../app/hooks";
import { setError, setLoading, setTodos } from "../app/slice/slice";

const Todolist = () => {
  const dispatch = useDispatch();
  const { todos, error, loading } = useAppSelector((state) => state.todos);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTodo, setNewTodo] = useState({
    title: "",
    userId: "",
    completed: false,
  });
useEffect(() => {
  const savedTodo = localStorage.getItem("todos");
  const localTodos = savedTodo ? JSON.parse(savedTodo) : [];

  (async () => {
    try {
      dispatch(setError(false));
      dispatch(setLoading(true));

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/"
      );
      const data = await response.json();

      const merged = [...data, ...localTodos];
      dispatch(setTodos(merged));

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(true));
      console.log(error);
    }
  })();
}, [dispatch]);


  if (error) {
    return <h1>Something went wrong</h1>;
  }
  if (loading) {
    return <h2>...loading</h2>;
  }

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToList = () => {
    const nextId = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;

    const newTodoItem = {
      id: nextId,
      title: newTodo.title,
      completed: newTodo.completed,
      userId: Number(newTodo.userId),
    };

    dispatch(setTodos([...todos, newTodoItem]));

    setNewTodo({
      title: "",
      userId: "",
      completed: false,
    });
  };

  return (
    <div className="transform translate-x-52  ">
      <input
        type="search"
        className="  border"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <h1 className="text-xl font-bold mb-4">Todo List</h1>

      <input
        type="text"
        name="userId"
        value={newTodo.userId}
        onChange={handleChange}
        className=" border"
      />
      <input
        type="text"
        name="title"
        value={newTodo.title}
        className=" border"
        onChange={handleChange}
      />
   
      <select
        name="true"
        id=""
        value={newTodo.completed ? "true" : "false"}
        onChange={(e) =>
          setNewTodo((prev) => ({
            ...prev,
            completed: e.target.value === "true"
,
          }))
        }
        className=" border"
      >
        <option value="false">Incomplete</option>
        <option value="true">Completed</option>
      </select>
      <button className="m-7" onClick={handleAddToList}>
        Add
      </button>

      <ul className="list-disc pl-5 space-y-2">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`p-2 border rounded ${
              todo.completed ? "line-through text-gray-500" : ""
            }`}
          >
            <p>
              <strong>User:</strong> {todo.userId}
            </p>
            <p>
              <strong>Title:</strong> {todo.title}
            </p>
            <p>
              <strong>Status:</strong>
              {todo.completed
                ? "✅ Completed"
                : "❌                  Not Completed"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todolist;
