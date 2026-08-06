# NestFund — The Real Estate Investment Market

NestFund is a next-generation real estate investment platform that transforms property investment into a liquid, accessible, and intelligent market. Buy shares of verified properties, earn monthly rental income, and trade real estate like stocks.

## 🚀 Vision

**"The Bloomberg Terminal + Robinhood of Real Estate"**

NestFund is not another property listing website. It's a **live financial market for real estate** where:
- Properties are tokenized into tradeable shares
- Investors track portfolios like stock investments
- AI predicts market trends and property value
- Real-time data shows price movements and rental yields
- Anyone can invest with as little as UGX 50,000

## ✨ Features

### 🏠 For Investors
- **Fractional Ownership**: Buy shares of premium properties
- **Monthly Income**: Earn rental income based on your shares
- **Live Market Data**: Track property values in real-time like stocks
- **AI Intelligence**: Get smart recommendations and market predictions
- **Portfolio Management**: Track all investments in one dashboard
- **Instant Liquidity**: Buy and sell shares on the marketplace

### 📊 For the Market
- **Property IPOs**: New properties launch like stock offerings
- **Price Discovery**: Market-driven valuations
- **Transparent Data**: Full visibility into performance, income, expenses
- **Market Intelligence**: Real-time updates on factors affecting property values
- **Area Scoring**: AI evaluates growth potential by location

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animation**: Framer Motion

## 📂 Project Structure

```
nestfund/
├── app/
│   ├── layout.tsx                 # Root layout with Navbar & Footer
│   ├── page.tsx                   # Homepage
│   ├── market/
│   │   └── page.tsx              # Property marketplace
│   ├── property/[id]/
│   │   └── page.tsx              # Property detail & buy shares
│   ├── portfolio/
│   │   └── page.tsx              # User portfolio tracking
│   └── intelligence/
│       └── page.tsx              # Market intelligence feed
├── components/
│   ├── Navbar.tsx                # Main navigation
│   ├── Footer.tsx                # Footer with links
│   ├── ui/
│   │   └── Button.tsx            # Reusable button component
│   ├── home/
│   │   ├── HeroSection.tsx       # Homepage hero
│   │   ├── MarketOverview.tsx    # Market stats cards
│   │   ├── TrendingProperties.tsx # Featured properties
│   │   ├── MarketIntelligence.tsx # Intelligence feed preview
│   │   ├── HowItWorks.tsx        # Process explanation
│   │   ├── WhyNestFund.tsx       # Feature highlights
│   │   └── CTASection.tsx        # Call-to-action
│   ├── market/
│   │   └── MarketPage.tsx        # Market browse & filter
│   ├── property/
│   │   └── PropertyDetailPage.tsx # Property details & purchase
│   ├── portfolio/
│   │   └── PortfolioPage.tsx     # Portfolio dashboard
│   └── intelligence/
│       └── IntelligencePage.tsx  # Intelligence feed
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── types.ts                  # TypeScript types
│   └── mockData.ts              # Sample data
└── public/                       # Static assets
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nestfund
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design Philosophy

### White Mode Professional
- Clean, professional white backgrounds
- High-contrast text for readability
- Blue primary color (#3B82F6) for trust
- Green for positive metrics, Red for negative
- Subtle shadows and borders for depth

### Stock Market Aesthetic
- Price charts with historical data
- Live percentage changes with trending indicators
- Portfolio performance tracking
- Real-time market statistics
- Professional financial data presentation

### Trust & Credibility
- Verified badges on properties
- Transparent data display
- Professional typography
- Consistent visual language
- Clear calls-to-action

## 📄 Pages Overview

### 1. Homepage (`/`)
- Hero section with animated property card
- Live market statistics
- Trending property grid
- Market intelligence preview
- How it works section
- Feature highlights
- Strong call-to-action

### 2. Market (`/market`)
- Browse all available properties
- Filter by growth potential and yield
- Sort by trending, price, or yield
- Property cards with mini charts
- Quick buy actions

### 3. Property Detail (`/property/[id]`)
- Full property information
- Interactive price chart
- Location and verification badges
- Buy shares widget with calculator
- Key metrics dashboard
- About property section

### 4. Portfolio (`/portfolio`)
- Total portfolio value and performance
- Portfolio performance chart (12 months)
- Asset allocation pie chart
- Holdings table with gain/loss
- Monthly income tracking

### 5. Intelligence (`/intelligence`)
- AI-powered market updates
- Government approvals and policies
- Development news
- Risk alerts
- Impact predictions

## 🔮 Future Enhancements

### Phase 1 (MVP)
- [x] Property marketplace
- [x] Portfolio tracking
- [x] Market intelligence
- [ ] User authentication
- [ ] Payment integration
- [ ] Transaction history

### Phase 2
- [ ] Live property data integration
- [ ] Real blockchain tokenization
- [ ] Mobile app (React Native)
- [ ] AI advisor chatbot
- [ ] Social features (follow investors)
- [ ] Property performance notifications

### Phase 3
- [ ] Developer property listing
- [ ] Secondary marketplace
- [ ] Lending against portfolio
- [ ] International properties
- [ ] Government data integration
- [ ] Institutional investor tools

## 🌟 Inspiration

NestFund draws inspiration from:
- **Lofty.ai**: Fractional real estate investment model
- **Polymarket**: Credible, market-driven design
- **Robinhood**: Accessible investment interface
- **Bloomberg Terminal**: Professional financial data

## 📜 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or collaboration, contact the development team.

---

**Built with ❤️ for the future of real estate investment in Africa**
