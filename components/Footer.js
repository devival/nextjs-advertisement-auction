import Link from "next/link"

export default function Footer() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-2xl">Deployed to Sepolia Network</h1>
            <div className="flex flex-row items-center">
                <Link href="https://sepolia.etherscan.io/address/0x9070503ff37F88223dFdA79A89EBd463B377A0f4#code">
                    <a className="mr-4 p-6">Contract Address</a>
                </Link>

                <Link href="https://github.com/devival/nextjs-advertisement-auction">
                    <a className="mr-4 p-6">GitHub Repo</a>
                </Link>
                <Link href="https://github.com/devival/">
                    <a className="mr-4 p-6">by Devival</a>
                </Link>
            </div>
        </nav>
    )
}
