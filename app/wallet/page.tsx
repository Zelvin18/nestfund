import WalletPage from "@/components/wallet/WalletPage"
import SignInGate from "@/components/auth/SignInGate"

export const metadata = {
  title: "Wallet — NestFund",
  description: "Manage your investment funds",
}

export default function Wallet() {
  return (
    <SignInGate
      title="Your wallet is private"
      description="Sign in to see your balance, deposit or withdraw funds, and review your transaction history. This page only ever shows your own account."
    >
      <WalletPage />
    </SignInGate>
  )
}
