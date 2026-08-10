export type ExperienceHighlight = {
  id: string;
  title: string;
  body: string;
  tools: string[];
  outcome?: string;
  diagram: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  url: string;
  logo?: string;
  logoAlt?: string;
  monogram?: string;
  summary: string;
  highlights: ExperienceHighlight[];
};

export const identity = {
  name: "Zuhayr Huseni",
  role: "Software engineer at PayPal",
  location: "San Francisco Bay Area",
  citizenship: "U.S. citizen",
  email: "zuhayrhuseni@gmail.com",
  phone: "978-201-2509",
  github: "https://github.com/zuhayrhuseni",
  linkedin: "https://www.linkedin.com/in/zuhayr-huseni",
  resume: "/Zuhayr-Huseni-Resume.pdf",
};

export const hero = {
  headline: "I build reliable systems for payments, AI, and the people who use them.",
  dek: "Software engineer at PayPal with experience across distributed systems, developer infrastructure, 5G research, machine learning, and full-stack products.",
};

export const about = {
  title: "Adaptable by experience. Curious by default.",
  paragraphs: [
    "My work spans big tech, startups, research, and industrial software. I learn unfamiliar domains quickly and enjoy moving between layers - from distributed services and infrastructure to products and interfaces - to build systems that are reliable, observable, and useful.",
    "I am interested in technical roles at startups and large technology companies at the forefront of AI, especially AI infrastructure, developer tools, and human-computer interaction.",
  ],
  interests: ["AI infrastructure", "Developer tools", "Human-computer interaction", "Distributed systems"],
  personal: ["Basketball", "35 countries traveled"],
  additional: {
    label: "London startup experience",
    company: "Host Family Stay",
    url: "https://hostfamilystay.com/",
  },
};

