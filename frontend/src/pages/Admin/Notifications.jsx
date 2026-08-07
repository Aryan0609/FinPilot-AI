import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getNotifications } from "../../services/adminService";

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {

    try {

      const response = await getNotifications();

      setNotifications(response.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  return (

    <AdminLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-white">

            Notifications

          </h1>

          <p className="mt-2 text-gray-400">

            Latest banking activities.

          </p>

        </div>

        <div className="space-y-5">

          {loading ? (

            <div className="text-white text-xl">

              Loading...

            </div>

          ) : notifications.length === 0 ? (

            <div className="text-gray-400">

              No notifications available.

            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 hover:border-[#7C5CFF] transition"
              >

                <h2 className="text-lg font-semibold text-white">

                  🔔 {notification.message}

                </h2>

                <p className="mt-2 text-sm text-gray-400">

                  {new Date(notification.time).toLocaleString()}

                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </AdminLayout>

  );

}