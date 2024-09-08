'use client';
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/getAuth";
import { collection, getDocs, deleteDoc, setDoc, query, where, doc, updateDoc } from "firebase/firestore";
import HomePage from "@/components/HomePage";
import Spinner from "@/components/Spinner";

const Home = () => {
  const { user, loading: loadingUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(true);
  const [editTodo, setEditTodo] = useState();
  const [addingTodo, setAddingTodo] = useState(false);

  const focusTodo = (todoID) => {
    if (todoID == null) {
      setAddingTodo(true);
      setEditTodo({
        "id": null,
        "author": "",
        "checked": false,
        "title": "",
        "createdAt": {
            "seconds": 0,
            "nanoseconds": 0
        },
        "description": ""
      });
      return;
    }

    const focusInfo = todos.find(todo => todo.id == todoID);
    setEditTodo(focusInfo);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditTodo({ ...editTodo, [name]: value });
  };

  const saveTodo = async () => {
    if (editTodo.title == "" || editTodo.description == "") {
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id == editTodo.id ? editTodo : todo
    );

    setTodos(updatedTodos);
    setEditTodo(null);

    const newTodo = {
      id: editTodo.id,
      author: user.uid,
      checked: false,
      title: editTodo.title,
      createdAt: new Date().toISOString(),
      description: editTodo.description
    }

    const todoDocRef = doc(db, "todos", newTodo.id);
    await updateDoc(todoDocRef, {
      author: user.uid,
      checked: false,
      title: newTodo.title,
      createdAt: new Date().toISOString(),
      description: newTodo.description
    });
  }

  const addTodo = async () => {
    if (editTodo.title == "" || editTodo.description == "") {
      return;
    }

    setEditTodo(null);
    setAddingTodo(false);

    const newTodoId = doc(collection(db, "todos")).id;
    const todoDocRef = doc(db, "todos", newTodoId);

    const newTodo = {
      id: newTodoId,
      author: user.uid,
      checked: false,
      title: editTodo.title,
      createdAt: new Date().toISOString(),
      description: editTodo.description
    }
    setTodos([newTodo, ...todos]);

    await setDoc(todoDocRef, {
      author: user.uid,
      checked: false,
      title: newTodo.title,
      createdAt: new Date().toISOString(),
      description: newTodo.description
    });
  }

  const deleteTodo = async () => {
    setEditTodo(null);

    if (addingTodo == true) {
      setAddingTodo(false);
      return;
    }

    const updatedTodos = todos.filter((todo) => todo.id !== editTodo.id);
    setTodos(updatedTodos);

    const todoDocRef = doc(db, "todos", editTodo.id);
    await deleteDoc(todoDocRef);
  }

  useEffect(() => {
    const fetchTodos = async () => {
      if (user) {
        try {
          const q = query(
            collection(db, "todos"),
            where("author", "==", user.uid)
          );
        
          const querySnapshot = await getDocs(q);
          
          const fetchedTodos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setTodos(fetchedTodos);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingTodos(false);
        }
      }
    };

    if (user) {
      fetchTodos();
    }
  }, [user]);

  if (loadingUser) {
    return <div className="mt-12"><Spinner /></div>
  }
  
  if (!user) {
    return <HomePage />;
  }

  return (
    <div className="flex flex-col items-center">
      <p className="my-8 text-2xl md:text-4xl font-semibold">Welcome, {user.displayName || (user.email).split("@")[0]}</p>
      {loadingTodos ? (
        <div className="mt-12"><Spinner /></div>
      ) : (
        <div className="flex justify-center flex-wrap">
          <div className="border-2 border-green-700 transition hover:bg-green-700 p-4 rounded-xl w-64 h-48 bg-green-600 m-2 text-white flex items-center justify-center" onClick={() => focusTodo(null)}>
            <p className="text-2xl font-bold">Create Todo</p>
          </div>
          {todos &&
            todos.map((todo, i) => (
              <div className="cursor-pointer border-2 p-4 rounded-xl w-64 h-48 overflow-hidden m-2" onClick={() => focusTodo(todo.id)} key={i}>
                <p className="text-xl text-wrap font-medium line-clamp-2 overflow-hidden text-ellipsis mb-2">{todo.title}</p>
                <p className="line-clamp-4 text-wrap overflow-hidden text-ellipsis whitespace-pre-wrap">{todo.description}</p>
              </div>
            ))
          }
        </div>
      )}
      {editTodo != null && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-15 px-2" onClick={addingTodo ? addTodo : saveTodo}>
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative" onClick={(e) => e.stopPropagation()}>
            <div>
              <label className="block text-lg font-medium mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editTodo.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="mt-3">
              <label
                className="block text-lg font-medium mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editTodo.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg h-24 min-h-12 max-h-48"
              />
            </div>
            <p className="text-gray-400 my-1">Click away to create/save the todo.</p>
            <button onClick={deleteTodo} className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg mr-2">{addingTodo ? "Cancel" : "Delete"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;