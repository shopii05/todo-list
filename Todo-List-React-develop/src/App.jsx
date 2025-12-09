import TodoItem from "./TodoItem";
import { useState } from "react";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState("");

  const agregarTarea = () => {
    if (input.trim()) {
      setTareas([
        ...tareas,
        { id: Date.now(), text: input.trim(), completed: false }
      ]);
      setInput("");
    }
  };

  const toggleCompleted = (id) => {
    setTareas(
      tareas.map((tarea) =>
        tarea.id === id ? { ...tarea, completed: !tarea.completed } : tarea
      )
    );
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 bg-red-100/10">

      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl">

        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
          MI LISTA DE TAREAS REACT
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg outline-none"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nueva tarea"
          />

          {/* BOTÓN LILA */}
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-3 rounded-lg font-semibold"
            onClick={agregarTarea}
          >
            Agregar
          </button>
        </div>

        {tareas.length === 0 && (
          <p className="text-center text-gray-500 italic text-lg">
            No hay tareas
          </p>
        )}

        <div className="space-y-3 mt-4">
          {tareas.map((tarea) => (
            <TodoItem
              key={tarea.id}
              tarea={tarea}
              toggleCompleted={toggleCompleted}
              eliminarTarea={eliminarTarea}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
