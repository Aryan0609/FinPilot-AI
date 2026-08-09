import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import Layout from "../../layouts/Layout";

import authService from "../../services/authService";

import {
    getMutualFunds,
    getPortfolio,
    buyFund,
    sellFund
} from "../../services/bankingService";

export default function MutualFunds() {

    const [funds, setFunds] = useState([]);

    const [portfolio, setPortfolio] = useState([]);

    const [amounts, setAmounts] = useState({});

    const [accountId, setAccountId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [buyingFund, setBuyingFund] = useState(null);

    const [sellingInvestment, setSellingInvestment] = useState(null);


    // =========================================================
    // LOAD MUTUAL FUNDS
    // =========================================================

    const loadFunds = async () => {

        try {

            const response = await getMutualFunds();

            setFunds(response.data || []);

        } catch (error) {

            console.error(
                "Unable to load mutual funds:",
                error
            );

        }

    };


    // =========================================================
    // LOAD ALL USER DATA
    // =========================================================

    const loadData = async () => {

        try {

            const userResponse =
                await authService.getCurrentUser();

            const user =
                userResponse.data;

            setAccountId(user.accountId);


            const fundsResponse =
                await getMutualFunds();

            const portfolioResponse =
                await getPortfolio(user.accountId);


            setFunds(
                fundsResponse.data || []
            );

            setPortfolio(
                portfolioResponse.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load mutual fund data:",
                error
            );

            toast.error(
                "Unable to load mutual fund data"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD + REAL-TIME REFRESH
    // =========================================================

    useEffect(() => {

        loadData();

        const timer =
            setInterval(
                loadData,
                10000
            );

        return () =>
            clearInterval(timer);

    }, []);


    // =========================================================
    // BUY MUTUAL FUND
    // =========================================================

    const handleBuy = async (fundId) => {

        const amount =
            Number(amounts[fundId]);


        if (!amount || amount <= 0) {

            toast.error(
                "Enter a valid investment amount"
            );

            return;

        }


        if (!accountId) {

            toast.error(
                "Account not available"
            );

            return;

        }


        try {

            setBuyingFund(fundId);


            await buyFund(
                accountId,
                {
                    fundId,
                    amount
                }
            );


            toast.success(
                "Investment Successful"
            );


            setAmounts({
                ...amounts,
                [fundId]: ""
            });


            await loadData();

        } catch (error) {

            console.error(
                "Buy fund error:",
                error
            );


            toast.error(
                error.response?.data?.message
                ||
                "Unable to buy fund"
            );

        } finally {

            setBuyingFund(null);

        }

    };


    // =========================================================
    // SELL MUTUAL FUND
    // =========================================================

    const handleSell = async (
        investmentId,
        availableUnits
    ) => {

        const units =
            window.prompt(
                `Units to sell (Available: ${Number(
                    availableUnits || 0
                ).toFixed(4)})`
            );


        if (
            units === null ||
            units.trim() === ""
        ) {

            return;

        }


        const numericUnits =
            Number(units);


        if (
            !numericUnits ||
            numericUnits <= 0
        ) {

            toast.error(
                "Enter valid units"
            );

            return;

        }


        if (
            numericUnits >
            Number(availableUnits)
        ) {

            toast.error(
                "You cannot sell more units than you own"
            );

            return;

        }


        try {

            setSellingInvestment(
                investmentId
            );


            await sellFund(
                investmentId,
                numericUnits
            );


            toast.success(
                "Units Sold Successfully"
            );


            await loadData();

        } catch (error) {

            console.error(
                "Sell fund error:",
                error
            );


            toast.error(
                error.response?.data?.message
                ||
                "Unable to sell units"
            );

        } finally {

            setSellingInvestment(null);

        }

    };


    // =========================================================
    // PORTFOLIO CALCULATIONS
    // =========================================================

    const invested =
        portfolio.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.investedAmount || 0
                ),
            0
        );


    const current =
        portfolio.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.currentValue || 0
                ),
            0
        );


    const totalUnits =
        portfolio.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.units || 0
                ),
            0
        );


    const profit =
        current - invested;


    const profitPercentage =
        invested > 0
            ? (profit / invested) * 100
            : 0;


    // =========================================================
    // FORMATTERS
    // =========================================================

    const formatMoney = (value) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    const formatNumber = (
        value,
        digits = 4
    ) => {

        return Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: digits
            }
        );

    };


    const formatDate = (value) => {

        if (!value) {

            return "N/A";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleString(
            "en-IN"
        );

    };


    // =========================================================
    // LOADING STATE
    // =========================================================

    if (loading) {

        return (

            <Layout>

                <div className="flex min-h-[60vh] items-center justify-center">

                    <div className="rounded-2xl bg-zinc-900 px-8 py-6">

                        <p className="text-white">

                            Loading mutual funds...

                        </p>

                    </div>

                </div>

            </Layout>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <Layout>

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20
                }}

                animate={{
                    opacity: 1,
                    y: 0
                }}

                className="space-y-8"

            >


                {/* =================================================
                    HEADER + PORTFOLIO SUMMARY
                ================================================= */}

                <div className="rounded-3xl bg-zinc-900 p-8">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                        <div>

                            <h1 className="text-4xl font-black text-white">

                                Mutual Funds

                            </h1>

                            <p className="mt-2 text-zinc-400">

                                Invest in mutual funds and track your portfolio in real time.

                            </p>

                        </div>


                        <div className="rounded-xl bg-zinc-800 px-4 py-3">

                            <p className="text-xs text-zinc-500">

                                LIVE NAV

                            </p>

                            <p className="text-sm font-bold text-green-400">

                                Auto refresh: 10 seconds

                            </p>

                        </div>

                    </div>


                    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">


                        {/* TOTAL INVESTED */}

                        <div className="rounded-2xl bg-zinc-800 p-6">

                            <p className="text-sm text-zinc-400">

                                Total Invested

                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">

                                {formatMoney(invested)}

                            </h2>

                        </div>


                        {/* CURRENT VALUE */}

                        <div className="rounded-2xl bg-zinc-800 p-6">

                            <p className="text-sm text-zinc-400">

                                Current Value

                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">

                                {formatMoney(current)}

                            </h2>

                        </div>


                        {/* PROFIT */}

                        <div className="rounded-2xl bg-zinc-800 p-6">

                            <p className="text-sm text-zinc-400">

                                Profit / Loss

                            </p>

                            <h2
                                className={`mt-3 text-3xl font-black ${
                                    profit >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >

                                {profit >= 0
                                    ? "+"
                                    : "-"

                                }

                                {formatMoney(
                                    Math.abs(profit)
                                )}

                            </h2>

                            <p
                                className={`mt-2 text-sm ${
                                    profitPercentage >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`}
                            >

                                {profitPercentage >= 0
                                    ? "+"
                                    : ""
                                }

                                {profitPercentage.toFixed(2)}%

                            </p>

                        </div>


                        {/* TOTAL UNITS */}

                        <div className="rounded-2xl bg-zinc-800 p-6">

                            <p className="text-sm text-zinc-400">

                                Total Units

                            </p>

                            <h2 className="mt-3 text-3xl font-black text-white">

                                {formatNumber(
                                    totalUnits,
                                    4
                                )}

                            </h2>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    AVAILABLE FUNDS
                ================================================= */}

                <div>

                    <div className="mb-5">

                        <h2 className="text-3xl font-black text-white">

                            Available Funds

                        </h2>

                        <p className="mt-1 text-zinc-400">

                            Current NAV is loaded directly from the banking service.

                        </p>

                    </div>


                    {funds.length === 0 ? (

                        <div className="rounded-3xl bg-zinc-900 p-8">

                            <p className="text-zinc-400">

                                No mutual funds available.

                            </p>

                        </div>

                    ) : (

                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                            {funds.map(
                                (fund) => (

                                    <motion.div

                                        key={fund.id}

                                        whileHover={{
                                            y: -4
                                        }}

                                        className="rounded-3xl bg-zinc-900 p-6"

                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <h2 className="text-2xl font-bold text-white">

                                                    {fund.fundName}

                                                </h2>

                                                <p className="mt-2 text-zinc-400">

                                                    {fund.fundType}

                                                </p>

                                            </div>


                                            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400">

                                                {fund.riskLevel}

                                            </span>

                                        </div>


                                        <div className="mt-6">

                                            <p className="text-sm text-zinc-500">

                                                Current NAV

                                            </p>

                                            <p className="mt-1 text-4xl font-black text-violet-400">

                                                {formatMoney(
                                                    fund.nav
                                                )}

                                            </p>

                                        </div>


                                        {fund.annualReturn !== undefined &&
                                            fund.annualReturn !== null && (

                                                <div className="mt-4">

                                                    <p className="text-sm text-zinc-500">

                                                        Annual Return

                                                    </p>

                                                    <p className="mt-1 font-bold text-green-400">

                                                        {Number(
                                                            fund.annualReturn
                                                        ).toFixed(2)}
                                                        %

                                                    </p>

                                                </div>

                                            )}


                                        <div className="mt-6">

                                            <input

                                                type="number"

                                                min="1"

                                                step="0.01"

                                                placeholder="Investment Amount"

                                                value={
                                                    amounts[
                                                        fund.id
                                                    ] || ""
                                                }

                                                onChange={(
                                                    event
                                                ) =>

                                                    setAmounts({

                                                        ...amounts,

                                                        [fund.id]:
                                                            event.target.value

                                                    })

                                                }

                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-white outline-none transition focus:border-violet-500"

                                            />


                                            <button

                                                onClick={() =>
                                                    handleBuy(
                                                        fund.id
                                                    )
                                                }

                                                disabled={
                                                    buyingFund ===
                                                    fund.id
                                                }

                                                className="mt-4 w-full rounded-xl bg-violet-600 py-3 font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"

                                            >

                                                {buyingFund ===
                                                fund.id

                                                    ? "BUYING..."

                                                    : "BUY"

                                                }

                                            </button>

                                        </div>

                                    </motion.div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================================
                    USER PORTFOLIO
                ================================================= */}

                <div className="rounded-3xl bg-zinc-900 p-8">

                    <div className="mb-6">

                        <h2 className="text-3xl font-black text-white">

                            My Portfolio

                        </h2>

                        <p className="mt-1 text-zinc-400">

                            Your mutual fund holdings and live valuation.

                        </p>

                    </div>


                    {portfolio.length === 0 ? (

                        <div className="rounded-2xl bg-zinc-800 p-8 text-center">

                            <p className="text-zinc-400">

                                No Investments Yet

                            </p>

                            <p className="mt-2 text-sm text-zinc-500">

                                Buy a mutual fund above to start your portfolio.

                            </p>

                        </div>

                    ) : (

                        <div className="space-y-5">

                            {portfolio.map(
                                (item) => {

                                    const itemInvested =
                                        Number(
                                            item.investedAmount ||
                                            0
                                        );

                                    const itemCurrent =
                                        Number(
                                            item.currentValue ||
                                            0
                                        );

                                    const itemProfit =
                                        Number(
                                            item.profitLoss ||
                                            0
                                        );

                                    const itemUnits =
                                        Number(
                                            item.units ||
                                            0
                                        );

                                    const itemReturn =
                                        itemInvested > 0
                                            ? (
                                                itemProfit /
                                                itemInvested
                                            ) * 100
                                            : 0;


                                    return (

                                        <div

                                            key={
                                                item.investmentId
                                            }

                                            className="rounded-2xl bg-zinc-800 p-6"

                                        >

                                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                                                {/* FUND DETAILS */}

                                                <div className="flex-1">

                                                    <h3 className="text-xl font-bold text-white">

                                                        {item.fundName}

                                                    </h3>


                                                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                                                        <div>

                                                            <p className="text-xs text-zinc-500">

                                                                Invested

                                                            </p>

                                                            <p className="mt-1 font-semibold text-white">

                                                                {formatMoney(
                                                                    itemInvested
                                                                )}

                                                            </p>

                                                        </div>


                                                        <div>

                                                            <p className="text-xs text-zinc-500">

                                                                Units

                                                            </p>

                                                            <p className="mt-1 font-semibold text-white">

                                                                {formatNumber(
                                                                    itemUnits
                                                                )}

                                                            </p>

                                                        </div>


                                                        <div>

                                                            <p className="text-xs text-zinc-500">

                                                                Purchase NAV

                                                            </p>

                                                            <p className="mt-1 font-semibold text-white">

                                                                {formatMoney(
                                                                    item.purchaseNav
                                                                )}

                                                            </p>

                                                        </div>


                                                        <div>

                                                            <p className="text-xs text-zinc-500">

                                                                Current NAV

                                                            </p>

                                                            <p className="mt-1 font-semibold text-violet-400">

                                                                {formatMoney(
                                                                    item.currentNav
                                                                )}

                                                            </p>

                                                        </div>

                                                    </div>


                                                    {item.investmentDate && (

                                                        <p className="mt-4 text-xs text-zinc-500">

                                                            Investment Date:{" "}

                                                            {formatDate(
                                                                item.investmentDate
                                                            )}

                                                        </p>

                                                    )}

                                                </div>


                                                {/* VALUE + PROFIT */}

                                                <div className="min-w-[220px] lg:text-right">

                                                    <p className="text-sm text-zinc-400">

                                                        Current Value

                                                    </p>

                                                    <h2 className="mt-1 text-3xl font-black text-white">

                                                        {formatMoney(
                                                            itemCurrent
                                                        )}

                                                    </h2>


                                                    <p
                                                        className={`mt-2 font-bold ${
                                                            itemProfit >= 0
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                        }`}
                                                    >

                                                        {itemProfit >= 0
                                                            ? "+"
                                                            : "-"
                                                        }

                                                        {formatMoney(
                                                            Math.abs(
                                                                itemProfit
                                                            )
                                                        )}

                                                        {" "}

                                                        (
                                                        {itemReturn >= 0
                                                            ? "+"
                                                            : ""
                                                        }

                                                        {itemReturn.toFixed(
                                                            2
                                                        )}

                                                        %)

                                                    </p>


                                                    <button

                                                        onClick={() =>
                                                            handleSell(
                                                                item.investmentId,
                                                                itemUnits
                                                            )
                                                        }

                                                        disabled={
                                                            sellingInvestment ===
                                                            item.investmentId
                                                        }

                                                        className="mt-5 rounded-xl bg-red-600 px-6 py-2 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"

                                                    >

                                                        {sellingInvestment ===
                                                        item.investmentId

                                                            ? "SELLING..."

                                                            : "SELL"

                                                        }

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>

            </motion.div>

        </Layout>

    );

}