import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ first_name: "", last_name: "", email: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditedUser({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser}`, editedUser);
      setUsers(users.map(user => (user.id === editingUser ? { ...user, ...editedUser } : user)));
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black py-10 ">
      <h2 className="text-3xl font-semibold mb-6 text-white">Users List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-blue-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <img src={user.avatar} alt={user.first_name} className="w-20 h-20 rounded-full mb-3" />
            {editingUser === user.id ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editedUser.first_name}
                  onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="text"
                  value={editedUser.last_name}
                  onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-lg">Update</button>
                <button onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">Cancel</button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex mt-4 space-x-2">
                  <button onClick={() => handleEditClick(user)} className="bg-violet-500 text-white px-4 py-2 rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="bg-black text-white px-4 py-2 rounded-lg">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg text-black ${page === 1 ? "bg-gray-400" : "bg-yellow-200 hover:bg-yellow-400"}`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg text-black ${page === totalPages ? "bg-gray-400" : "bg-yellow-200 hover:bg-yellow-400"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
