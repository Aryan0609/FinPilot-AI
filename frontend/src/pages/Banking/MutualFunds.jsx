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

    const [funds,setFunds]=useState([]);

    const [portfolio,setPortfolio]=useState([]);

    const [amounts,setAmounts]=useState({});

    const [accountId,setAccountId]=useState(null);

    const [loading,setLoading]=useState(true);

    const loadData=async()=>{

        try{

            const user=
                (await authService.getCurrentUser()).data;

            setAccountId(user.accountId);

            const fundsResponse=
                await getMutualFunds();

            const portfolioResponse=
                await getPortfolio(user.accountId);

            setFunds(fundsResponse.data);

            setPortfolio(portfolioResponse.data);

        }

        catch(e){

            console.log(e);

        }

        finally{

            setLoading(false);

        }

    };

    useEffect(()=>{

        loadData();

        const timer=
            setInterval(loadData,10000);

        return()=>clearInterval(timer);

    },[]);

    const handleBuy=async(fundId)=>{

        const amount=
            Number(amounts[fundId]);

        if(!amount||amount<=0){

            toast.error("Enter valid amount");

            return;

        }

        try{

            await buyFund(accountId,{
                fundId,
                amount
            });

            toast.success("Investment Successful");

            loadData();

        }

        catch(e){

            toast.error(
                e.response?.data?.message
                ||
                "Unable to buy fund"
            );

        }

    };

    const invested=

        portfolio.reduce(

            (sum,item)=>

                sum+

                Number(item.investedAmount),

            0

        );

    const current=

        portfolio.reduce(

            (sum,item)=>

                sum+

                Number(item.currentValue),

            0

        );

    const profit=current-invested;

    if(loading){

        return(

            <Layout>

                <div className="text-white">

                    Loading...

                </div>

            </Layout>

        );

    }

    return(

        <Layout>

        <motion.div

        initial={{opacity:0,y:20}}

        animate={{opacity:1,y:0}}

        className="space-y-8"

        >

            <div className="rounded-3xl bg-zinc-900 p-8">

                <h1 className="text-4xl font-black text-white">

                    Mutual Funds

                </h1>

                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl bg-zinc-800 p-6">

                        <p className="text-zinc-400">

                            Total Invested

                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">

                            ₹{invested.toFixed(2)}

                        </h2>

                    </div>

                    <div className="rounded-2xl bg-zinc-800 p-6">

                        <p className="text-zinc-400">

                            Current Value

                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white">

                            ₹{current.toFixed(2)}

                        </h2>

                    </div>

                    <div className="rounded-2xl bg-zinc-800 p-6">

                        <p className="text-zinc-400">

                            Profit

                        </p>

                        <h2 className={`mt-3 text-3xl font-black ${profit>=0?"text-green-400":"text-red-400"}`}>

                            ₹{profit.toFixed(2)}

                        </h2>

                    </div>

                </div>

            </div>

            <div className="grid gap-6 md:grid-cols-3">

                {funds.map(fund=>(

                    <div

                    key={fund.id}

                    className="rounded-3xl bg-zinc-900 p-6"

                    >

                        <h2 className="text-2xl font-bold text-white">

                            {fund.fundName}

                        </h2>

                        <p className="mt-2 text-zinc-400">

                            {fund.fundType}

                        </p>

                        <p className="mt-4 text-4xl font-black text-violet-400">

                            ₹{Number(fund.nav).toFixed(2)}

                        </p>

                        <p className="mt-3 text-sm text-zinc-500">

                            Risk : {fund.riskLevel}

                        </p>

                        <input

                        type="number"

                        placeholder="Investment Amount"

                        value={amounts[fund.id]||""}

                        onChange={(e)=>

                            setAmounts({

                                ...amounts,

                                [fund.id]:e.target.value

                            })

                        }

                        className="mt-6 w-full rounded-xl bg-zinc-800 p-3 text-white"

                        />

                        <button

                        onClick={()=>handleBuy(fund.id)}

                        className="mt-4 w-full rounded-xl bg-violet-600 py-3 font-bold text-white"

                        >

                            BUY

                        </button>

                    </div>

                ))}

                            </div>

            <div className="rounded-3xl bg-zinc-900 p-8">

                <h2 className="mb-6 text-3xl font-black text-white">

                    My Portfolio

                </h2>

                {portfolio.length===0 ? (

                    <p className="text-zinc-400">

                        No Investments Yet

                    </p>

                ) : (

                    <div className="space-y-5">

                        {portfolio.map(item=>(

                            <div

                            key={item.investmentId}

                            className="flex flex-col gap-4 rounded-2xl bg-zinc-800 p-6 md:flex-row md:items-center md:justify-between"

                            >

                                <div>

                                    <h3 className="text-xl font-bold text-white">

                                        {item.fundName}

                                    </h3>

                                    <p className="mt-2 text-zinc-400">

                                        Invested ₹

                                        {Number(item.investedAmount).toFixed(2)}

                                    </p>

                                    <p className="text-zinc-400">

                                        Units

                                        {" "}

                                        {Number(item.units).toFixed(4)}

                                    </p>

                                    <p className="text-zinc-400">

                                        Purchase NAV ₹

                                        {Number(item.purchaseNav).toFixed(2)}

                                    </p>

                                    <p className="text-zinc-400">

                                        Current NAV ₹

                                        {Number(item.currentNav).toFixed(2)}

                                    </p>

                                </div>

                                <div className="text-right">

                                    <p className="text-zinc-400">

                                        Current Value

                                    </p>

                                    <h2 className="text-2xl font-black text-white">

                                        ₹

                                        {Number(item.currentValue).toFixed(2)}

                                    </h2>

                                    <p

                                    className={`mt-3 font-bold ${
                                        Number(item.profitLoss)>=0
                                        ?
                                        "text-green-400"
                                        :
                                        "text-red-400"
                                    }`}

                                    >

                                        {Number(item.profitLoss)>=0?"+":"-"}

                                        ₹

                                        {Math.abs(

                                            Number(item.profitLoss)

                                        ).toFixed(2)}

                                    </p>

                                    <button

                                    onClick={async()=>{

                                        const units=prompt(

                                            "Units to Sell"

                                        );

                                        if(!units)return;

                                        try{

                                            await sellFund(

                                                item.investmentId,

                                                Number(units)

                                            );

                                            toast.success(

                                                "Units Sold"

                                            );

                                            loadData();

                                        }

                                        catch(e){

                                            toast.error(

                                                e.response?.data?.message

                                                ||

                                                "Unable to sell"

                                            );

                                        }

                                    }}

                                    className="mt-5 rounded-xl bg-red-600 px-6 py-2 font-bold text-white"

                                    >

                                        SELL

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </motion.div>

        </Layout>

    );

}