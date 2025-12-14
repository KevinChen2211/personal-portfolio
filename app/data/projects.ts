export interface Project {
  title: string;
  description: string;
  highlights: string[];
  icon?: string;
}

export const projects: Project[] = [
  {
    title: "RMIT BattleBots",
    description:
      "Leading a competitive robotics club focused on combat robotics design, engineering, and competition. Organized workshops, competitions, and industry partnerships.",
    highlights: [
      "Led 80+ students through 4 robot design cycles",
      "Won state competitions and secured additional funding",
      "Organized weekly workshops across mechanical, electrical, and software disciplines",
      "Delivered STEM workshops to high schools in collaboration with RMIT and I Belong",
      "Initiated sponsorships and organized club events",
      "Organized networking events with industry professionals",
    ],
    icon: "🤖",
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
    icon: "⚙️",
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
    icon: "🔬",
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
    icon: "☁️",
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
    icon: "🚗",
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
    icon: "🧘",
  },
];
