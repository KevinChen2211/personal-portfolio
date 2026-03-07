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
    title: "Tube Furnace for Silicon Oxidation Testing",
    description:
      "This was a DIY project I built in my garage to see if I could construct a functional tube furnace from scratch. I designed and built a custom tube furnace to study silicon oxidation processes by observing color changes in the oxide layer. The furnace consists of a quartz glass tube wrapped with 22AWG nichrome wire heating elements, secured with high-temperature ceramic cement, and insulated with ceramic fiber blanket. Power is controlled via a variac (variable autotransformer) to enable precise temperature ramping, while a high-temperature thermocouple monitors the process. The system is designed to heat at approximately 25 degrees per minute to prevent thermal shock and ensure uniform oxidation. Steam is introduced at one end of the tube to enhance the oxidation process, allowing me to observe how different temperatures and exposure times affect the rate and quality of silicon dioxide formation. The resulting oxide layers display distinct colors that correspond to their thickness, providing a visual method to assess oxidation progress and uniformity across the silicon wafer surface. This project demonstrates practical understanding of high-temperature materials, thermal control systems, and semiconductor processing fundamentals.\n\n![IMAGE:/projects-images/tube-furnace-setup.png]\n\nThe construction process began with selecting appropriate materials that could withstand the high temperatures required for silicon oxidation (typically 800-1200°C). The quartz glass tube serves as both the reaction chamber and a transparent window to observe the process. Quartz was chosen for its excellent thermal stability, low thermal expansion coefficient, and ability to maintain structural integrity at elevated temperatures.\n\n![IMAGE:/projects-images/nichrome-wire.png]\n\nThe nichrome wire (22AWG) was carefully wrapped around the tube in a helical pattern, ensuring even spacing to promote uniform heat distribution. High-temperature ceramic cement was applied to secure the wire in place and provide electrical insulation between adjacent turns. This cement remains stable at temperatures exceeding 1000°C and prevents the wire from shifting during thermal cycling. After securing the heating elements, approximately one meter of ceramic fiber insulation was wrapped around the entire assembly. This insulation serves multiple purposes: it improves thermal efficiency by reducing heat loss to the environment, protects the operator from burns, and helps maintain a stable temperature profile along the length of the tube. The insulation also prevents rapid cooling that could cause thermal stress fractures in the quartz tube. Temperature control is critical for successful silicon oxidation. The variac allows for smooth voltage adjustment, enabling controlled heating rates. I programmed the system to ramp at approximately 25 degrees per minute, which prevents thermal shock that could crack the silicon wafers or the quartz tube. A high-temperature K-type thermocouple positioned inside the tube provides real-time temperature feedback, allowing for precise control throughout the process.\n\n![IMAGE:/projects-images/hot_tube_furnace.png]\n\nTo enhance the oxidation process, steam is introduced at one end of the tube. The presence of water vapor significantly accelerates silicon oxidation compared to dry oxygen alone. By controlling both temperature and exposure time, I can observe how these parameters affect the oxidation rate. The resulting silicon dioxide layers exhibit characteristic colors based on their thickness due to thin-film interference effects. Thinner layers appear yellow or gold, while progressively thicker layers transition through colors including blue, purple, and eventually appearing transparent or white.\n\n![IMAGE:/projects-images/silicone-oxide-comparison.png]\n\nThis visual method provides immediate feedback on oxidation progress without requiring destructive testing. By correlating the observed colors with known oxide thickness values, I can estimate the growth rate under different conditions. This project combines materials science, thermal engineering, and semiconductor processing knowledge to create a functional research tool that demonstrates practical understanding of high-temperature systems and oxidation kinetics.",
    highlights: [
      "Designed and constructed a custom tube furnace capable of reaching 1200°C using quartz glass tube, nichrome wire heating elements, and ceramic insulation",
      "Implemented precise temperature control using a variac power supply and high-temperature thermocouple for monitoring",
      "Developed controlled heating protocol with 25°C/min ramp rate to prevent thermal shock",
      "Integrated steam injection system to enhance silicon oxidation rates",
      "Successfully observed and correlated silicon dioxide layer colors with oxidation conditions (temperature and time)",
      "Demonstrated understanding of thin-film interference effects and oxidation kinetics",
    ],
    image: "/projects-images/tube-furnace-setup.png",
    slug: "tube-furnace-silicon-oxidation",
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
