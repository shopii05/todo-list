import TodoItem from "./TodoItem"
import { useState, useEffect } from "react"

export default function App() {

  const [tareas, setTareas] = useState([]);
  const [input, setInput] = useState("");

  // URL de la API
  const envApi = import.meta.env.VITE_API_URL;
  const defaultLocal = "http://localhost:3001";
  const PROD_BACKEND = "https://todo-list-backend-8eq5.onrender.com";
  let inferredApi = envApi || defaultLocal;
  if (!envApi && typeof window !== "undefined" && window.location && window.location.hostname !== "localhost") {
    inferredApi = PROD_BACKEND;
  }
  const API = inferredApi;

  // Cargar tareas desde el backend al iniciar
  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const res = await fetch(`${API}/tareas`);
        if (!res.ok) throw new Error("Error al obtener tareas");
        const data = await res.json();
        setTareas(data.map(t => ({ id: t.id, text: t.descripcion, completed: t.completado })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchTareas();
  }, [API]);

  // Agregar tarea
  const agregarTarea = () => {
    if (input.trim()) {
      (async () => {
        try {
          const res = await fetch(`${API}/tareas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion: input.trim() })
          });
          if (!res.ok) throw new Error("Error al crear tarea");
          const nueva = await res.json();
          setTareas([
            ...tareas,
            { id: nueva.id, text: nueva.descripcion, completed: nueva.completado }
          ]);
          setInput("");
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }

  // Tachar tarea (actualizar en backend)
  const toggleCompleted = (id) => {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    (async () => {
      try {
        const res = await fetch(`${API}/tareas/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completado: !tarea.completed })
        });
        if (!res.ok) throw new Error("Error al actualizar tarea");
        setTareas(
          tareas.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      } catch (err) {
        console.error(err);
      }
    })();
  };

  // Eliminar tarea (DELETE al backend)
  const eliminarTarea = (id) => {
    (async () => {
      try {
        const res = await fetch(`${API}/tareas/${id}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Error al eliminar tarea");
        setTareas(tareas.filter((tarea) => tarea.id !== id));
      } catch (err) {
        console.error(err);
      }
    })();
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-2 rounded shadow">
      <h1 className="text-3xl font-bold mb-5 text-center">TODO LIST APP</h1>

      <div className="flex gap-3 mb-5">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Añadir Tarea"

          // 👇 ESTE ES EL CÓDIGO QUE AÑADE TAREAS AL PRESIONAR ENTER
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              agregarTarea();
            }
          }}
        />

        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          onClick={agregarTarea}
        >
          Añadir Tareas
        </button>
      </div>

      <div className="space-y-2">
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
  )
}
