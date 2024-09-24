import { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";

// Define the structure of the page data
interface PageData {
  title: string;
  content: string;
  breadcrumb: string;
  description: string;
}


const pageData: Record<string, PageData> = {
  "terms-and-conditions": {
    title: "Terms and Conditions",
    content: `
      <h2>1. Introduction</h2>
      <p>Welcome to Wizam. By using our website, you agree to comply with and be bound by the following terms and conditions of use. Please read these terms carefully before using the website.</p>

      <h2>2. Intellectual Property</h2>
      <p>All content provided on this website, including but not limited to text, images, logos, and software, is the intellectual property of Wizam. Unauthorized use of any content may violate copyright, trademark, and other laws.</p>

      <h2>3. User Responsibilities</h2>
      <p>By using our platform, you agree to provide accurate information and to use the services only for their intended purposes. You may not misuse the platform or attempt to disrupt our services.</p>

      <h2>4. Limitation of Liability</h2>
      <p>Wizam will not be held responsible for any direct, indirect, incidental, or consequential damages that arise from the use of or inability to use our platform. This includes, but is not limited to, the loss of data, programs, or any financial losses.</p>

      <h2>5. Changes to Terms</h2>
      <p>Wizam reserves the right to update or change these terms at any time without prior notice. It is your responsibility to review these terms periodically for changes.</p>
    `,
    breadcrumb: "Terms and Conditions",
    description: "Learn about the terms and conditions of using Wizam, including legal requirements, intellectual property rights, and user responsibilities.",
  },

  "privacy-policy": {
    title: "Privacy Policy",
    content: `
      <h2>1. Introduction</h2>
      <p>At Wizam, we are committed to protecting your privacy. This policy explains how we collect, use, and share your personal information when you use our website.</p>

      <h2>2. Information We Collect</h2>
      <p>We collect personal information such as your name, email address, and payment details when you register or make purchases on our platform. We also collect usage data through cookies to help improve user experience.</p>

      <h2>3. How We Use Your Information</h2>
      <p>Your information is used to provide and improve our services. This includes processing transactions, sending important notifications, and personalizing your learning experience.</p>

      <h2>4. Data Sharing and Security</h2>
      <p>We do not sell your personal information to third parties. We may share your information with trusted partners who assist us in providing our services. We implement strong security measures to protect your data.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to access, update, or delete your personal information at any time. If you wish to exercise any of these rights, please contact us at support@wizam.com.</p>
    `,
    breadcrumb: "Privacy Policy",
    description: "Understand how Wizam collects, uses, and protects your personal data, and your rights under our privacy policy.",
  },

  "cookie-policy": {
    title: "Cookie Policy",
    content: `
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small files stored on your device when you visit our website. They help us recognize your browser and improve your user experience by remembering your preferences and login details.</p>

      <h2>2. Types of Cookies We Use</h2>
      <p>We use several types of cookies:</p>
      <ul>
        <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly, such as enabling you to log into secure areas.</li>
        <li><strong>Performance Cookies:</strong> These cookies collect anonymous information about how visitors use our website, helping us improve the performance and user experience.</li>
        <li><strong>Targeting Cookies:</strong> These are used to deliver personalized content and advertising relevant to your interests.</li>
      </ul>

      <h2>3. Managing Cookies</h2>
      <p>You can control or delete cookies through your browser settings. However, please note that disabling cookies may affect the functionality of our website.</p>

      <h2>4. Third-Party Cookies</h2>
      <p>We may allow third-party services, such as Google Analytics, to set cookies on your device for performance monitoring and marketing purposes.</p>

      <h2>5. Changes to This Policy</h2>
      <p>Wizam reserves the right to update this cookie policy as needed. We recommend checking this page periodically for updates.</p>
    `,
    breadcrumb: "Cookie Policy",
    description: "Discover how Wizam uses cookies to improve user experience, including cookie types, third-party cookies, and how to manage them.",
  },

  "refund-policy": {
    title: "Refund Policy",
    content: `
      <h2>1. Refund Eligibility</h2>
      <p>Our refund policy allows for refunds within 14 days of purchase, provided that you meet the eligibility criteria outlined below. The course or exam must not have been accessed or completed during this period.</p>

      <h2>2. How to Request a Refund</h2>
      <p>To request a refund, please contact our support team at support@wizam.com with your order details and the reason for your refund request. Our team will review your request and respond within 5 business days.</p>

      <h2>3. Non-Refundable Items</h2>
      <p>Certain items and services are non-refundable. These include:</p>
      <ul>
        <li>Completed courses or exams</li>
        <li>Discounted or promotional items</li>
        <li>Products purchased as part of a bundle</li>
      </ul>

      <h2>4. Refund Process</h2>
      <p>If your refund request is approved, the refund will be processed to your original payment method within 7-10 business days. You will receive a notification once the refund has been issued.</p>

      <h2>5. Changes to This Policy</h2>
      <p>We reserve the right to modify this refund policy at any time. Changes will be posted on this page, and it is your responsibility to review the policy periodically.</p>
    `,
    breadcrumb: "Refund Policy",
    description: "Learn about Wizam's refund policy, including eligibility, the refund request process, and non-refundable items.",
  },
};


// Define the type for the `params` object
interface Params {
  params: {
    slug: string;
  };
}

// Function to generate metadata dynamically for SEO
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const page = pageData[slug];

  if (!page) {
    return {
      title: "Page Not Found - Wizam",
      description: "The page you are looking for does not exist.",
    };
  }

  return {
    title: `${page.title} - Wizam | Exam Preparation and Test Academy`,
    description: page.description,
  };
}

// Main dynamic page component with types
const DynamicPage = ({ params }: Params) => {
  const { slug } = params;

  // Get the page data based on the slug
  const page = pageData[slug];

  // If the page does not exist, show a 404 page
  if (!page) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb component with dynamic page name */}
      <Breadcrumb pageName={page.breadcrumb} />

      {/* Render page content */}
      <section className="py-12 md:py-16 ">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold">{page.title}</h1>
          <div
            className="mt-4 text-base"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </>
  );
};

export default DynamicPage;
