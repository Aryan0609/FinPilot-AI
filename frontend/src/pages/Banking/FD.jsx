import { useEffect, useState } from "react";
import fdService from "../../services/fdService";
import FDCard from "../../components/Investment/FDCard";

export default function FD() {

  const [fds, setFds] = useState([]);

  const [amount, setAmount] = useState("");

  const [tenureMonths, setTenureMonths] =
    useState(12);

  const userId = 1;
  const accountId = 1;

  const loadFDs = async () => {

    try {

      const data =
        await fdService.getUserFDs(userId);

      setFds(data);

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    loadFDs();
  }, []);

  const handleCreateFD = async (e) => {

    e.preventDefault();

    try {

      await fdService.createFD({
        accountId,
        amount,
        tenureMonths
      });

      setAmount("");
      loadFDs();

    } catch (err) {

      console.error(err);

    }
  };

  const handleCloseFD = async (fdId) => {

    try {

      await fdService.closeFD(fdId);

      loadFDs();

    } catch (err) {

      console.error(err);

    }
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Fixed Deposits
      </h1>
      

      <form
        onSubmit={handleCreateFD}
        className="bg-white p-4 rounded shadow mb-6"
      >

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="border p-2 mr-2"
          required
        />

        <select
          value={tenureMonths}
          onChange={(e) =>
            setTenureMonths(
              Number(e.target.value)
            )
          }
          className="border p-2 mr-2"
        >
          <option value="12">12 Months</option>
          <option value="24">24 Months</option>
          <option value="36">36 Months</option>
          <option value="60">60 Months</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create FD
        </button>

      </form>

      <div className="grid md:grid-cols-2 gap-4">

        {fds.map((fd) => (
          <FDCard
            key={fd.id}
            fd={fd}
            onClose={handleCloseFD}
          />
        ))}

      </div>

    </div>
  );
}