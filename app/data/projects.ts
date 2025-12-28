export interface Project {
  title: string;
  description: string;
  highlights: string[];
  icon?: string;
  image?: string;
  slug: string;
}

export const projects: Project[] = [
  {
    title: "Advanced RMIT Combat-Robotics",
    description:
      "The Advanced RMIT Combat Robotics initiative represents a student-led, competition-driven engineering program focused on the end-to-end design, \
      construction, and operation of combat robots. Over multiple design cycles, the club guided students through the complete engineering lifecycle, \
      from concept ideation and CAD modelling to manufacturing, electronics integration, software development, and live competition testing. Emphasis \
      was placed on iterative design, failure analysis, and rapid prototyping, mirroring professional engineering workflows.",
    highlights: [
      "Led 80+ students through 4 robot design cycles",
      "Won state competitions and secured additional funding",
      "Organized weekly workshops across mechanical, electrical, and software disciplines",
      "Delivered STEM workshops to high schools in collaboration with RMIT and I Belong",
      "Initiated sponsorships and organized club events",
      "Organized networking events with industry professionals",
      "Visit the website: https://rmitbattlebots.com/",
    ],
    image: "/projects-images/combatrobots.jpg",
    slug: "rmit-battlebots",
  },
  {
    title: "Custom ISA and CPU Datapath Design",
    description:
      "Designed and implemented a complete custom Instruction Set Architecture and CPU datapath from the ground up, demonstrating deep understanding of computer architecture fundamentals.",
    highlights: [
      "Designed a custom Instruction Set Architecture (ISA) from custom logic gates for a computational application",
      "Architected and implemented a CPU Datapath in Intel Quartus Prime (Fetch, Decode, Execute, Memory, Write-back)",
      "Optimized instruction pipeline for performance and efficiency",
      "Validated design through comprehensive simulation and testing",
    ],
    image: "/projects-images/custom-cpu.png",
    slug: "custom-cpu",
  },
  {
    title: "DIY Semiconductors",
    description:
      "Starting Research and implementation into accessible semiconductor fabrication using DIY approaches.",
    highlights: [
      "Started work on maskless photolithography and semiconductor fabrication using DIY approaches",
      "Research etching, doping, and deposition processes using consumer-grade tools while prioritizing accuracy",
      "Exploring innovative approaches to reduce cost barriers in semiconductor manufacturing",
    ],
    image: "/projects-images/semiconductor.jpg",
    slug: "diy-semiconductors",
  },
  {
    title: "AWS Web Application",
    description:
      "Built a scalable, serverless web application leveraging AWS services to enable user registration, subscription management, and content delivery for artists.",
    highlights: [
      "Full stack serverless app using EC2, S3, Lambda, DynamoDB, and API Gateway",
      "Enables users to register, manage subscriptions, and access artist content",
      "Implemented secure authentication and authorization",
      "Designed scalable architecture to handle growing user base",
      "Optimized costs through efficient use of AWS serverless services",
    ],
    image: "/projects-images/aws.png",
    slug: "aws-web-application",
  },
  {
    title: "CAN Bus Communication and Control",
    description:
      "Developed embedded firmware for automotive communication protocols, implementing CAN bus messaging and I/O sampling on STM32 microcontrollers.",
    highlights: [
      "Developed firmware for STM32F107 microcontroller to handle CAN bus messaging and I/O sampling",
      "Implemented real-time data processing and communication protocols",
      "Designed robust error handling and message filtering systems",
      "Optimized for low-latency communication in automotive applications",
    ],
    image: "/projects-images/can_bus.png",
    slug: "can-bus",
  },
  {
    title: "Yoga and Meditation App",
    description:
      "Built a cross-platform mobile application for delivering guided meditation content, collaborating closely with clients using modern development practices.",
    highlights: [
      "For a client built a cross-platform React Native app to deliver guided meditation content and user profile management",
      "Collaborated with client using Figma and agile sprints",
      "Implemented user authentication, profile management, and content streaming",
      "Delivered polished UI/UX with smooth animations and intuitive navigation",
      "Ensured cross-platform compatibility for iOS and Android",
    ],
    image: "/projects-images/yoga.png",
    slug: "yoga-meditation-app",
  },
];
