import useHttpData from "./hooks/useHttpData";

type User = {
  id?: string;
  name: string;
};

function App() {
  const url = "https://jsonplaceholder.typicode.com/users";
  const {
    loading,
    error,
    data: users,
    addData: addUser,
    deleteData: deleteUser,
    updateData: updateUser,
  } = useHttpData<Users>(url);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Hay un error: {error}</p>;
  }

  return (
    <>
      <button onClick={() => addUser({ name: "Chanchito Feliz" })}>
        Enviar
      </button>
      <button onClick={() => deleteUser(1)}>
        Eliminar
      </button>
      <button onClick={() => updateUser({id:1, name: "Chanchito Feliz"})}>
        Editar 
      </button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
