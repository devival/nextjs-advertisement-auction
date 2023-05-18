import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { Input, useNotification } from "web3uikit"
import { ethers } from "ethers"
import AdModal from "./AdModal"
import { useAdContext } from "../contexts/AdContext"

export default function Auction() {
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const auctionAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [bid, setBid] = useState("0")
    const [lastBid, setLastBid] = useState("0")
    const [highestBidder, setHighestBidder] = useState("0")
    const { adImage, adText } = useAdContext()

    const [showModal, setShowModal] = useState(false)

    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const {
        runContractFunction: bidHigher,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: auctionAddress,
        functionName: "bidHigher",
        msgValue: bid,
        params: {},
    })

    /* View Functions */

    const { runContractFunction: getLastBid } = useWeb3Contract({
        abi: abi,
        contractAddress: auctionAddress,
        functionName: "getLastBid",
        params: {},
    })

    const { runContractFunction: getHighestBidder } = useWeb3Contract({
        abi: abi,
        contractAddress: auctionAddress,
        functionName: "getHigestBidder",
        params: {},
    })

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: auctionAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        // const entranceFeeFromCall = (await getEntranceFee()).toString()
        const latestBidFromCall = (await getLastBid()).toString()
        const highestBidderFromCall = (await getHighestBidder()).toString()
        // setEntranceFee(entranceFeeFromCall)
        setLastBid(latestBidFromCall)
        setHighestBidder(highestBidderFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }
    // const handleClick = async (tx) => {
    //     await bidHigher({
    //         onError: (error) => {
    //             console.log(error)
    //         },
    //         onSuccess: () => handleBidSuccess(),
    //     })
    //     try {
    //         await tx.wait(1)
    //         updateUIValues()
    //         handleNewNotification(tx)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const handlePending = () => {
        dispatch({
            type: "info",
            message: "Transaction Pending, do not close the window!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }
    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }
    const placeholder =
        "Bid (has to be higher than " + ethers.utils.formatUnits(lastBid, "ether") + " ETH)"

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Current Winner Ad</h1>
            <div
                className="ad-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "50vh",
                }}
            >
                {adImage && (
                    <img src={adImage} alt="Ad" style={{ maxWidth: "100%", height: "auto" }} />
                )}
                <p style={{ marginTop: "1em", textAlign: "center" }}>
                    {adText || "Loading text..."}
                </p>
            </div>
            <div style={{ marginTop: "2em" }}>
                {auctionAddress ? (
                    <>
                        <AdModal isVisible={showModal} onClose={hideModal} />
                        <Input
                            label={placeholder}
                            onChange={(event) => {
                                setBid(ethers.utils.parseEther(event.target.value))
                            }}
                        />
                        <br></br>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async () => {
                                handlePending
                                await bidHigher({
                                    // onComplete:
                                    // onError:
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Place a bid"
                            )}
                        </button>
                        <div>
                            <br></br>
                            Do not close the window until the transaction is complete. <br></br>
                            Otherwise you won't be able to place an ad.
                        </div>
                        <div>
                            <br></br>Current bid: {ethers.utils.formatUnits(lastBid, "ether")} ETH
                        </div>
                        <div>Current higest bidder: {highestBidder}</div>
                    </>
                ) : (
                    <div>Please connect to a supported chain </div>
                )}
            </div>
        </div>
    )
}
