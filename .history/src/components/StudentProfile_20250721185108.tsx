"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Star,
  UploadCloud,
  Edit,
  Save,
  Trash2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  email: string;
  enrollmentNo: string;
  branch: string;
  year: number;
  cgpa: number;
  resumeUrl?: string;
  skills: string[];
  isPlaced?: boolean;
}

interface Props {
  userId: string; // This is now actually studentId from the params
  editable: boolean;
}

export default function StudentProfile({ userId: studentId, editable }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  // New state for skills autocomplete
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

  const branches = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Information Technology",
    "Biotechnology",
    "Chemical",
  ];

  // Comprehensive tech skills list (445+ skills)
  const techSkills = Array.form(
    new Set(
      [
        // Programming Languages
    "JavaScript", "Python", "Java", "C++", "C#", "C", "TypeScript", "Go", "Rust", "Swift", "Kotlin",
    "Ruby", "PHP", "Scala", "R", "Dart", "Objective-C", "Perl", "Lua", "Elixir", "Clojure", "Haskell",
    "F#", "VB.NET", "COBOL", "Fortran", "Assembly", "Bash", "PowerShell", "MATLAB", "Julia",

    // Frontend Technologies
    "HTML", "CSS", "React", "Angular", "Vue.js", "jQuery", "Bootstrap", "Tailwind CSS", "Sass", "LESS",
    "Webpack", "Vite", "Next.js", "Nuxt.js", "Svelte", "Ember.js", "Backbone.js", "Material-UI",
    "Ant Design", "Styled Components", "CSS Grid", "Flexbox", "Web Components", "Progressive Web Apps",
    "Redux", "Zustand", "MobX", "Recoil", "Context API", "React Hook Form", "Formik", "Framer Motion",

    // Backend Technologies  
    "Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "ASP.NET", "Ruby on Rails",
    "Laravel", "CodeIgniter", "Symfony", "Struts", "Hibernate", "JPA", "Entity Framework", "Sequelize",
    "Mongoose", "GraphQL", "REST API", "gRPC", "Socket.io", "WebSockets", "Microservices", "Serverless",
    "NestJS", "Koa.js", "Hapi.js", "Fastify", "Phoenix", "Gin", "Chi", "Echo", "Fiber",

    // Databases
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "MariaDB", "Cassandra",
    "DynamoDB", "Firebase", "CouchDB", "Neo4j", "Elasticsearch", "InfluxDB", "Amazon RDS", "Azure SQL",
    "Google Cloud SQL", "Supabase", "PlanetScale", "Prisma", "Knex.js", "TypeORM", "SQL", "NoSQL",
    "CockroachDB", "TimescaleDB", "Amazon DocumentDB", "Azure Cosmos DB", "Google Firestore",

    // Cloud Platforms & Services
    "AWS", "Microsoft Azure", "Google Cloud Platform", "Amazon EC2", "AWS Lambda", "AWS S3", "Azure Functions",
    "Google App Engine", "Heroku", "Vercel", "Netlify", "DigitalOcean", "Linode", "Cloudflare", "AWS RDS",
    "Azure Cosmos DB", "Google BigQuery", "AWS CloudFormation", "Azure Resource Manager", "Google Cloud Build",
    "AWS ECS", "AWS EKS", "Azure Kubernetes Service", "Google Kubernetes Engine", "AWS CloudWatch",

    // DevOps & CI/CD
    "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions", "CircleCI", "Travis CI", "Azure DevOps",
    "Terraform", "Ansible", "Chef", "Puppet", "Vagrant", "Helm", "ArgoCD", "Spinnaker", "TeamCity",
    "Bamboo", "Octopus Deploy", "AWS CodePipeline", "Google Cloud Build", "HashiCorp Vault", "Consul",
    "Prometheus", "Grafana", "ELK Stack", "Splunk", "Datadog", "New Relic",

    // Version Control
    "Git", "GitHub", "GitLab", "Bitbucket", "Subversion", "Mercurial", "Perforce", "Azure Repos",

    // Mobile Development
    "React Native", "Flutter", "Xamarin", "Ionic", "Cordova", "PhoneGap", "NativeScript", "Android Studio",
    "Xcode", "Java (Android)", "Kotlin", "Swift", "Objective-C", "Unity", "Unreal Engine", "Cocos2d",
    "Android SDK", "iOS SDK", "Expo", "Capacitor", "Electron", "Tauri",

    // Testing Frameworks & Tools
    "Jest", "JUnit", "PyTest", "Mocha", "Chai", "Cypress", "Selenium", "TestNG", "NUnit", "xUnit",
    "Jasmine", "Karma", "Protractor", "Appium", "TestComplete", "Postman", "SoapUI", "JMeter",
    "LoadRunner", "Puppeteer", "Playwright", "Robot Framework", "Cucumber", "SpecFlow",
    "Vitest", "Testing Library", "Enzyme", "Supertest", "Artillery", "K6",

    // Data Science & Machine Learning
    "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn", "Plotly", "TensorFlow", "PyTorch", "Keras",
    "Scikit-learn", "Apache Spark", "Hadoop", "Jupyter", "Anaconda", "OpenCV", "NLTK", "spaCy",
    "Hugging Face", "MLflow", "Apache Airflow", "Dask", "XGBoost", "LightGBM", "CatBoost",

    // Web Security
    "OAuth", "JWT", "HTTPS", "SSL/TLS", "CORS", "XSS Protection", "CSRF Protection", "Helmet.js",
    "bcrypt", "Passport.js", "Auth0", "Okta", "SAML", "OpenID Connect", "Security Headers",

    // Content Management & E-commerce
    "WordPress", "Drupal", "Joomla", "Shopify", "WooCommerce", "Magento", "PrestaShop", "Strapi",
    "Contentful", "Sanity", "Ghost", "Forestry", "Netlify CMS", "Headless CMS",

    // Package Managers & Build Tools
    "npm", "yarn", "pnpm", "pip", "composer", "Maven", "Gradle", "NuGet", "Cargo", "Go Modules",
    "Bundler", "Poetry", "Pipenv", "Conda", "Homebrew", "Chocolatey", "Parcel", "Rollup", "Turbopack",

    // API & Integration
    "Swagger", "OpenAPI", "RESTful Services", "SOAP", "RPC", "Webhooks", "API Gateway", "Microservices",
    "Event-Driven Architecture", "Message Queues", "Apache Kafka", "RabbitMQ", "Redis Pub/Sub",

    // Monitoring & Analytics
    "Google Analytics", "Mixpanel", "Amplitude", "Hotjar", "Sentry", "LogRocket", "Bugsnag", "Rollbar",
    "Application Insights", "CloudWatch", "Stackdriver", "Elastic APM", "Jaeger", "Zipkin",

    // Design & UI/UX Tools
    "Figma", "Adobe XD", "Sketch", "InVision", "Zeplin", "Marvel", "Principle", "Framer", "Protopie",
    "Adobe Photoshop", "Adobe Illustrator", "Canva", "GIMP", "Inkscape",

    // Game Development
    "Unity", "Unreal Engine", "Godot", "GameMaker Studio", "Construct", "Phaser", "Three.js", "Babylon.js",
    "OpenGL", "DirectX", "Vulkan", "Metal", "WebGL", "WASM",

    // Blockchain & Cryptocurrency
    "Solidity", "Web3.js", "Ethers.js", "Truffle", "Hardhat", "MetaMask", "IPFS", "Smart Contracts",
    "Ethereum", "Bitcoin", "Hyperledger", "Chainlink", "Polygon", "Binance Smart Chain",

    // IoT & Hardware
    "Arduino", "Raspberry Pi", "ESP32", "MQTT", "LoRaWAN", "Zigbee", "Bluetooth", "WiFi", "NFC",
    "Embedded Systems", "Real-time Systems", "Firmware Development", "PCB Design",

    // Business Intelligence & Analytics
    "Tableau", "Power BI", "QlikView", "Looker", "Google Data Studio", "Apache Superset", "Metabase",
    "Excel", "Google Sheets", "SQL Analytics", "Data Warehousing", "ETL", "Apache Kafka",

    // Operating Systems & Virtualization
    "Linux", "Windows", "macOS", "Ubuntu", "CentOS", "Red Hat", "SUSE", "Debian", "FreeBSD",
    "VMware", "VirtualBox", "Hyper-V", "KVM", "Xen", "Proxmox", "Docker Desktop", "WSL",

    // Networking & Infrastructure
    "TCP/IP", "DNS", "DHCP", "VPN", "Firewall", "Load Balancer", "CDN", "Nginx", "Apache", "IIS",
    "HAProxy", "Cloudflare", "AWS CloudFront", "Azure CDN", "Network Security", "Subnetting",

    // Project Management & Collaboration
    "Jira", "Confluence", "Trello", "Asana", "Monday.com", "Notion", "Slack", "Microsoft Teams",
    "Discord", "Zoom", "Google Workspace", "Office 365", "Miro", "Lucidchart", "Draw.io"
  ].sort();
      ]
    )
  )

  const isAdmin = session?.user?.role === "admin";

  // Filter skills based on input
  useEffect(() => {
    if (skillInput.trim()) {
      const filtered = techSkills
        .filter(skill =>
          skill.toLowerCase().includes(skillInput.toLowerCase()) &&
          !selectedSkills.includes(skill)
        )
        .slice(0, 10); // Show top 10 matches
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  }, [skillInput, selectedSkills]);

  // Initialize selected skills from form
  useEffect(() => {
    if (form.skills && Array.isArray(form.skills)) {
      setSelectedSkills(form.skills);
    }
  }, [form.skills]);

  useEffect(() => {
    fetchProfile();
  }, [studentId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      let data;
      if (isAdmin) {
        ({ data } = await axios.get<{
          success: boolean;
          student: any;
        }>(`/api/admin/students/${studentId}`));
      } else {
        ({ data } = await axios.get<{
          success: boolean;
          student: Profile;
        }>(`/api/student/profile`));
      }

      if (data.success && data.student) {
        const src = data.student;
        const mappedProfile: Profile = {
          name: src.name || "",
          email: src.email || "",
          enrollmentNo: src.enrollmentNo,
          branch: src.branch,
          year: src.year,
          cgpa: src.cgpa,
          resumeUrl: src.resumeUrl,
          skills: src.skills || [],
          isPlaced: src.isPlaced || false,
        };

        setProfile(mappedProfile);
        setForm(mappedProfile);
        setSelectedSkills(mappedProfile.skills || []);
      } else if (!data.success) {
        setError("Student has not created a profile yet.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const { data } = await axios.delete(`/api/admin/students/${studentId}`);
      if (data.success) {
        router.push("/admin/students");
      } else {
        setError(data.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Error deleting student");
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "year" || name === "cgpa") {
      setForm({ ...form, [name]: Number(value) });
    } else if (name === "enrollmentNo") {
      setForm({ ...form, enrollmentNo: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Skills management functions
  const addSkill = (skill: string) => {
    if (selectedSkills.length >= 15) {
      alert("You can only select up to 15 skills.");
      return;
    }
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      setForm(prev => ({ ...prev, skills: updatedSkills }));
    }
    setSkillInput("");
    setFilteredSkills([]);
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = selectedSkills.filter(skill => skill !== skillToRemove);
    setSelectedSkills(updatedSkills);
    setForm(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredSkills.length > 0) {
      e.preventDefault();
      addSkill(filteredSkills[0]);
    }
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post<{
        success: boolean;
        resumeUrl: string;
        message?: string;
      }>(`/api/student/${studentId}/uploadResume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        return data.resumeUrl;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        "Upload error: " + (axiosError.message || "Unknown error")
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      let resumeUrl = form.resumeUrl;

      if (selectedFile) {
        resumeUrl = (await uploadResume()) as string;
      }

      const { data } = await axios({
        method: profile ? "PATCH" : "POST",
        url: "/api/student/profile",
        data: {
          enrollmentNo: form.enrollmentNo,
          branch: form.branch,
          year: form.year,
          cgpa: form.cgpa,
          resumeUrl,
          skills: selectedSkills, // Use selectedSkills instead of form.skills
          name: form.name,
          email: form.email,
          isPlaced: form.isPlaced || false,
        },
      });

      if (data.success && data.profile) {
        const mappedProfile: Profile = {
          name: data.profile.name || form.name || "",
          email: data.profile.email || form.email || "",
          enrollmentNo: data.profile.enrollmentNo,
          branch: data.profile.branch,
          year: data.profile.year,
          cgpa: data.profile.cgpa,
          resumeUrl: data.profile.resumeUrl,
          skills: data.profile.skills || selectedSkills,
          isPlaced: data.profile.isPlaced || false,
        };

        setProfile(mappedProfile);
        setEditMode(false);
        setSelectedFile(null);
        setSelectedSkills(mappedProfile.skills);
      } else {
        setError("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm(profile || {});
    setEditMode(false);
    setSelectedFile(null);
    setSelectedSkills(profile?.skills || []);
    setSkillInput("");
    setFilteredSkills([]);
    setError("");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile && !editMode) {
    return (
      <div className="py-12 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          No Profile Found
        </h2>
        <p className="mt-2 text-gray-600">
          This student hasn't created their profile yet.
        </p>
        {editable && (
          <button
            onClick={() => {
              setEditMode(true);
              setForm({
                name: "",
                email: "",
                enrollmentNo: "",
                branch: "",
                year: 1,
                cgpa: 0,
                resumeUrl: "",
                skills: [],
                isPlaced: false,
              });
              setSelectedSkills([]);
            }}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Profile
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Profile</h1>
          <p className="text-gray-700 text-l">
            {editable
              ? editMode
                ? "Fill in the details"
                : "View or edit profile"
              : `Viewing ${profile?.name}'s profile`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isAdmin && !editMode && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              <span>{deleting ? "Deleting..." : "Delete Student"}</span>
            </button>
          )}
          {editable && !isAdmin && (
            <>
              {editMode && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => (editMode ? handleSave() : setEditMode(true))}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : editMode ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
                <span>
                  {saving
                    ? "Saving..."
                    : editMode
                      ? "Save"
                      : profile
                        ? "Edit"
                        : "Create"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-1">
            <User className="h-4 w-4" />
            <span>Full Name</span>
          </label>
          {editMode ? (
            <input
              name="name"
              type="text"
              value={form.name || session?.user?.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full name"
            />
          ) : (
            <p className="text-gray-800">
              {profile?.name || session?.user?.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-1">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </label>
          {editMode ? (
            <input
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
            />
          ) : (
            <p className="text-gray-800">{profile?.email}</p>
          )}
        </div>

        {/* Enrollment No */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span>Enrollment No.</span>
          </label>
          {editMode ? (
            <input
              name="enrollmentNo"
              type="text"
              value={form.enrollmentNo || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter enrollment number"
            />
          ) : (
            <p className="text-gray-800 font-mono">{profile?.enrollmentNo}</p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Branch
          </label>
          {editMode ? (
            <select
              name="branch"
              value={form.branch || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-800">{profile?.branch}</p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-1">
            <Calendar className="h-4 w-4" />
            <span>Year</span>
          </label>
          {editMode ? (
            <select
              name="year"
              value={form.year || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              {[1, 2, 3, 4].map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-800">{profile?.year} Year</p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-1">
            <Star className="h-4 w-4" />
            <span>CGPA</span>
          </label>
          {editMode ? (
            <input
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={form.cgpa || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter CGPA (0-10)"
            />
          ) : (
            <p className="text-gray-800">{profile?.cgpa}/10</p>
          )}
        </div>

        {/* Skills with Enhanced Autocomplete */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 mb-1 block">
            Skills
          </label>
          {editMode ? (
            <div className="space-y-3">
              {/* Skills Input with Autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyPress={handleSkillInputKeyPress}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type to search skills (e.g., React, Python, AWS)..."
                />

                {/* Autocomplete Dropdown */}
                {filteredSkills.length > 0 && selectedSkills.length < 15 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Selected Skills Display */}
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {selectedSkills.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  Start typing to search and add skills from our tech database
                </p>
              )}
            </div>
          ) : profile?.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No skills added</p>
          )}
        </div>
      </div>

      {/* Resume Section */}
      {editMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Resume</h3>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-600 bg-blue-50" : "border-gray-300"
              }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-2 text-gray-700">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Drag & drop PDF/DOC here, or click to browse"}
            </p>
          </div>
          {profile?.resumeUrl && (
            <p className="mt-2 text-sm text-gray-600">
              Current resume:{" "}
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Current Resume
              </a>
            </p>
          )}
        </div>
      )}
      {!editMode && profile?.resumeUrl && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Resume</h3>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download Resume
          </a>
        </div>
      )}

      {/* Placement Status */}
      {!editMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Placement Status
          </h3>
          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${profile?.isPlaced
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
                }`}
            >
              {profile?.isPlaced ? "Placed" : "Not Placed"}
            </span>
          </div>
        </div>
      )}

      {/* Profile Completion */}
      {editable && !isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Profile Completion
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((profile?.email ? 1 : 0) +
                      (profile?.enrollmentNo ? 1 : 0) +
                      (profile?.branch ? 1 : 0) +
                      (profile?.year ? 1 : 0) +
                      (profile?.cgpa ? 1 : 0) +
                      (profile?.resumeUrl ? 1 : 0) +
                      (profile?.skills && profile.skills.length > 0 ? 1 : 0)) *
                    14.28
                    }%`,
                }}
              ></div>
            </div>
            <span className="text-sm text-blue-800 font-medium">
              {Math.round(
                ((profile?.email ? 1 : 0) +
                  (profile?.enrollmentNo ? 1 : 0) +
                  (profile?.branch ? 1 : 0) +
                  (profile?.year ? 1 : 0) +
                  (profile?.cgpa ? 1 : 0) +
                  (profile?.resumeUrl ? 1 : 0) +
                  (profile?.skills && profile.skills.length > 0 ? 1 : 0)) *
                14.28
              )}
              % Complete
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            Complete the profile to improve chances of getting hired!
          </p>
        </div>
      )}
    </div>
  );
}
