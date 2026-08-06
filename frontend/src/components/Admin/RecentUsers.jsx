import { useEffect, useState } from "react";
import { getRecentUsers } from "../../services/adminService";

export default function RecentUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const response = await getRecentUsers();
        setUsers(response.data);
    };

    return (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Recent Users
            </h2>

            {users.map(user => (

                <div
                    key={user.id}
                    className="flex justify-between border-b border-zinc-800 py-3"
                >

                    <div>

                        <p className="text-white">
                            {user.name}
                        </p>

                        <p className="text-sm text-zinc-500">
                            {user.email}
                        </p>

                    </div>

                    <span className="text-green-400">
                        {user.roles.join(", ")}
                    </span>

                </div>

            ))}

        </div>
    );
}