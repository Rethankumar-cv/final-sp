# 🛡️ FraudShield - Advanced Fraud Detection Dashboard

A modern, responsive web application for fraud detection with real-time analytics, transaction monitoring, and AI-powered risk assessment.

![FraudShield Dashboard](https://img.shields.io/badge/FraudShield-Dashboard-blue?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🔐 Authentication System
- **Secure Login**: Clean, professional login interface with form validation
- **User Profiles**: Comprehensive user profile management with role-based access
- **Session Management**: Automatic session handling with localStorage persistence
- **Demo Mode**: Use any email/password combination for instant access

### 🏠 Main Dashboard
- **Transaction Form**: Submit new transactions for real-time fraud analysis
  - Customer ID, KYC status, account age, amount, channel selection
  - Auto-timestamp with manual override capability
  - Instant fraud prediction with risk scoring
- **Live Transaction Log**: Paginated table with advanced filtering
  - Search functionality across all transaction fields
  - Sort by date, amount, risk score
  - Filter by fraud status and transaction channel
  - Export to CSV functionality
- **Smart Risk Assessment**: AI-powered fraud detection algorithm
  - Multi-factor risk scoring (amount, account age, KYC status, channel)
  - Real-time confidence ratings
  - Visual risk indicators and alerts

### 📊 Analytics & Insights
- **Fraud vs Legitimate**: Bar charts showing transaction distribution
- **Fraud Trend Analysis**: Time-series line charts for pattern recognition
- **Channel Distribution**: Pie charts breaking down fraud by payment method
- **Risk Scatter Plots**: Transaction amount vs risk score visualization
- **Performance Metrics**: Real-time accuracy, precision, recall tracking

### 🎯 Model Performance Monitoring
- **Confusion Matrix**: Visual representation of prediction accuracy
- **ROC Curve Analysis**: Model performance evaluation
- **Feature Importance**: Key factors driving fraud detection
- **Performance History**: Track model improvements over time
- **Detailed Metrics**: Accuracy, Precision, Recall, F1-Score, AUC tracking

### 🌟 Premium Features
- **Responsive Design**: Seamless experience across desktop, tablet, mobile
- **Dark/Light Mode**: Automatic theme switching with user preferences
- **Professional UI**: Modern fintech-inspired design with smooth animations
- **Real-time Notifications**: Toast alerts for fraud detection and system events
- **Settings Management**: Comprehensive user preferences and security settings
- **Data Export**: CSV export functionality for transaction logs
- **Sidebar Navigation**: Collapsible navigation with active route highlighting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd fraudshield-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Demo Login
Use any email and password combination to access the demo:
- **Email**: `demo@fraudshield.com`
- **Password**: `password123`

## 🏗️ Technology Stack

### Frontend Framework
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Lightning-fast build tool and development server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Shadcn/UI**: High-quality accessible component library
- **Lucide React**: Beautiful, customizable icons
- **Next Themes**: Seamless dark/light mode switching

### Data Visualization
- **Recharts**: Responsive charts built on React and D3
- **Custom Components**: Purpose-built analytics dashboards

### State Management
- **React Context**: Authentication and global state management
- **LocalStorage**: Persistent data storage for demo purposes
- **TanStack Query**: Server state management and caching

### Routing & Navigation
- **React Router DOM**: Client-side routing with protected routes
- **Sidebar Navigation**: Professional navigation with route highlighting

## 📱 Responsive Design

FraudShield is built mobile-first with breakpoint-specific optimizations:

- **Mobile (320px+)**: Optimized touch interface, collapsible navigation
- **Tablet (768px+)**: Enhanced layouts with side-by-side components
- **Desktop (1024px+)**: Full sidebar navigation, multi-column layouts
- **Large Screens (1440px+)**: Expanded content areas, detailed analytics

## 🎨 Design System

### Color Palette
- **Primary**: Professional blue gradients (`hsl(221 83% 53%)`)
- **Success**: Green for legitimate transactions (`hsl(142 71% 45%)`)
- **Warning**: Amber for medium risk (`hsl(38 92% 50%)`)
- **Destructive**: Red for fraud alerts (`hsl(0 84% 60%)`)

### Typography
- **Font Family**: System font stack for optimal performance
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive Scaling**: Tailwind's responsive typography system

### Animations
- **Fade In**: Smooth entrance animations for components
- **Slide Transitions**: Navigation and modal animations
- **Hover Effects**: Interactive feedback for buttons and links
- **Loading States**: Skeleton screens and progress indicators

## 🔧 Configuration

### Environment Variables
```bash
# Add to .env.local (if needed for production)
VITE_API_URL=your-backend-api-url
VITE_APP_NAME=FraudShield
```

### Customization
The design system is fully customizable through:
- `src/index.css`: CSS custom properties and global styles
- `tailwind.config.ts`: Tailwind configuration and theme extensions
- Component variants in `src/components/ui/`

## 📊 Mock Data Structure

### Transaction Schema
```typescript
interface Transaction {
  id: string;                    // Unique transaction identifier
  customerId: string;           // Customer identifier
  transactionAmount: string;    // Transaction amount (currency)
  channel: string;             // 'ATM' | 'Online' | 'POS' | 'Mobile'
  kycVerified: string;         // 'yes' | 'no'
  timestamp: string;           // ISO timestamp
  prediction: string;          // 'fraud' | 'legit'
  riskScore: number;          // 0-100 risk percentage
  confidence: number;         // 0-100 confidence percentage
}
```

## 🛠️ Development

### Project Structure
```
src/
├── assets/                 # Static assets and images
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── Layout.tsx        # Main layout wrapper
│   ├── AppSidebar.tsx    # Navigation sidebar
│   └── ...               # Feature components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── pages/                # Route components
└── main.tsx             # Application entry point
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Lovable
1. Click the **Publish** button in Lovable interface
2. Your app will be deployed instantly to a custom URL
3. Optional: Connect your custom domain in Project Settings

## 🔮 Future Enhancements

- [ ] **Real API Integration**: Connect to actual fraud detection backend
- [ ] **Advanced Analytics**: More sophisticated charting and insights
- [ ] **User Management**: Multi-user support with role-based permissions
- [ ] **Notification System**: Email and SMS alert capabilities
- [ ] **Report Generation**: PDF and Excel report exports
- [ ] **Machine Learning**: Enhanced model training capabilities
- [ ] **Webhook Integration**: Real-time fraud alerts via webhooks

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@fraudshield.com or create an issue in the repository.

---

**Built with ❤️ using Lovable - Create beautiful web apps instantly**

*FraudShield - Protecting your business, one transaction at a time.*