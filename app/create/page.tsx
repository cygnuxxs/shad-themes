import ThemeGenerator from '@/components/ThemeGenerator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Theme - Generate Design System from Image",
  description: "Upload an image and instantly generate a complete shadcn/ui theme with semantic colors, automatic dark mode, and WCAG-compliant accessibility. Export as CSS, JSON, or Tailwind config.",
  openGraph: {
    title: "Create Your Theme with Shad Themes",
    description: "Upload an image and instantly generate a complete design system with semantic colors and automatic dark mode.",
  },
  twitter: {
    title: "Create Your Theme with Shad Themes",
    description: "Upload an image and instantly generate a complete design system with semantic colors and automatic dark mode.",
  },
};

const CreatePage = () => {
  return (
    <div className='bg-background'>
      <ThemeGenerator />
    </div>
  )
}

export default CreatePage