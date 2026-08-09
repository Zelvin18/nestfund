import type { Metadata } from "next"
import LegalPage from "@/components/legal/LegalPage"

export const metadata: Metadata = {
  title: "Terms of Service — NestFund",
  description: "The terms and conditions governing your use of the NestFund real estate investment platform.",
}

const sections = [
  {
    title: "1. About NestFund",
    body: "NestFund Limited (\"NestFund\", \"we\", \"us\") operates a digital platform that enables users to purchase fractional shares in verified real estate properties, receive proportional rental income distributions, and trade shares with other investors. NestFund is regulated by the Capital Markets Authority of Uganda.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 18 years old and complete our Know Your Customer (KYC) verification process before investing. By creating an account you confirm that all information you provide is accurate and that you are legally permitted to invest under the laws of your country of residence.",
  },
  {
    title: "3. Investment Structure",
    body: "Each property listed on NestFund is held by a special purpose vehicle (SPV). When you purchase shares, you acquire a beneficial interest in the relevant SPV proportional to your shareholding. Share ownership entitles you to proportional rental income distributions and proceeds from any sale of the property.",
  },
  {
    title: "4. Risks",
    body: "All investments carry risk. Property values can fall as well as rise, rental income is not guaranteed, and liquidity on the Exchange depends on the presence of willing buyers. Past performance is not indicative of future results. You should not invest money you cannot afford to lose, and nothing on this platform constitutes financial advice.",
  },
  {
    title: "5. Fees",
    body: "NestFund charges a transaction fee on share purchases and sales, and a management fee on rental income distributions. All applicable fees are displayed clearly before you confirm any transaction.",
  },
  {
    title: "6. Distributions",
    body: "Rental income distributions are made monthly to your NestFund wallet, normally within the first five business days of each month, after deduction of property expenses and management fees. Distributions depend on actual rental collections for the period.",
  },
  {
    title: "7. Account Termination",
    body: "You may close your account at any time after selling or transferring your holdings. We may suspend or terminate accounts that breach these terms, provide false information, or engage in fraudulent or unlawful activity.",
  },
  {
    title: "8. Limitation of Liability",
    body: "To the maximum extent permitted by law, NestFund shall not be liable for indirect or consequential losses, losses arising from market movements, or events outside our reasonable control. Nothing in these terms excludes liability that cannot be excluded by law.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may update these terms from time to time. We will notify you of material changes by email or platform notice at least 14 days before they take effect. Continued use of the platform after changes take effect constitutes acceptance.",
  },
  {
    title: "10. Contact",
    body: "Questions about these terms can be sent to legal@nestfund.io.",
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of Service"
      updated="Last updated: 1 August 2026"
      sections={sections}
    />
  )
}
