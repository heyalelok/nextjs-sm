// have a function to call Lottery
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const dispatch = useNotification()
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumPlayer] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    // console.log(raffleAddress)

    const { runContractFunction: getEntranceFeed } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFeed",
        params: {},
    })
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getNumberOfPlyaers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlyaers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFeed()).toString()
        setEntranceFee(entranceFeeFromCall)
        // console.log(entranceFee)
        // console.log(`entranceFee ${entranceFee}`)
        const numPlayerFromCall = (await getNumberOfPlyaers()).toString()
        setNumPlayer(numPlayerFromCall)
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }
    return (
        <div className="p-5">
            From lottery entrace!
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto "
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>

                    <div>entranceFee : {ethers.utils.formatUnits(entranceFee, "ether")} ETH </div>
                    <div>Players :{numPlayer}</div>
                    <div>recentWinner:{recentWinner}</div>
                </div>
            ) : (
                <div> No Raffle Address Deteched!</div>
            )}
            {/* {entranceFee} ETH */}
        </div>
    )
}
