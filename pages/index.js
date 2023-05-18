import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import Auction from "../components/Auction"
import { useMoralis } from "react-moralis"
import { AdProvider, useAdContext } from "../contexts/AdContext"

const supportedChains = ["11155111"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { adImage, adText } = useAdContext()

    return (
        <div className={styles.container}>
            <Head>
                <title>Advertisement Auction</title>
                <meta name="description" content="Created by Devival" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row">
                            <AdProvider>
                                <Auction className="p-8" />
                            </AdProvider>
                        </div>
                    ) : (
                        <div>{`Please switch to a supported chainId. The supported Chain Id is: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
            <Footer />
        </div>
    )
}
