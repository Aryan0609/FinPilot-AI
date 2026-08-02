import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaIdCard,
} from "react-icons/fa";

import Layout from "../../layouts/Layout";
import authService from "../../services/authService";
import { getAccount } from "../../services/bankingService";

export default function Profile() {

  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const userRes =
        await authService.getCurrentUser();

      const currentUser = userRes.data;

      setUser(currentUser);

      const accountRes =
        await getAccount(currentUser.accountId);

      setAccount(accountRes.data);

    } catch (err) {

      console.error(err);

    }

  };

  if (!user || !account) {

    return (
      <Layout>
        <div className="text-center text-zinc-400 py-24">
          Loading Profile...
        </div>
      </Layout>
    );

  }

  return (

    <Layout>

      <motion.div
        initial={{opacity:0,y:12}}
        animate={{opacity:1,y:0}}
        className="space-y-8"
      >

        <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-8">

          <div className="flex items-center gap-6">

            <div className="rounded-full bg-violet-600/20 p-6 text-7xl text-violet-400">

              <FaUserCircle />

            </div>

            <div>

              <h1 className="text-4xl font-black text-white">

                {user.fullName}

              </h1>

              <p className="mt-2 text-zinc-400">

                Banking Profile

              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

                    {/* Personal Information */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Personal Information
            </h2>

            <div className="space-y-6">

              <div className="flex items-center gap-4">

                <FaUserCircle className="text-violet-400 text-xl" />

                <div>

                  <p className="text-sm text-zinc-500">
                    Full Name
                  </p>

                  <p className="font-semibold text-white">
                    {user.fullName}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaEnvelope className="text-violet-400 text-xl" />

                <div>

                  <p className="text-sm text-zinc-500">
                    Email
                  </p>

                  <p className="font-semibold text-white">
                    {user.email}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaPhone className="text-violet-400 text-xl" />

                <div>

                  <p className="text-sm text-zinc-500">
                    Phone
                  </p>

                  <p className="font-semibold text-white">
                    {user.phone || "Not Available"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Account Information */}

          <div className="rounded-3xl border border-zinc-800 bg-[#141414] p-6">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Account Information
            </h2>

            <div className="space-y-6">

              <div className="flex items-center gap-4">

                <FaUniversity className="text-violet-400 text-xl" />

                <div>

                  <p className="text-sm text-zinc-500">
                    Account Number
                  </p>

                  <p className="font-semibold text-white">
                    {account.accountNumber}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaIdCard className="text-violet-400 text-xl" />

                <div>

                  <p className="text-sm text-zinc-500">
                    Account ID
                  </p>

                  <p className="font-semibold text-white">
                    #{account.accountId}
                  </p>

                </div>

              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5">

                <div>

                  <p className="text-sm text-zinc-500">
                    Available Balance
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-green-400">
                    ₹{Number(account.balance).toLocaleString()}
                  </h3>

                </div>

                <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </Layout>

  );

}