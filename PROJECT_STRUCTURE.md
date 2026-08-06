# NestFund Project Structure

This document provides a complete overview of the NestFund project architecture, components, and implementation details.

## 🏗️ Architecture Overview

NestFund follows a modern Next.js 14 App Router architecture with:
- **Server Components** by default for optimal performance
- **Client Components** (`"use client"`) for interactive features
- **Type-safe** TypeScript throughout
- **Responsive design** with Tailwind CSS
- **Component-based** architecture for reusability

## 📁 Directory Structure

### `/app` — Application Routes
Next.js 14 uses file-system based routing. Each folder represents a route.

```
app/
├── layout.tsx              # Root layout (wraps all pages)
│   └── Includes: Navbar, Footer, metadata
├── page.tsx               # Homepage route (/)
├── globals.css            # Global styles & Tailwind imports
├── market/
│   └── page.tsx          # Market listing page (/market)
├── property/[id]/
│   └── page.tsx          # Dynamic property detail (/property/sunrise-apartments)
├── portfolio/
│   └── page.tsx          # User portfolio page (/portfolio)
└── intelligence/
    └── page.tsx          # Market intelligence page (/intelligence)
```

**Key Files:**
- `layout.tsx`: Defines the HTML structure, includes Navbar/Footer, sets metadata
- `page.tsx`: Each page.tsx exports the page component for that route
- `[id]`: Dynamic route segments (e.g., `/property/[id]`)

### `/components` — Reusable Components
All UI components organized by feature or type.

```
components/
├── Navbar.tsx            # Top navigation bar
├── Footer.tsx            # Footer with links & branding
├── ui/
│   └── Button.tsx        # Reusable button with variants
├── home/                 # Homepage-specific components
│   ├── HeroSection.tsx
│   ├── MarketOverview.tsx
│   ├── TrendingProperties.tsx
│   ├── MarketIntelligence.tsx
│   ├── HowItWorks.tsx
│   ├── WhyNestFund.tsx
│   └── CTASection.tsx
├── market/
│   └── MarketPage.tsx    # Market browse with filters
├── property/
│   └── PropertyDetailPage.tsx  # Property details & purchase widget
├── portfolio/
│   └── PortfolioPage.tsx       # Portfolio dashboard
└── intelligence/
    └── IntelligencePage.tsx    # Intelligence feed
```

**Component Patterns:**
- Components that need interactivity have `"use client"` directive
- Components are functional with TypeScript props
- Reusable UI components go in `/components/ui`
- Page-specific components in feature folders

### `/lib` — Utilities & Data

```
lib/
├── utils.ts              # Helper functions
│   ├── cn()             # Tailwind class merging
│   ├── formatCurrency() # Format numbers as currency
│   └── formatPercentage() # Format change percentages
├── types.ts              # TypeScript interfaces
│   ├── Property
│   ├── MarketIntelligence
│   └── PortfolioItem
└── mockData.ts          # Sample data for development
    ├── featuredProperties
    ├── marketIntelligence
    └── marketStats
```

## 🎨 Design System

### Color Palette

```typescript
Primary (Blue): #3B82F6  // Trust, professionalism
Success (Green): #10B981 // Positive metrics, gains
Danger (Red): #EF4444    // Negative metrics, losses
Warning (Yellow): #F59E0B // Caution, medium priority
Gray Scale: 
  - 50: #F9FAFB
  - 100: #F3F4F6
  - 200: #E5E7EB
  - 500: #6B7280
  - 900: #111827
```

### Typography
- **Font**: Inter (via Google Fonts)
- **Headings**: Bold, tight tracking
- **Body**: Regular weight, relaxed leading
- **Sizes**: Tailwind's default scale (text-sm to text-5xl)

### Components

#### Button Variants
```typescript
primary   // Blue background, white text
secondary // Gray background, dark text
outline   // Border, transparent background
ghost     // No border, hover background
```

#### Button Sizes
```typescript
sm  // h-8, px-3, text-sm
md  // h-10, px-4, text-base
lg  // h-12, px-6, text-lg
```

