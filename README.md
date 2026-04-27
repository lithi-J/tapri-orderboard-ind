# 🍵 Tapri Tales: The Smart Campus Chai Board

Tapri Tales is a modern, real-time order management system designed specifically for campus tea stalls ("tapris"). It eliminates the chaos of bulk orders by providing a digital queue, live status updates, and vendor insights—all wrapped in a premium, high-aesthetic interface.

![Tapri Tales Banner](https://images.unsplash.com/photo-1594631252845-29fc458631b6?q=80&w=1200&auto=format&fit=crop)

## 🚀 Key Features

- **Live Order Queue**: Real-time status tracking from "Pending" to "Served" using drag-and-drop mechanics.
- **Smart Suggestions**: AI-inspired presets for bulk team orders (e.g., "50 Masala Chais for CSE Lab").
- **Fest Mode 🎉**: High-energy UI toggle with confetti and sound effects for peak hour excitement.
- **Persistent Notifications**: Never miss an order or a status update with a robust notification history.
- **Vendor Dashboard**: Actionable insights into revenue, top-selling items, and peak order times.
- **Socket.io Integration**: Zero-latency synchronization across all connected devices.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Framer Motion (for micro-animations)
- **UI Components**: Radix UI + Lucide Icons
- **State Management**: React Query + Context API

### Backend
- **Runtime**: Node.js with Express
- **Real-time**: Socket.io
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM/Querying**: `pg` pool for high performance

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (recommended)
- A Supabase account (for PostgreSQL)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/tapri-orderboard-ind.git
   cd tapri-orderboard-ind
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials (see `.env.example`).

4. **Run the Development Environment**:
   ```bash
   pnpm run dev
   ```
   *This will start both the frontend (Port 8081) and the backend (Port 8080) concurrently.*

## 📂 Project Structure

```text
├── src/
│   ├── backend/          # Express server, routes, and controllers
│   ├── components/       # UI components (shadcn/ui + custom tapri components)
│   ├── entities/         # Shared TypeScript interfaces
│   ├── hooks/            # Custom React hooks (e.g., useOrders)
│   ├── lib/              # Utility functions and static data
│   └── pages/            # Main application views
├── public/               # Static assets
└── craco.config.js       # Webpack and alias configuration
```

## 🤝 Contributing

Contributions are welcome! Whether it's a bug fix, a new feature, or improving documentation, feel free to open a PR.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Brewed with ♥ at the campus tapri.*
