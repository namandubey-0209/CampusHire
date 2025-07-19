// components/AboutContent.tsx
"use client";
import { Users, Target, Award, Briefcase } from "lucide-react";

export default function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About CampusHire</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Bridging the gap between talented students and innovative companies through 
          seamless campus recruitment solutions.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center mb-4">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To revolutionize campus recruitment by providing a comprehensive platform that 
            connects students with their dream careers while helping companies find the 
            best talent from top universities.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Our Vision</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To become the leading campus recruitment platform, fostering meaningful 
            connections between students and employers, and contributing to the growth 
            of both individuals and organizations.
          </p>
        </div>
      </div>

      {/* What We Do */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
            <p className="text-gray-600">
              Discover job opportunities, create comprehensive profiles, and apply to 
              positions that match your skills and aspirations.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">For Companies</h3>
            <p className="text-gray-600">
              Post job openings, manage applications efficiently, and find qualified 
              candidates from top educational institutions.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seamless Process</h3>
            <p className="text-gray-600">
              Streamlined application tracking, real-time notifications, and intuitive 
              interfaces for all stakeholders.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-4">
            CampusHire was born from the recognition that campus recruitment, while crucial 
            for both students and employers, often suffered from inefficiencies and missed 
            opportunities. Traditional recruitment processes were fragmented, making it 
            difficult for students to discover relevant opportunities and for companies 
            to find the right talent.
          </p>
          <p className="mb-4">
            Our team of dedicated professionals, with backgrounds in technology and education, 
            came together to create a solution that would streamline the entire campus 
            recruitment ecosystem. We believe that every student deserves access to great 
            career opportunities, and every company should be able to find exceptional talent.
          </p>
          <p>
            Today, CampusHire serves as a bridge between academic excellence and professional 
            success, helping shape the careers of thousands of students while supporting 
            companies in building their dream teams.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-blue-100 mb-6">
          Join thousands of students and companies who trust CampusHire for their recruitment needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/o-sign-up"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Get Started Today
          </a>
          <a
            href="/contact"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