### Spacing & Layout
- **Max Width**: 7xl (1280px) for content
- **Padding**: Responsive (px-4 sm:px-6 lg:px-8)
- **Gaps**: Consistent 4, 6, 8 spacing units
- **Rounded**: lg (8px) for cards, xl (12px) for emphasized cards

## 🧩 Key Components Explained

### 1. Navbar (`/components/Navbar.tsx`)
**Purpose**: Main navigation across the platform

**Features**:
- Logo with brand identity
- Navigation links (Market, Portfolio, Intelligence, About)
- Search bar (desktop only)
- Notification bell
- Wallet balance display
- Sign In button

**State**: Client component with future auth integration

### 2. Property Cards
**Used In**: Homepage, Market page

**Features**:
- Property image with gradient overlay
- Location badge
- Growth potential badge
- Mini price chart (sparkline)
- Key metrics: Price/share, Rental yield, Area score
- 24h price change indicator
- Buy Now CTA

### 3. Portfolio Dashboard
**Route**: `/portfolio`

**Sections**:
1. **Summary Cards**: Total value, invested, gain, monthly income
2. **Performance Chart**: 12-month portfolio value line chart
3. **Allocation Pie Chart**: Visual breakdown of holdings
4. **Holdings Table**: Detailed list with images, shares, P&L

### 4. Property Detail Page
**Route**: `/property/[id]`

**Sections**:
1. **Image Gallery**: Full-width hero image
2. **Title & Metrics**: Name, location, verification, price
3. **Key Stats**: Rental yield, area score, growth, availability
4. **Price Chart**: Historical share price (recharts)
5. **About Section**: Property description
6. **Buy Widget** (Sticky Sidebar):
   - Share amount input
   - Price calculator
   - Estimated monthly income
   - Buy button

### 5. Market Intelligence Feed
**Route**: `/intelligence`

**Features**:
- Real-time market updates
- Categorized by type (Approval, Development, Alert)
- Impact predictions (% change expected)
- Location-specific
- Time stamps
- Filter tabs

## 📊 Data Flow

### Mock Data Structure

```typescript
// Property
{
  id: "sunrise-apartments",
  name: "Sunrise Apartments",
  location: "Kiira, Wakiso",
  image: string,
  currentPrice: number,      // Total property value
  pricePerShare: number,     // UGX per share
  totalShares: 5000,
  availableShares: 3452,
  priceChange: 52,           // Absolute change
  priceChangePercent: 4.34,  // % change
  rentalYield: 11.2,         // Annual %
  areaScore: 87,             // Out of 100
  futureGrowth: "High" | "Medium" | "Low",
  chartData: Array<{time: string, value: number}>
}
```

### Current Data Sources
- **Development**: Mock data in `lib/mockData.ts`
- **Future**: 
  - Backend API for property data
  - Real-time pricing via WebSocket
  - Blockchain for share ownership
  - AI/ML service for predictions

## 🎯 User Flows

### 1. Browse & Invest Flow
1. User lands on homepage
2. Sees trending properties
3. Clicks "Explore Properties" → `/market`
4. Filters/sorts properties
5. Clicks property card → `/property/[id]`
6. Reviews details, charts, metrics
7. Enters share amount in buy widget
8. Clicks "Buy Shares"
9. (Future: Auth, payment, transaction)

### 2. Portfolio Tracking Flow
1. User navigates to Portfolio
2. Views total value, performance chart
3. Sees allocation breakdown
4. Reviews holdings table
5. Clicks "Manage" on a holding
6. Redirects to property detail
7. Can buy more or (future) sell shares

### 3. Intelligence Discovery Flow
1. User sees intelligence preview on homepage
2. Clicks "View All Updates"
3. Lands on `/intelligence`
4. Filters by category (Positive, Negative, etc.)
5. Reads impact predictions
6. (Future: Saves alerts, follows locations)

## 🚀 Next Steps & Integration Points

### Authentication
**Add**: Clerk, Auth0, or custom auth
**Files to modify**:
- `components/Navbar.tsx` — Replace "Sign In" with user menu
- `app/layout.tsx` — Wrap with auth provider
- Protected routes — Add middleware

### Backend API
**Recommended Stack**: 
- Option 1: Next.js API routes (`app/api/`)
- Option 2: Separate Node.js/Express backend
- Option 3: Supabase/Firebase