export const experiences: Experience[] = [
  {
    id: "paypal",
    company: "PayPal",
    role: "Software Engineer",
    period: "July 2025 - Present",
    location: "San Jose, CA",
    url: "https://www.paypal.com/",
    logo: "/brands/paypal.png",
    logoAlt: "PayPal",
    summary:
      "I build distributed compliance services and developer infrastructure for PayPal's global Suspicious Activity Report platform, where transaction data, security boundaries, and jurisdiction-specific requirements meet.",
    highlights: [
      {
        id: "compliance",
        title: "Compliance platform",
        body:
          "Design and maintain distributed services that process transaction, account, and payment data through encrypted pipelines and secure service-to-service authentication.",
        tools: ["Java", "Spring Boot", "GCP", "Distributed systems", "Encryption", "S2S auth"],
        diagram: ["Payment data", "Encrypted services", "Authenticated boundary", "SAR rules"],
      },
      {
        id: "test-data",
        title: "Test-data CLI",
        body:
          "Built a company-wide Claude Code CLI that provisions realistic test accounts with synthetic bank accounts, cards, and identity attributes on demand.",
        tools: ["Claude Code", "CLI", "Synthetic data", "End-to-end testing"],
        outcome: "Cross-team setup reduced from manual requests to minutes",
        diagram: ["Engineer", "CLI request", "Synthetic profile", "Ready to test"],
      },
      {
        id: "agent-harness",
        title: "Agent harness",
        body:
          "Developed an internal harness connecting Claude Desktop and Claude Code to protected MCP servers with reusable tokenization and authentication.",
        tools: ["Claude Code", "Claude Desktop", "MCP servers", "Tokenization", "Authentication"],
        outcome: "Adopted organization-wide for debugging, code analysis, and workflow automation",
        diagram: ["Agent clients", "Tokenization", "Service auth", "Protected MCP"],
      },
      {
        id: "testing",
        title: "Test reliability",
        body:
          "Expanded unit and integration coverage and introduced WireMock dependency simulation to remove flaky external calls and shorten deployment feedback cycles.",
        tools: ["JUnit", "WireMock", "Integration testing", "CI/CD"],
        diagram: ["Code change", "Simulated dependency", "Test suite", "Deployment signal"],
      },
      {
        id: "operations",
        title: "Production operations",
        body:
          "Investigate failures across distributed compliance services, resolving transaction, data-consistency, and authentication regressions during major platform upgrades.",
        tools: ["Datadog", "Splunk", "Oracle SQL", "Structured logs"],
        diagram: ["Alert", "Trace + logs", "SQL validation", "Root cause"],
      },
    ],
  },
  {
    id: "forms-surfaces",
    company: "Forms + Surfaces",
    role: "Full Stack Software Engineer Intern",
    period: "June 2024 - August 2024",
    location: "Pittsburgh, PA",
    url: "https://www.forms-surfaces.com/",
    logo: "/brands/forms-surfaces.png",
    logoAlt: "Forms + Surfaces",
    summary:
      "I built software for two expensive questions: finding manufacturing data quickly and validating physical designs before they became prototypes.",
    highlights: [
      {
        id: "erp-search",
        title: "Natural language to ERP data",
        body:
          "Shipped a React and Flask application that translated natural-language questions into SQL against a Made2Manage ERP database through the OpenAI API.",
        tools: ["React", "Python", "Flask", "SQL", "OpenAI API", "Made2Manage"],
        outcome: "40% faster data retrieval",
        diagram: ["Question", "OpenAI layer", "Generated SQL", "ERP answer"],
      },
      {
        id: "design-validation",
        title: "Automated design validation",
        body:
          "Automated product-design validation with Python scripting against the SolidWorks API and PyFEM simulations for thermal and environmental stress.",
        tools: ["Python", "SolidWorks API", "PyFEM", "Finite-element simulation"],
        outcome: "50% faster timelines and roughly $10,000 in annual prototyping costs avoided",
        diagram: ["CAD model", "Stress inputs", "PyFEM simulation", "Validated design"],
      },
    ],
  },
  {
    id: "uconn",
    company: "University of Connecticut",
    role: "Undergraduate Researcher - 5G Systems and Performance",
    period: "April 2024 - September 2024",
    location: "Storrs, CT · Remote",
    url: "https://computing.engineering.uconn.edu/research/areas/architecture-embedded-systems-and-systems-performance/",
    logo: "/brands/uconn.jpg",
    logoAlt: "University of Connecticut",
    summary:
      "I benchmarked live 5G systems close to the wire, combining repeatable Linux experiments with real-time visualization to find stability and performance bottlenecks.",
    highlights: [
      {
        id: "benchmarking",
        title: "Open-air interface benchmarking",
        body:
          "Benchmarked throughput and latency across four open-air interfaces, scripting traffic generation, node simulation, and system-log analysis to isolate regressions in real time.",
        tools: ["Python", "Shell", "Linux", "Traffic generation", "System logs"],
        diagram: ["Traffic generator", "4 interfaces", "System logs", "Regression signal"],
      },
      {
        id: "live-plot",
        title: "Live network visualization",
        body:
          "Implemented tunneling between gNodeB and UE nodes and built a C-based latency and throughput visualization with srsGUI.",
        tools: ["C", "srsGUI", "gNodeB", "UE", "5G RAN"],
        diagram: ["gNodeB", "Tunnel", "UE node", "Live srsGUI plot"],
      },
    ],
  },
  {
    id: "propel-flow",
    company: "Propel Flow",
    role: "AI Development Engineer Intern",
    period: "February 2024 - April 2024",
    location: "Hood River, OR · Remote",
    url: "https://www.linkedin.com/company/propel-flow/",
    monogram: "PF",
    summary:
      "I moved machine-learning work into client-facing services and improved the retrieval layer behind financial recommendation pipelines.",
    highlights: [
      {
        id: "inference",
        title: "ML inference services",
        body:
          "Built and deployed Python and TensorFlow inference services on AWS EC2 with Lambda-based serverless processing.",
        tools: ["Python", "TensorFlow", "AWS EC2", "AWS Lambda"],
        outcome: "Estimated $40,000 in annual client savings",
        diagram: ["Client request", "Lambda", "TensorFlow service", "Prediction"],
      },
      {
        id: "recommendations",
        title: "Financial recommendations",
        body:
          "Tuned GPT-4 recommendation pipelines and added MongoDB and PyMongo indexing strategies to improve retrieval latency and accuracy.",
        tools: ["GPT-4", "MongoDB", "PyMongo", "Retrieval"],
        diagram: ["Financial context", "Indexed retrieval", "GPT-4 pipeline", "Recommendation"],
      },
    ],
  },
];

export const education = [
  {
    school: "Georgia Institute of Technology",
    degree: "M.S. Computer Science · Machine Learning specialization",
    period: "Incoming Fall 2026 · Expected 2028",
    detail: "Online program alongside full-time engineering work.",
    url: "https://www.omscs.gatech.edu/",
    logo: "/brands/georgia-tech.png",
  },
  {
    school: "University of Connecticut",
    degree: "B.S. Computer Science",
    period: "May 2025 · GPA 3.76",
    detail: "Honors Scholar and Laureate · STEM Scholar · Dean's List Engineering · Gloshoc Hackathon winner",
    url: "https://uconn.edu/",
    logo: "/brands/uconn.jpg",
  },
];

export const project = {
  name: "OneStopShopHousing.AI",
  period: "September 2024 - May 2025",
  url: "https://github.com/jmedrek1/uconn-senior-design",
  title: "One search surface for fragmented housing data.",
  description:
    "I built scalable scrapers that normalized housing listings into SQLite, then added an OpenAI-backed layer that translated plain-language requests into optimized SQL. The product included authentication, favorites, comparisons, and commute-time visualization.",
  tools: ["React", "Node.js / Express", "SQLite", "OpenAI API"],
  capabilities: ["Authentication", "Favorites", "Comparisons", "Commute-time visualization"],
  stages: [
    { title: "Scrape", detail: "Collect listings from multiple third-party platforms." },
    { title: "Normalize", detail: "Map inconsistent records into one comparable SQLite schema." },
    { title: "Ask", detail: "Accept a housing request in natural language." },
    { title: "Generate SQL", detail: "Translate the request into an optimized database query." },
    { title: "Compare", detail: "Return listings with favorites, comparisons, and commute context." },
  ],
};
