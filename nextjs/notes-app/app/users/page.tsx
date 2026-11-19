import Link from "next/link";
import { getUsers } from "../services/users";
import { Suspense } from "react";

const UsersList = async () => {
  const users = await getUsers();

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Users = () => {
  return (
    <Suspense fallback={<p>Fetching users...</p>}>
      <UsersList />
    </Suspense>
  );
};

export default Users;
