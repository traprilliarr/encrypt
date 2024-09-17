import getUsers from "../../actions/getUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import UserList from "./components/UserList";
import getCurrentUser from "../../actions/getCurrentUser";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const user = await getCurrentUser();

  return (
    <Sidebar user={user}>
      <div className=" h-full">
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  );
}
