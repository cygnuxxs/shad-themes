import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Shad Themes",
  description: "Privacy Policy for Shad Themes - Learn how we handle your data and protect your privacy.",
};

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 16, 2026</p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Welcome to Shad Themes. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we handle your personal data when you visit our
            website and use our theme generation services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Information You Provide</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you use Shad Themes, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Images you upload for theme generation (processed locally in your browser)</li>
            <li>Theme preferences and customization settings</li>
            <li>Any feedback or communications you send to us</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address (anonymized)</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>To provide and maintain our theme generation service</li>
            <li>To improve and optimize our website and services</li>
            <li>To analyze usage patterns and trends</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Image Processing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Client-Side Processing:</strong> All image processing for theme
            generation happens directly in your browser. Your uploaded images are never sent to our servers.
            The color extraction and theme generation algorithms run entirely on your device.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            When you upload an image, it remains in your browser&apos;s memory only for the duration of the theme
            generation process and is automatically cleared when you close the page or upload a new image.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Storage and Security</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We implement appropriate technical and organizational security measures to protect your personal data:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>HTTPS encryption for all data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data by authorized personnel only</li>
            <li>Local storage of preferences in your browser only</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use minimal cookies and local storage to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li>Remember your theme preferences (dark/light mode)</li>
            <li>Store recently generated themes for quick access</li>
            <li>Analyze website traffic using privacy-focused analytics</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You can control cookie settings through your browser preferences. Note that disabling cookies may
            limit some functionality of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Third-Party Services</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may use third-party services that collect, monitor, and analyze data to improve our service:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li><strong className="text-foreground">Analytics:</strong> We use privacy-focused analytics tools to understand how users interact with our service</li>
            <li><strong className="text-foreground">Hosting:</strong> Our website is hosted on secure cloud infrastructure providers</li>
            <li><strong className="text-foreground">CDN:</strong> We use content delivery networks to serve static assets efficiently</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">8. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Under data protection laws, you have the following rights:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li><strong className="text-foreground">Right to Access:</strong> Request copies of your personal data</li>
            <li><strong className="text-foreground">Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong className="text-foreground">Right to Erasure:</strong> Request deletion of your personal data</li>
            <li><strong className="text-foreground">Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong className="text-foreground">Right to Data Portability:</strong> Request transfer of your data</li>
            <li><strong className="text-foreground">Right to Object:</strong> Object to processing of your personal data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">9. Children&apos;s Privacy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our service is not intended for children under the age of 13. We do not knowingly collect personal
            information from children under 13. If you are a parent or guardian and believe your child has
            provided us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting
            the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this policy.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy
            Policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">11. GDPR Compliance</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation
            (GDPR). We process your personal data on the following legal bases:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
            <li><strong className="text-foreground">Consent:</strong> When you explicitly agree to our data processing</li>
            <li><strong className="text-foreground">Legitimate Interests:</strong> For improving our services and user experience</li>
            <li><strong className="text-foreground">Legal Obligation:</strong> When required to comply with applicable laws</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
