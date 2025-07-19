// components/PrivacyContent.tsx
"use client";

export default function PrivacyContent() {
  const lastUpdated = "July 19, 2025";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: {lastUpdated}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to CampusHire. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you use our 
            campus recruitment platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Name, email address, and contact information</li>
                <li>Academic details (enrollment number, branch, year, CGPA)</li>
                <li>Professional information (skills, resume, work experience)</li>
                <li>Account credentials and preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Job applications and application status</li>
                <li>Platform usage patterns and interactions</li>
                <li>Device information and IP addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>To provide and maintain our recruitment platform services</li>
            <li>To match students with relevant job opportunities</li>
            <li>To facilitate communication between students and employers</li>
            <li>To send important notifications about applications and opportunities</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations and prevent fraud</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
          <div className="space-y-4">
            <p className="text-gray-700">We may share your information in the following circumstances:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>With Employers:</strong> When you apply for jobs, relevant profile information is shared with the hiring company</li>
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our company</li>
            </ul>
            <p className="text-gray-700">
              <strong>We never sell your personal information to third parties for marketing purposes.</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
            secure servers, and regular security assessments.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibent text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">You have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive a copy of your data in a structured format</li>
            <li><strong>Withdraw Consent:</strong> Opt-out of certain data processing activities</li>
          </ul>
          <p className="text-gray-700 mt-4">
            To exercise these rights, please contact us at <strong>campushire@gmail.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
            and provide personalized content. You can control cookie settings through your browser, 
            though this may affect some platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information for as long as necessary to provide our services and 
            comply with legal obligations. Student profiles and application data are typically retained 
            for 3 years after graduation or account closure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Our platform is designed for college students and working professionals. We do not knowingly 
            collect personal information from individuals under 16 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
          <p className="text-gray-700 leading-relaxed">
            Your information may be processed and stored in countries other than your own. We ensure 
            appropriate safeguards are in place to protect your data during international transfers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Updates to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this privacy policy from time to time. We will notify you of any material 
            changes by posting the new policy on our platform and updating the "Last updated" date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
          <div className="text-gray-700">
            <p className="mb-4">If you have any questions about this privacy policy, please contact us:</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p><strong>Email:</strong> campushire@gmail.com</p>
              <p><strong>Address:</strong> CampusHire Technologies, 123 Innovation Drive, Bangalore, Karnataka 560001, India</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
