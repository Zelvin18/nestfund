import type { Metadata } from "next"
import LegalPage from "@/components/legal/LegalPage"

export const metadata: Metadata = {
  title: "Privacy Policy — NestFund",
  description: "How NestFund collects, uses, and protects your personal information.",
}

const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide when creating an account (name, email, phone number), completing KYC verification (identity documents, proof of address), and transacting on the platform (investment history, wallet transactions). We also collect technical data such as device type and usage analytics to improve the product.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used to verify your identity as required by law, process investments and distributions, provide customer support, detect and prevent fraud, and send you service communications. With your consent, we may also send product updates and market insights.",
  },
  {
    title: "3. Sharing",
    body: "We share data only with service providers essential to operating the platform — identity verification partners, payment processors, and cloud infrastructure providers — and with regulators where legally required. We never sell your personal data.",
  },
  {
    title: "4. Security",
    body: "All data is encrypted in transit and at rest. Access to personal data is restricted to authorized personnel on a need-to-know basis, and we maintain audit logs of all access to sensitive records.",
  },
  {
    title: "5. Retention",
    body: "We retain personal data for as long as your account is active and thereafter as required by financial regulations (typically seven years for transaction records). You may request deletion of data we are not legally required to keep.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, correct, or export your personal data, and to object to or restrict certain processing. To exercise any of these rights, contact privacy@nestfund.io. You may also lodge a complaint with the Personal Data Protection Office of Uganda.",
  },
  {
    title: "7. Cookies",
    body: "We use essential cookies to keep you signed in and analytics cookies to understand how the platform is used. You can control non-essential cookies through your browser settings.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this policy from time to time. Material changes will be notified by email or platform notice before they take effect.",
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      label="Legal"
      title="Privacy Policy"
      updated="Last updated: 1 August 2026"
      sections={sections}
    />
  )
}
