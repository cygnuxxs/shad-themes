# Shad Themes - AI Theme Generator for shadcn/ui

Transform any image into beautiful, accessible design systems for [shadcn/ui](https://ui.shadcn.com). Generate semantic color themes with automatic dark mode using OKLCH color space. Free, open-source, and no signup required.

## ✨ Features

- **🎨 Intelligent Color Extraction** - Advanced algorithms analyze your image to extract dominant, vibrant, and muted color palettes with precision
- **🎯 Semantic Theme Generation** - Automatically maps colors to shadcn/ui semantic variables (primary, secondary, accent, muted, destructive)
- **🌙 Auto Dark Mode** - Generates perfectly paired dark themes using OKLCH color space for perceptually uniform brightness adjustments
- **♿ WCAG Compliance** - Real-time contrast ratio calculations ensure your themes meet accessibility standards (AA/AAA)
- **📦 Production-Ready Export** - Export complete globals.css with all CSS variables, ready to drop into your Next.js or React project
- **⚡ 4 Theme Strategies** - Choose from Standard, Vivid, Minimal, or Professional strategies to match your brand's personality
- **👁️ Live Preview** - See your theme applied across 30+ shadcn/ui components in real-time
- **🎨 Interactive Customization** - Fine-tune individual color variables with visual color picker

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/cygnuxxs/lumina-ui.git

# Navigate to the project directory
cd lumina-ui

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development

```bash
# Run the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## 🎯 How It Works

### 1. **Extraction**
We use `extract-colors` to isolate key pixel clusters, identifying the dominant, vibrant, and muted tones of your uploaded image.

### 2. **Strategy Mapping**
Our engine applies four distinct algorithms (Standard, Vivid, Minimal, Professional) to map extracted colors to semantic variables.

### 3. **OKLCH & Contrast**
We auto-generate a paired Dark Mode using OKLCH interpolation and calculate contrast ratios on the fly for WCAG compliance.

## 📋 Use Cases

- **SaaS Dashboards** - Create professional, data-focused themes with the Professional strategy
- **E-commerce Sites** - Use Vivid strategy to make products pop while maintaining accessibility
- **Portfolio Websites** - Match your personal brand with colors from your artwork
- **Marketing Landing Pages** - Rapidly prototype multiple theme variations for A/B testing
- **Mobile App Prototypes** - Generate themes from app icons to maintain visual consistency
- **Documentation Sites** - Create readable, low-contrast themes perfect for technical content

## 🛠️ Tech Stack

- **Framework** - [Next.js 16](https://nextjs.org/) with App Router
- **Language** - [TypeScript](https://www.typescriptlang.org/)
- **Styling** - [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components** - [shadcn/ui](https://ui.shadcn.com) with [Radix UI](https://www.radix-ui.com/)
- **Color Extraction** - [extract-colors](https://github.com/damianmr/extract-colors)
- **Animations** - [Motion](https://motion.dev/)
- **Code Highlighting** - [Shiki](https://shiki.style/)
- **State Management** - [Zustand](https://github.com/pmndrs/zustand)
- **Form Handling** - [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)

## 📁 Project Structure

```
lumina-ui/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── create/            # Theme generator page
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── blocks/            # Component preview blocks
│   ├── code-copy/         # Code export functionality
│   └── theme-injector/    # Theme customization controls
├── lib/                   # Utility functions
│   ├── color-engine.ts    # Color extraction & mapping logic
│   ├── theme-store.ts     # Zustand state management
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── types.d.ts             # TypeScript type definitions
```

## 🎨 Theme Strategies

### Standard
Balanced approach using the most vibrant colors for primary elements while maintaining readability.

### Vivid
High-saturation colors for bold, eye-catching interfaces. Perfect for consumer apps and creative projects.

### Minimal
Muted, low-contrast palette for elegant, professional designs. Great for content-focused applications.

### Professional
Conservative color choices optimized for business applications and dashboards.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the amazing component library
- [OKLCH Color Space](https://oklch.com) for perceptually uniform colors
- [extract-colors](https://github.com/damianmr/extract-colors) for intelligent color extraction
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives

## 📬 Contact & Links

- Issues: [GitHub Issues](https://github.com/cygnuxxs/lumina-ui/issues)

---

Built with ❤️ using Next.js and shadcn/ui
