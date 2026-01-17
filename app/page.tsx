import { ArrowRight, Moon, Pipette, SprayCan, Palette, Zap, Shield, Code2, Sparkles, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import GithubStarsButton from "@/components/github-stars-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shad Themes - AI Theme Generator for Shadcn/UI | Transform Images into Design Systems",
  description: "Stop guessing LCH values. Transform any image into beautiful, accessible design systems for shadcn/ui. Generate semantic color themes with automatic dark mode using OKLCH color space. Free, open-source, and no signup required.",
  openGraph: {
    title: "Shad Themes - AI Theme Generator for Shadcn/UI",
    description: "Transform any image into beautiful, accessible design systems with automatic dark mode. Generate semantic color themes instantly.",
  },
  twitter: {
    title: "Shad Themes - AI Theme Generator for Shadcn/UI",
    description: "Transform any image into beautiful, accessible design systems with automatic dark mode.",
  },
};

// Reusable Components
const TechTerm = ({ children }: { children: string }) => (
  <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
    {children}
  </span>
);

const Badge = ({ children, variant = "default" }: { children: string; variant?: "default" | "secondary" }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
    variant === "secondary"
      ? "bg-secondary text-secondary-foreground"
      : "bg-primary/10 text-primary"
  }`}>
    {children}
  </span>
);

const Section = ({ id, title, subtitle, children, className = "" }: {
  id?: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section id={id} className={`relative container mx-auto py-24 px-4 space-y-12 ${className}`}>
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-foreground">{title}</h2>
      <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl/relaxed">{subtitle}</p>
    </div>
    {children}
  </section>
);

const FeatureCard = ({ icon, title, description, badge }: {
  icon?: React.ReactNode;
  title: string;
  description: string | React.ReactNode;
  badge?: string;
}) => (
  <Card className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
    <CardHeader>
      {badge && (
        <div className="mb-2">
          <Badge variant="default">{badge}</Badge>
        </div>
      )}
      {icon && (
        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
      )}
      <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
      <CardDescription className="leading-relaxed text-muted-foreground">{description}</CardDescription>
    </CardHeader>
  </Card>
);

// Data
const features = [
  { icon: <Palette className="size-5" />, title: "Intelligent Color Extraction", description: "Advanced algorithms analyze your image to extract dominant, vibrant, and muted color palettes with precision." },
  { icon: <Sparkles className="size-5" />, title: "Semantic Theme Generation", description: "Automatically maps colors to shadcn/ui semantic variables like primary, secondary, accent, muted, and destructive." },
  { icon: <Moon className="size-5" />, title: "Auto Dark Mode", description: "Generates perfectly paired dark themes using OKLCH color space for perceptually uniform brightness adjustments." },
  { icon: <Shield className="size-5" />, title: "WCAG Compliance", description: "Real-time contrast ratio calculations ensure your themes meet accessibility standards (AA/AAA)." },
  { icon: <Code2 className="size-5" />, title: "Production-Ready Export", description: "Export complete globals.css with all CSS variables, ready to drop into your Next.js or React project." },
  { icon: <Zap className="size-5" />, title: "4 Theme Strategies", description: "Choose from Standard, Vivid, Minimal, or Professional strategies to match your brand's personality." },
];

const steps = [
  {
    title: "1. Extraction",
    icon: <Pipette className="size-4" />,
    description: <>We use <TechTerm>extract-colors</TechTerm> to isolate key pixel clusters, identifying the dominant, vibrant, and muted tones of your uploaded image.</>
  },
  {
    title: "2. Strategy Mapping",
    icon: <SprayCan className="size-4" />,
    description: <>Our engine applies four distinct algorithms {["Standard", "Vivid", "Minimal", "Professional"].map(s => <Badge key={s} variant="secondary">{s}</Badge>)} to map extracted colors to semantic variables.</>
  },
  {
    title: "3. OKLCH & Contrast",
    icon: <Moon className="size-4" />,
    description: <>We auto-generate a paired Dark Mode using <TechTerm>OKLCH</TechTerm> interpolation and calculate contrast ratios on the fly for <TechTerm>WCAG</TechTerm> compliance.</>
  },
];

const scenarios = [
  { badge: "Perfect for", title: "Starting a New Project", description: "Bootstrap your design system instantly with cohesive color palettes derived from your brand assets or inspiration images." },
  { badge: "Great for", title: "Rebranding Existing Apps", description: "Quickly prototype new color schemes and see them applied across all UI components before committing to changes." },
  { badge: "Ideal for", title: "Client Presentations", description: "Generate multiple theme variations from client logos or mood boards to showcase design possibilities in real-time." },
  { badge: "Useful for", title: "Learning shadcn/ui", description: "Understand how semantic color variables work by experimenting with different images and strategies." },
];

const useCases = [
  { title: "SaaS Dashboards", description: "Create professional, data-focused themes with the Professional strategy. Perfect for analytics platforms and admin panels.", tags: ["B2B", "Enterprise", "Analytics"] },
  { title: "E-commerce Sites", description: "Use Vivid strategy to make products pop while maintaining accessibility. Extract colors from product photography.", tags: ["Retail", "Shopping", "Conversion"] },
  { title: "Portfolio Websites", description: "Match your personal brand by extracting colors from your favorite artwork or photography. Minimal strategy for clean aesthetics.", tags: ["Creative", "Personal", "Showcase"] },
  { title: "Marketing Landing Pages", description: "Rapidly prototype multiple theme variations to A/B test which color schemes drive better engagement.", tags: ["Marketing", "Testing", "Growth"] },
  { title: "Mobile App Prototypes", description: "Generate themes from app icon designs or brand guidelines to maintain visual consistency across platforms.", tags: ["Mobile", "iOS", "Android"] },
  { title: "Documentation Sites", description: "Create readable, low-contrast themes using the Standard strategy. Perfect for technical docs and knowledge bases.", tags: ["Docs", "Technical", "Content"] },
];

const footerLinks = {
  product: [
    { label: "Theme Generator", href: "/create", external: false },
    { label: "How It Works", href: "/#howItWorks", external: false },
    { label: "Documentation", href: "/#", external: false },
    { label: "Changelog", href: "/#", external: false },
  ],
  resources: [
    { label: "shadcn/ui", href: "https://ui.shadcn.com", external: true },
    { label: "OKLCH Color Space", href: "https://oklch.com", external: true },
    { label: "WCAG Guidelines", href: "https://www.w3.org/WAI/WCAG21/quickref/", external: true },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", external: false },
    { label: "Terms of Service", href: "/terms", external: false },
    { label: "License", href: "/#", external: false },
  ],
};

const WhatItDoes = () => (
  <Section title="What It Does" subtitle="Transform any image into a complete, accessible design system in seconds">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {features.map((feature, idx) => <FeatureCard key={idx} {...feature} />)}
    </div>
  </Section>
);

const HowItWorks = () => (
  <Section
    id="howItWorks"
    title="How It Works"
    subtitle="Three simple steps to transform a static image into a dynamic, accessible design system powered by modern color science"
    className="before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-muted/20 before:via-transparent before:to-muted/20"
  >
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
      {steps.map((step, idx) => (
        <Card key={idx} className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-xl text-foreground flex gap-2 items-center group-hover:text-primary transition-colors">
              <span className="p-2 border rounded-md">{step.icon}</span>
              {step.title}
            </CardTitle>
            <CardDescription className="max-sm:text-xs leading-relaxed mt-2 text-muted-foreground">{step.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  </Section>
);

const WhenToUse = () => (
  <Section
    title="When to Use Shad Themes"
    subtitle="Perfect for designers and developers who want to move fast without compromising on quality"
    className="before:absolute before:inset-0 before:-z-10 before:overflow-hidden after:absolute after:top-1/2 after:left-0 after:w-72 after:h-72 after:bg-accent/5 after:rounded-full after:blur-3xl after:-z-10 *:relative *:z-10"
  >
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-5xl mx-auto">
      {scenarios.map((scenario, idx) => <FeatureCard key={idx} {...scenario} />)}
    </div>
  </Section>
);

const UseCases = () => (
  <Section
    title="Use Cases"
    subtitle="From startups to enterprises, see how Shad Themes fits into your workflow"
    className="before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-transparent before:via-muted/10 before:to-transparent"
  >
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
      {useCases.map((useCase, idx) => (
        <Card key={idx} className="group relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">{useCase.title}</CardTitle>
            <CardDescription className="leading-relaxed text-muted-foreground min-h-15">{useCase.description}</CardDescription>
            <div className="flex flex-wrap gap-2 pt-3">
              {useCase.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
    <div className="text-center pt-8">
      <Button size="lg" asChild className="gap-2">
        <Link href="/create">Try It Now <ArrowRight className="w-4 h-4" /></Link>
      </Button>
    </div>
  </Section>
);

const Footer = () => (
  <footer className="relative border-t border-border bg-card/50 backdrop-blur">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">Shad <span className="text-primary">Themes</span></h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Transform images into production-ready design systems with modern color science.
          </p>
          <div className="flex gap-3">
            {[
              { href: "https://github.com", icon: <Github className="h-4 w-4" />, label: "GitHub" },
            ].map(social => (
              <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors">
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section} className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground capitalize">{section}</h4>
            <ul className="space-y-3 text-sm">
              {links.map(link => (
                <li key={link.label}>
                  <Link href={link.href} {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Shad Themes. Built with <span className="text-primary">♥</span> using Next.js & shadcn/ui
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Made for the web, by the community</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const Homepage = () => (
  <>
    <main className="relative container mx-auto flex flex-col min-h-[calc(100dvh-4rem)] items-center justify-center gap-8 px-4">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex flex-col items-center space-y-6 text-center">
        <Badge>v1.0 Beta Now Live</Badge>

        <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl">
          Shad <span className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">Themes</span>
        </h1>

        <h2 className="text-xl font-semibold text-foreground sm:text-2xl max-w-3xl leading-tight">
          Stop Guessing LCH Values. Turn Images into Semantic Design Systems.
        </h2>

        <p className="max-w-2xl leading-relaxed text-muted-foreground sm:text-lg max-sm:text-sm sm:leading-8 text-balance">
          Upload an image to extract its palette, generate accessible <TechTerm>shadcn/ui</TechTerm> themes (Light & Dark), and export production-ready <TechTerm>globals.css</TechTerm> instantly.
        </p>

        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {["OKLCH Color Space", "WCAG Compliant", "Auto Dark Mode", "4 Theme Strategies"].map(pill => (
            <Badge key={pill} variant="secondary">{pill}</Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full gap-4 sm:flex-row sm:justify-center pt-4">
        <Button size="lg" asChild className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <Link href="/create">Start Generating <ArrowRight className="w-4 h-4" /></Link>
        </Button>
        <GithubStarsButton />
      </div>
    </main>

    <WhatItDoes />
    <HowItWorks />
    <WhenToUse />
    <UseCases />
    <Footer />
  </>
);

export default Homepage;