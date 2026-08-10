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
  status?: "complete" | "needs-details";
  summary: string;
  bullets: string[];
  stack: string[];
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: string[];
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
  eyebrow: "Distributed systems / compliance / developer infrastructure",
  headline: "I make complex systems easier to observe, test, and trust.",
  dek: "At PayPal, I trace transactions through distributed compliance services. Before that, I measured 5G networks in real time and built tools that turned days of coordination into minutes at the command line.",
};

export const paypal = {
  company: "PayPal",
  role: "Software engineer",
  period: "July 2025 - present",
  location: "San Jose, California",
  url: "https://www.paypal.com/",
  logo: "/brands/paypal.png",
  summary:
    "I design and maintain Spring Boot services on GCP for PayPal's global Suspicious Activity Report platform. The work sits where transaction data, security boundaries, and jurisdiction-specific rules meet.",
  work: [
    "I protect banking and card data with encrypted pipelines and secure service-to-service authentication.",
    "I investigate production failures across Datadog, Splunk, Oracle SQL, and structured logs during platform upgrades.",
    "I added WireMock-backed dependency simulation and broader unit and integration coverage to make deployment feedback more reliable.",
  ],
};

export const experiences: Experience[] = [
  {
    id: "host-family-stay",
    company: "Host Family Stay",
    role: "Role details to confirm",
    period: "Dates to confirm",
    location: "London, United Kingdom",
    url: "https://hostfamilystay.com/",
    logo: "/brands/host-family-stay.png",
    logoAlt: "Host Family Stay",
    status: "needs-details",
    summary:
      "Host Family Stay provides professionally managed homestay accommodation for students and interns in London.",
    bullets: [
      "Add the title and dates for this role.",
      "Add the CRM, AI automation, white-label, and customer-facing work you personally shipped.",
      "Add the stack and one concrete outcome. No personal claims have been inferred from the company website.",
    ],
    stack: ["Details pending"],
  },
  {
    id: "uconn",
    company: "University of Connecticut",
    role: "Undergraduate researcher, 5G systems and performance",
    period: "April - September 2024",
    location: "Remote",
    url: "https://computing.engineering.uconn.edu/research/areas/architecture-embedded-systems-and-systems-performance/",
    logo: "/brands/uconn.jpg",
    logoAlt: "University of Connecticut",
    summary:
      "I worked close to the wire: scripting experiments, simulating nodes, and visualizing live network behavior.",
    bullets: [
      "I benchmarked throughput and latency across four open-air interfaces on Linux, using Python and shell tooling to isolate stability regressions.",
      "I implemented tunneling between gNodeB and UE nodes.",
      "I built a real-time C visualization with srsGUI so bottlenecks showed up while the test was still running.",
    ],
    stack: ["C", "Python", "Shell", "Linux", "srsGUI", "5G RAN"],
  },
  {
    id: "forms-surfaces",
    company: "Forms+Surfaces",
    role: "Full stack software engineer intern",
    period: "June - August 2024",
    location: "Pittsburgh, Pennsylvania",
    url: "https://www.forms-surfaces.com/",
    logo: "/brands/forms-surfaces.png",
    logoAlt: "Forms+Surfaces",
    summary:
      "I built software for two kinds of expensive questions: finding manufacturing data and validating physical designs.",
    bullets: [
      "I shipped a React and Flask application that translated natural-language questions into SQL for a Made2Manage ERP database, cutting retrieval time by 40%.",
      "I automated SolidWorks design validation with Python and PyFEM simulations for thermal and environmental stress.",
      "The validation workflow accelerated production timelines by 50% and avoided about $10,000 a year in physical prototyping costs.",
    ],
    stack: ["React", "Python", "Flask", "SQL", "OpenAI API", "SolidWorks API", "PyFEM"],
  },
  {
    id: "propel-flow",
    company: "Propel Flow",
    role: "AI development engineer intern",
    period: "February - April 2024",
    location: "Remote / Hood River, Oregon",
    url: "https://www.linkedin.com/company/propel-flow/",
    monogram: "PF",
    summary:
      "I moved machine-learning work from notebooks into client-facing services and improved the retrieval layer underneath financial recommendations.",
    bullets: [
      "I deployed Python and TensorFlow inference services on AWS EC2 with Lambda-based processing, delivering an estimated $40,000 in annual client savings.",
      "I tuned GPT-4 recommendation pipelines for financial insights.",
      "I improved retrieval latency and accuracy through MongoDB and PyMongo indexing strategies.",
    ],
    stack: ["Python", "TensorFlow", "AWS EC2", "Lambda", "MongoDB", "GPT-4"],
  },
];

