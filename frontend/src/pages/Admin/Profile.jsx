import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../services/api";

export default function Profile() {

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const response = await api.get("/auth/me");

      setProfile(response.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <AdminLayout>

        <div className="text-white text-2xl">

          Loading Profile...

        </div>

      </AdminLayout>

    );

  }

  return (

    <AdminLayout>

      <div className="max-w-3xl">

        <h1 className="text-4xl font-bold text-white mb-8">

          Admin Profile

        </h1>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8">

          <div className="space-y-6">

            <div>

              <p className="text-gray-400">

                Name

              </p>

              <h2 className="text-2xl text-white font-semibold">

                {profile.name}

              </h2>

            </div>

            <div>

              <p className="text-gray-400">

                Email

              </p>

              <h2 className="text-xl text-white">

                {profile.email}

              </h2>

            </div>

            <div>

              <p className="text-gray-400">

                Phone

              </p>

              <h2 className="text-xl text-white">

                {profile.phone}

              </h2>

            </div>

            <div>

              <p className="text-gray-400">

                Account Number

              </p>

              <h2 className="text-xl text-white">

                {profile.accountNumber}

              </h2>

            </div>

            <div>

              <p className="text-gray-400">

                Balance

              </p>

              <h2 className="text-xl text-green-400">

                ₹{profile.balance}

              </h2>

            </div>

            <div>

              <p className="text-gray-400">

                Role

              </p>

              <div className="flex gap-3 mt-2">

                {profile.roles.map((role) => (

                  <span
                    key={role}
                    className="bg-violet-600 px-4 py-2 rounded-full text-white"
                  >
                    {role}
                  </span>

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}