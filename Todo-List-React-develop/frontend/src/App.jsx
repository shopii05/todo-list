import TodoItem from "./TodoItem";
import { useState, useEffect } from "react";

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState("");

  // ================================
  // 1. Cargar tareas desde el backend
  // ================================
  const cargarTareas = async () => {
    try {
      const res = await fetch("https://todo-list-backend.onrender.com/tareas");
      const data = await res.json();
      setTareas(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  useEffect(() => {
    cargarTareas();
  }, []);

  // ================================
  // 2. Agregar tarea al backend
  // ================================
  const agregarTarea = async () => {
    if (!input.trim()) return;

    try {
      await fetch("http://localhost:3001/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input })
      });

      setInput("");
      cargarTareas(); // recargar lista

    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  // ================================
  // 3. Alternar completado
  // ================================
  const toggleCompleted = async (id, currentCompleted) => {
    try {
      await fetch(`http://localhost:3001/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted })
      });

      cargarTareas();

    } catch (error) {
      console.error("Error actualizando tarea:", error);
    }
  };

  // ================================
  // 4. Eliminar tarea
  // ================================
  const eliminarTarea = async (id) => {
    try {
      await fetch(`http://localhost:3001/tareas/${id}`, {
        method: "DELETE",
      });

      cargarTareas();

    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
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
              toggleCompleted={() => toggleCompleted(tarea.id, tarea.completed)}
              eliminarTarea={() => eliminarTarea(tarea.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
