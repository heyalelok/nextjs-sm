import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from "../components/LotteryEntrance"
import Header from "../components/Header"
export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Smart Contract create Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            <LotteryEntrance></LotteryEntrance>
        </div>
    )
}
