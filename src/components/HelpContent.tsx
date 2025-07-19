// components/HelpContent.tsx
"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: "general" | "students" | "companies" | "technical";
}

export default function HelpContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqs: FAQ[] = [
    // General
    {
      id: 1,
      category: "general",
      question: "What is CampusHire?",
      answer: "CampusHire is a comprehensive campus recruitment platform that connects students with job opportunities and helps companies find talented candidates from universities."
    },
    {
      id: 2,
      category: "general",
      question: "How do I get started with CampusHire?",
      answer: "Simply click 'Get Started' on our homepage and choose whether you want to join as a Student or as an Admin (for companies). Follow the registration process and start exploring opportunities."
    },
    {
      id: 3,
      category: "general",
      question: "Is CampusHire free to use?",
      answer: "Yes, CampusHire is completely free for students. Companies may have different pricing tiers based on their recruitment needs."
    },

    // Students
    {
      id: 4,
      category: "students",
      question: "How do I create my student profile?",
      answer: "After registering as a student, go to 'My Profile' in the dashboard. Fill in your academic details, upload your resume, add your skills, and complete all required fields to improve your visibility to employers."
    },
    {
      id: 5,
      category: "students",
      question: "How do I apply for jobs?",
      answer: "Browse the jobs page, click on any job that interests you, and check if you meet the requirements (CGPA, branch eligibility). If eligible, click 'Apply Now' to submit your application."
    },
    {
      id: 6,
      category: "students",
      question: "How can I track my applications?",
      answer: "Visit the 'My Applications' section in your dashboard. You can filter applications by status: In Progress, Accepted, or Rejected. You'll also receive notifications for status updates."
    },
    {
      id: 7,
      category: "students",
      question: "What if I don't meet the CGPA requirement for a job?",
      answer: "If you don't meet the minimum CGPA requirement, the system will show you a message and won't allow you to apply. Focus on jobs that match your qualifications or work on improving your CGPA."
    },

    // Companies
    {
      id: 8,
      category: "companies",
      question: "How can my company post jobs on CampusHire?",
      answer: "Register as an Admin, complete your company profile, and use the 'Post New Job' feature. Fill in job details including requirements, location, and application deadline."
    },
    {
      id: 9,
      category: "companies",
      question: "How do I manage job applications?",
      answer: "From any job posting, click 'View Applicants' to see all candidates who applied. You can filter by status and update application statuses (shortlisted, accepted, rejected)."
    },
    {
      id: 10,
      category: "companies",
      question: "Can I edit job postings after publishing?",
      answer: "Yes, admins can edit job details, update company information, and manage job postings through the dashboard. You can also delete jobs if needed."
    },

    // Technical
    {
      id: 11,
      category: "technical",
      question: "I forgot my password. How can I reset it?",
      answer: "Click 'Forgot Password' on the sign-in page, enter your email address, and you'll receive an OTP to reset your password. The OTP is valid for 5 minutes."
    },
    {
      id: 12,
      category: "technical",
      question: "Why am I not receiving notifications?",
      answer: "Check your notification settings and ensure your email address is verified. Also check your spam folder. Contact support if the issue persists."
    },
    {
      id: 13,
      category: "technical",
      question: "The website is loading slowly. What should I do?",
      answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the problem continues, it might be a temporary server issue."
    }
  ];

  const categories = [
    { id: "all", name: "All Topics", count: faqs.length },
    { id: "general", name: "General", count: faqs.filter(f => f.category === "general").length },
    { id: "students", name: "For Students", count: faqs.filter(f => f.category === "students").length },
    { id: "companies", name: "For Companies", count: faqs.filter(f => f.category === "companies").length },
    { id: "technical", name: "Technical", count: faqs.filter(f => f.category === "technical").length },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions or get in touch with our support team.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No FAQs found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map(faq => (
            <div key={faq.id} className="bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-gray-700 mb-6">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:campushire@gmail.com"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>Email Support</span>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Email us at: <strong>campushire@gmail.com</strong>
        </p>
      </div>
    </div>
  );
}
