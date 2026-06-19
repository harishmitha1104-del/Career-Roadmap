/**
 * data.js
 * Mock database representing the required tables:
 * - Users
 * - CareerPaths
 * - Skills (embedded and categorized within paths)
 * - Certifications
 * - Courses
 * - Roadmaps
 * - UserProgress
 */

window.AppDB = {
  // 1. Users Table
  users: [
    {
      id: "user_harishmitha",
      name: "Ms. HARISHMITHA J",
      regNo: "24BCT016",
      education: "Second Year B.Sc (Computer Technology)",
      college: "PSG College of Arts and Science",
      location: "Coimbatore, Tamil Nadu, India",
      currentSkills: ["Python", "Data Science Basics", "SQL"],
      avatar: "assets/cyber_avatar.png"
    }
  ],

  // 2. CareerPaths Table
  careerPaths: [
    {
      id: "data_science",
      title: "Data Scientist",
      description: "Analyze and interpret complex digital data to assist businesses in making informed decisions. Combines coding, statistics, and machine learning.",
      salary: { entry: "₹6,0,000", senior: "₹24,00,000+" },
      growth: "22% YoY projection",
      responsibilities: [
        "Clean, analyze, and visualize structured and unstructured data",
        "Build predictive machine learning models to solve business problems",
        "Communicate data-driven insights and recommendations to stakeholders",
        "Collaborate with engineering teams to deploy models to production"
      ],
      tools: ["Python", "Pandas", "NumPy", "SQL", "Tableau", "Jupyter Notebook", "Scikit-Learn"],
      certifications: ["Google Data Analytics Professional Certificate", "IBM Data Science Professional Certificate"],
      courses: [
        { id: "c1", title: "Python for Data Science", provider: "Coursera (IBM)" },
        { id: "c2", title: "Applied Data Science with Python Specialization", provider: "Coursera (University of Michigan)" },
        { id: "c3", title: "SQL for Data Science", provider: "Coursera (UC Davis)" }
      ],
      stages: {
        beginner: {
          title: "Beginner Stage",
          skills: [
            { id: "ds_py_basics", name: "Python Syntax & Fundamentals", completed: true },
            { id: "ds_sql_basics", name: "Basic SQL Queries", completed: true },
            { id: "ds_eda_basics", name: "Exploratory Data Analysis", completed: false }
          ],
          projects: [
            { name: "Retail Store Sales SQL Queries", desc: "Write basic SELECT and JOIN queries to extract sales insights." },
            { name: "Housing Price Exploratory Data Analysis", desc: "Identify data distributions and correlations using Jupyter notebooks." }
          ],
          certifications: ["NGB Tech Solutions Python Programming Foundation"],
          completionTime: "8 Weeks"
        },
        intermediate: {
          title: "Intermediate Stage",
          skills: [
            { id: "ds_pandas", name: "Data Manipulation (Pandas & NumPy)", completed: true }, // Completed through internship
            { id: "ds_viz", name: "Data Visualization (Seaborn & Tableau)", completed: true }, // Completed through internship
            { id: "ds_stats", name: "Probability & Applied Statistics", completed: false }
          ],
          projects: [
            { name: "COVID-19 Global Trends Tracker", desc: "Build interactive visual reports demonstrating infection and recovery ratios." },
            { name: "Employee Turnover Predictor", desc: "Preprocess HR records and run statistical tests to discover churn indicators." }
          ],
          certifications: ["NGB Tech Solutions Internship in Data Science with Python"],
          completionTime: "10 Weeks"
        },
        advanced: {
          title: "Advanced Stage",
          skills: [
            { id: "ds_ml_scikit", name: "Machine Learning (Scikit-Learn)", completed: false },
            { id: "ds_feat_eng", name: "Feature Engineering & Tuning", completed: false },
            { id: "ds_ab_test", name: "A/B Testing & Experimentation", completed: false }
          ],
          projects: [
            { name: "Customer Churn Predictive Classifier", desc: "Build and evaluate classification algorithms (Random Forest, XGBoost) to forecast churn." },
            { name: "E-Commerce Recommendation System", desc: "Develop collaborative filtering recommender using matrix factorization." }
          ],
          certifications: ["IBM Data Science Professional Certificate"],
          completionTime: "12 Weeks"
        },
        jobReady: {
          title: "Job-Ready Stage",
          skills: [
            { id: "ds_api_dep", name: "Model API Deployment (FastAPI/Flask)", completed: false },
            { id: "ds_bigdata", name: "Big Data processing (PySpark)", completed: false },
            { id: "ds_git_port", name: "Git Workflow & GitHub Portfolio", completed: false }
          ],
          projects: [
            { name: "End-to-End ML Pipeline on AWS", desc: "Automate training and deploy prediction endpoints using Docker container instances." }
          ],
          certifications: ["AWS Certified Cloud Practitioner"],
          completionTime: "6 Weeks"
        }
      }
    },
    {
      id: "ai_engineer",
      title: "AI & Machine Learning Engineer",
      description: "Design and implement machine learning systems, deep learning neural networks, and AI pipelines to create smart applications.",
      salary: { entry: "₹7,50,000", senior: "₹28,00,000+" },
      growth: "35% YoY projection",
      responsibilities: [
        "Develop deep learning architectures for Computer Vision and NLP",
        "Train, fine-tune, and optimize neural networks at scale",
        "Integrate Large Language Models (LLMs) via APIs or self-hosted models",
        "Deploy robust ML systems into cloud-native architectures"
      ],
      tools: ["Python", "PyTorch", "TensorFlow", "Hugging Face", "Docker", "Git", "FastAPI"],
      certifications: ["DeepLearning.AI TensorFlow Developer", "AWS Certified Machine Learning Specialist"],
      courses: [
        { id: "ai_c1", title: "Machine Learning Specialization", provider: "Coursera (Stanford/DeepLearning.AI)" },
        { id: "ai_c2", title: "Deep Learning Specialization", provider: "Coursera (DeepLearning.AI)" },
        { id: "ai_c3", title: "Generative AI with Large Language Models", provider: "Coursera (DeepLearning.AI)" }
      ],
      stages: {
        beginner: {
          title: "Beginner Stage",
          skills: [
            { id: "ai_py_adv", name: "Advanced Python Programming", completed: true },
            { id: "ai_math", name: "Linear Algebra & Calculus Basics", completed: false },
            { id: "ai_numpy", name: "Numerical Array Operations (NumPy)", completed: true }
          ],
          projects: [
            { name: "Linear Algebra Helpers in Python", desc: "Build a mini-library for vector and matrix operations without standard libraries." }
          ],
          certifications: ["Mathematics for Machine Learning Specialization"],
          completionTime: "6 Weeks"
        },
        intermediate: {
          title: "Intermediate Stage",
          skills: [
            { id: "ai_ml_models", name: "Classical ML Algorithms", completed: false },
            { id: "ai_nn_intro", name: "Intro to Neural Networks", completed: false },
            { id: "ai_git", name: "Collaborative Git Workflow", completed: false }
          ],
          projects: [
            { name: "Digit Recognizer (MNIST)", desc: "Build a Multi-Layer Perceptron from scratch to recognize handwritten digits." }
          ],
          certifications: ["Stanford Machine Learning Certificate"],
          completionTime: "8 Weeks"
        },
        advanced: {
          title: "Advanced Stage",
          skills: [
            { id: "ai_pytorch", name: "Deep Learning with PyTorch", completed: false },
            { id: "ai_cv_basics", name: "Computer Vision (CNNs)", completed: false },
            { id: "ai_nlp_basics", name: "Natural Language Processing (Transformers)", completed: false }
          ],
          projects: [
            { name: "Custom Object Detection Pipeline", desc: "Train a YOLO-based detector on custom labeled images." },
            { name: "Semantic Text Search Engine", desc: "Index and retrieve articles using embedding vectors and similarity databases." }
          ],
          certifications: ["DeepLearning.AI Deep Learning Specialization"],
          completionTime: "12 Weeks"
        },
        jobReady: {
          title: "Job-Ready Stage",
          skills: [
            { id: "ai_llm_ops", name: "LLM Fine-Tuning & Prompt Ops", completed: false },
            { id: "ai_mlops", name: "MLOps Pipelines (MLflow/Kubeflow)", completed: false },
            { id: "ai_deploy", name: "Model Deployment at Scale", completed: false }
          ],
          projects: [
            { name: "Generative AI Chatbot Assistant", desc: "Deploy a RAG-based AI assistant integrated with internal wiki documentation." }
          ],
          certifications: ["AWS Certified Machine Learning - Specialty"],
          completionTime: "8 Weeks"
        }
      }
    },
    {
      id: "frontend_dev",
      title: "Frontend Web Developer",
      description: "Build beautiful, highly interactive and responsive user interfaces. Focuses on core user experience, loading speed, and modern styling guidelines.",
      salary: { entry: "₹5,00,000", senior: "₹18,00,000+" },
      growth: "18% YoY projection",
      responsibilities: [
        "Develop web layouts using semantic HTML, responsive CSS, and ES6+ JS",
        "Assemble interactive web applications using the React framework",
        "Implement micro-interactions and transitions that enhance the user experience",
        "Coordinate with UI/UX designers to translate Figma visual mockups to code"
      ],
      tools: ["HTML5", "CSS3", "JavaScript", "React", "VS Code", "Vite", "Git", "Figma"],
      certifications: ["Meta Front-End Developer Professional Certificate", "Google UX Design Professional Certificate"],
      courses: [
        { id: "fe_c1", title: "Modern JavaScript from Beginner to Advanced", provider: "Udemy" },
        { id: "fe_c2", title: "React Complete Guide (including Hooks & Router)", provider: "Academind" },
        { id: "fe_c3", title: "UX Design Essentials", provider: "Coursera" }
      ],
      stages: {
        beginner: {
          title: "Beginner Stage",
          skills: [
            { id: "fe_html", name: "Semantic HTML5 Elements", completed: true },
            { id: "fe_css_layout", name: "CSS Layouts (Flexbox & Grid)", completed: false },
            { id: "fe_git_basics", name: "Basic Git Version Control", completed: false }
          ],
          projects: [
            { name: "Personal Profile Showcase", desc: "Create a fully semantic and beautiful profile page using pure CSS structure." }
          ],
          certifications: ["freeCodeCamp Responsive Web Design Certificate"],
          completionTime: "6 Weeks"
        },
        intermediate: {
          title: "Intermediate Stage",
          skills: [
            { id: "fe_js_dom", name: "JS DOM Manipulation & Events", completed: false },
            { id: "fe_css_vars", name: "CSS Custom Variables & Themes", completed: false },
            { id: "fe_api_fetch", name: "REST API Integration (Fetch)", completed: false }
          ],
          projects: [
            { name: "Task Tracker App with Storage", desc: "Develop an interactive task list that caches items in LocalStorage." },
            { name: "Dynamic Finance Analytics Portal", desc: "Fetch stock or currency values from a public API and display reactive charts." }
          ],
          certifications: ["freeCodeCamp JavaScript Algorithms & Data Structures"],
          completionTime: "8 Weeks"
        },
        advanced: {
          title: "Advanced Stage",
          skills: [
            { id: "fe_react_core", name: "React Components & State Hooks", completed: false },
            { id: "fe_routing", name: "Client-Side Routing & Multi-Page", completed: false },
            { id: "fe_state_mgmt", name: "State Management (Redux/Context)", completed: false }
          ],
          projects: [
            { name: "Mock E-Commerce Cart System", desc: "Assemble an interface tracking items in a cart, calculation of taxes, and simulated checkouts." }
          ],
          certifications: ["Meta Front-End Developer Professional Certificate"],
          completionTime: "10 Weeks"
        },
        jobReady: {
          title: "Job-Ready Stage",
          skills: [
            { id: "fe_ssr", name: "Next.js Framework & SSR Basics", completed: false },
            { id: "fe_perf", name: "Web Performance & Lighthouse Tuning", completed: false },
            { id: "fe_test", name: "Unit Testing with Jest", completed: false }
          ],
          projects: [
            { name: "Collab Dashboard with Multi-State Management", desc: "Develop a complex, highly polished Kanban board system with beautiful animations." }
          ],
          certifications: ["AWS Certified Cloud Practitioner"],
          completionTime: "6 Weeks"
        }
      }
    }
  ],

  // 3. Certifications Table
  certifications: [
    {
      id: "cert_ngb_ds",
      name: "Internship Training in Data Science with Python",
      issuer: "NGB Tech Solutions International Private Limited",
      recipient: "Ms. HARISHMITHA J (Reg.No : 24BCT016)",
      college: "PSG College of Arts and Science, Coimbatore",
      date: "30.05.2026",
      period: "11th May 2026 to 30th May 2026",
      verified: true,
      grade: "Outstanding Performance & Good Character",
      details: "Internship Training partial fulfillment of academic requirement. Verified in NGB Tech database under CIN: U72900TZ021PTC036441."
    },
    {
      id: "cert_python_basic",
      name: "Python Programming Foundation",
      issuer: "PSG College - Skill Development Cell",
      recipient: "Ms. HARISHMITHA J",
      college: "PSG College of Arts and Science",
      date: "12.02.2026",
      period: "Jan 2026 - Feb 2026",
      verified: true,
      grade: "Grade A+",
      details: "Basics of loops, standard functions, lists, dictionaries, and file I/O operations."
    }
  ],

  // 4. Courses Table
  courses: [
    { id: "course_py_da", title: "Data Analysis with Python", provider: "Coursera / IBM", level: "Beginner", duration: "24 Hours" },
    { id: "course_ml_stand", title: "Machine Learning Course by Andrew Ng", provider: "Coursera / Stanford", level: "Intermediate", duration: "48 Hours" },
    { id: "course_dl_deep", title: "Deep Learning Specialization", provider: "DeepLearning.AI", level: "Advanced", duration: "72 Hours" },
    { id: "course_web_js", title: "Modern JavaScript Bootcamp", provider: "Udemy", level: "Beginner", duration: "32 Hours" },
    { id: "course_react_adv", title: "Advanced React Patterns", provider: "Frontend Masters", level: "Advanced", duration: "18 Hours" }
  ],

  // 5. Roadmaps Table (User Created)
  roadmaps: [],

  // 6. UserProgress Table
  userProgress: {
    userId: "user_harishmitha",
    activeRoadmapId: "data_science",
    completedSkillIds: ["ds_py_basics", "ds_sql_basics", "ds_pandas", "ds_viz", "ai_py_adv", "ai_numpy", "fe_html"],
    achievements: [
      { id: "ach_intern", name: "Industrial Exposure", desc: "Successfully completed NGB Tech Solutions Internship", date: "30.05.2026", icon: "🏢" },
      { id: "ach_py_master", name: "Python Foundations", desc: "Mastered python loops, syntax and standard structures", date: "12.02.2026", icon: "🐍" },
      { id: "ach_first_road", name: "First Steps", desc: "Generated your first custom career roadmap", date: "19.06.2026", icon: "🗺️" }
    ],
    goals: [
      { id: "goal_stats", text: "Complete Advanced Statistics module", status: "pending", targetDate: "2026-07-15" },
      { id: "goal_ml_model", text: "Build a Machine Learning Classifier project", status: "pending", targetDate: "2026-08-01" },
      { id: "goal_intern_ds", text: "Apply Data Science techniques to college projects", status: "completed", targetDate: "2026-05-30" }
    ]
  }
};