export const selectedWork = {
  cli: {
    title: "Test data without the ticket queue",
    body: "I built a company-wide CLI on Claude Code that provisions custom test accounts with synthetic bank accounts, cards, and identity attributes. Engineers can create realistic end-to-end scenarios on demand.",
  },
  harness: {
    title: "An authenticated path from agents to internal tools",
    body: "I developed an agent harness that connects Claude Desktop and Claude Code to protected MCP servers, handling tokenization and authentication in one reusable layer. It was adopted across the organization for debugging, code analysis, and workflow automation.",
  },
  network: {
    title: "The signal, measured while it moves",
    body: "My 5G research paired repeatable Linux experiments with a C-based live plot. That feedback loop made throughput drops and latency spikes visible during the benchmark instead of after it.",
  },
};

export const project = {
  name: "OneStopShopHousing.AI",
  period: "September 2024 - May 2025",
  url: "https://github.com/zuhayrhuseni",
  thesis:
    "One search surface for housing listings that were never designed to be compared.",
  description:
    "I built scalable scrapers that normalized listings from multiple platforms into SQLite, then added an OpenAI-backed layer that translated plain-language requests into optimized SQL. The React and Node application included authentication, favorites, comparisons, and commute-time visualization.",
  stack: ["React", "Node.js", "Express", "SQLite", "OpenAI API", "Web scraping"],
};

export const education = [
  {
    school: "Georgia Institute of Technology",
    degree: "M.S. Computer Science, machine learning specialization",
    period: "Started August 2026 / expected 2028",
    detail: "Currently pursuing OMSCS while working full time.",
    url: "https://www.omscs.gatech.edu/",
    logo: "/brands/georgia-tech.png",
  },
  {
    school: "University of Connecticut",
    degree: "B.S. Computer Science",
    period: "May 2025 / GPA 3.76",
    detail:
      "Honors Scholar and Laureate, STEM Scholar, Dean's List Engineering, Gloshoc Hackathon winner.",
    url: "https://uconn.edu/",
    logo: "/brands/uconn.jpg",
  },
];

export const coursework = [
  "Computer architecture",
  "Systems programming",
  "Algorithms and complexity",
  "Artificial intelligence",
  "Big data analytics",
  "Cyber security",
  "Principles of databases",
  "Software engineering",
];

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    skills: ["Python", "Java", "C / C++", "SQL", "JavaScript", "Bash"],
  },
  {
    id: "cloud",
    label: "Cloud + infra",
    skills: ["GCP", "AWS EC2", "AWS Lambda", "Kubernetes", "Docker", "Linux", "CI/CD"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Spring Boot", "REST microservices", "Flask", "Node.js / Express", "React"],
  },
  {
    id: "observability",
    label: "Observe + test",
    skills: ["Datadog", "Splunk", "Structured logs", "JUnit", "WireMock", "Git"],
  },
  {
    id: "data-ml",
    label: "Data + ML",
    skills: ["Oracle SQL", "MongoDB", "DynamoDB", "SQLite", "TensorFlow", "OpenAI API", "MCP servers", "Claude Code"],
  },
];

export const metrics = [
  { value: 40, suffix: "%", label: "less time retrieving ERP data" },
  { value: 50, suffix: "%", label: "faster production timelines" },
  { value: 10, prefix: "$", suffix: "k", label: "annual prototyping cost avoided" },
  { value: 40, prefix: "$", suffix: "k", label: "estimated annual client savings" },
];
