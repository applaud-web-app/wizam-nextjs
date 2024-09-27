import { NextResponse } from 'next/server';

interface FAQ {
  question: string;
  answer: string;
}

// Static FAQ data
const faqs: FAQ[] = [
  {
    question: "How long does it take to get my first blog post?",
    answer: "It takes 2-3 weeks to get your first blog post ready. This includes in-depth research and creating your content marketing strategy.",
  },
  {
    question: "What is included in the service?",
    answer: "We include everything you need: custom research, blog writing, content strategy, and regular updates to keep your content relevant.",
  },
  {
    question: "How do I track my progress?",
    answer: "We provide detailed analytics and reporting tools to track your content's performance and improve where necessary.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time without any penalties.",
  },
  {
    question: "Do you provide content updates?",
    answer: "Yes, we constantly monitor and update your content to ensure it stays fresh and aligned with your strategy.",
  },
  {
    question: "What kind of exams do you cover?",
    answer: "We cover a wide range of exams, including professional certifications, competitive exams, and academic tests.",
  },
  {
    question: "Is the content updated regularly?",
    answer: "Yes, our content is updated regularly to reflect the latest exam patterns and syllabus changes.",
  },
  {
    question: "Can I access the materials on mobile devices?",
    answer: "Yes, all our materials are mobile-friendly and can be accessed from any device.",
  },
  {
    question: "Do you offer free practice tests?",
    answer: "We offer a variety of free practice tests as well as premium paid content to suit your preparation needs.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods, including credit cards, debit cards, and online wallets.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team 24/7 via email or live chat. We are here to assist you with any queries.",
  },
];

// GET request handler
export async function GET() {
  return NextResponse.json(faqs);
}