**Endpoints Needed**:
```
GET  /api/properties          # List all properties
GET  /api/properties/:id      # Get property details
POST /api/properties/:id/buy  # Purchase shares
GET  /api/portfolio           # User portfolio
GET  /api/intelligence        # Market updates
```

### Database Schema
**Tables**:
- `properties` — Property listings
- `users` — User accounts
- `portfolios` — User holdings
- `transactions` — Buy/sell history
- `intelligence` — Market updates
- `property_prices` — Historical pricing

### Payment Integration
**Options**: 
- Stripe (international cards)
- Flutterwave (Africa-focused)
- Paystack
- MTN Mobile Money API

**Integration Points**:
- Buy shares widget
- Wallet top-up
- Withdrawal

### Blockchain (Optional)
**For**: Share ownership tokenization
**Tech**: Ethereum, Polygon, or custom chain
**Smart Contracts**: 
- Property tokenization
- Share transfer
- Dividend distribution

## 🔒 Security Considerations

### Data Validation
- Validate all user inputs
- Type-check with TypeScript
- Sanitize data before database insertion

### Authentication
- Use secure session management
- Implement 2FA for transactions
- Rate limit API endpoints

### Payments
- PCI compliance for card data
- Secure webhook handling
- Transaction audit logs

### Authorization
- Role-based access control
- Verify ownership before trades
- Protected API routes

## 📱 Responsive Design

The platform is fully responsive:

**Breakpoints** (Tailwind defaults):
- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

**Mobile Optimizations**:
- Hamburger menu (to be added)
- Stack layouts on mobile
- Touch-friendly buttons (min 44px)
- Simplified tables (horizontal scroll)

## 🎨 UI Patterns Used

### Cards
```tsx
<div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
  {/* Card content */}
</div>
```

### Stat Displays
```tsx
<div className="flex items-center space-x-1 text-green-600">
  <TrendingUp className="h-4 w-4" />
  <span>+4.34%</span>
</div>
```

### Badges
```tsx
<span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
  High Growth
</span>
```

### Buttons
```tsx
<Button variant="primary" size="lg">
  <Icon className="mr-2 h-5 w-5" />
  Button Text
</Button>
```

## 📦 Dependencies

### Production
- `next` — Framework
- `react` — UI library
- `typescript` — Type safety
- `tailwindcss` — Styling
- `lucide-react` — Icons
- `recharts` — Charts
- `framer-motion` — Animations
- `clsx` / `tailwind-merge` — Class utilities

### Development
- `@types/*` — TypeScript definitions
- `eslint` — Code linting

## 🧪 Testing Strategy (Future)

### Unit Tests
- Component rendering
- Utility functions
- Data transformations

### Integration Tests
- User flows
- API interactions
- Authentication

### E2E Tests
- Critical paths (buy shares)
- Portfolio management
- Market browsing

**Recommended Tools**:
- Jest + React Testing Library
- Playwright or Cypress for E2E

## 📈 Performance Optimizations

### Current
- Server Components by default
- Image optimization (Next.js Image)
- Tailwind CSS purging
- Route prefetching

### Future
- Image CDN (Cloudinary, Vercel)
- API response caching
- Database query optimization
- Code splitting

## 🌐 Deployment

### Recommended Platforms
1. **Vercel** (easiest, built for Next.js)
2. **Netlify**
3. **AWS Amplify**
4. **Self-hosted** (VPS with Docker)

### Environment Variables
```env
DATABASE_URL=
NEXTAUTH_SECRET=
PAYMENT_API_KEY=
AI_SERVICE_API_KEY=
```

### Build Commands
```bash
npm run build      # Production build
npm run start      # Start production server
npm run dev        # Development server
```

---

## 🎯 Success Metrics

### User Engagement
- Daily active users
- Properties viewed
- Shares purchased
- Portfolio checks

### Financial
- Total investment volume
- Transaction fees
- Active investors
- Average investment size

### Platform Health
- Page load time < 2s
- API response time < 200ms
- 99.9% uptime
- Mobile usage %

---

**This is a living document. Update as the platform evolves.**
