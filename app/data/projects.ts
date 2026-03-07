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
    title: "Advanced RMIT Competitive Robotics",
    description:
      "As the founder of Advanced RMIT Competitive Robotics (ARCR), I established and led an 80+ member multidisciplinary engineering team through multiple requirements-led robot design-build-test cycles. What started as a vision to create a competitive robotics program quickly grew into a comprehensive engineering initiative that operated under strict budget constraints while delivering championship-winning results.\n\n![IMAGE:/projects-images/Robotics-social_event.png]\n\nThe journey began with establishing the foundational structure of the organization. I led the team through complete design cycles, starting with CAD-based mechanical design where we produced manufacturable assemblies and technical drawings. Each robot design required careful consideration of weight limits, material selection, and manufacturability—balancing performance with the reality of our budget constraints.\n\n![IMAGE:/projects-images/Bot-CAD.png]\n\nOne of the most critical aspects of my leadership was ensuring system integration across mechanical, electrical, and software disciplines. I created comprehensive requirements documents to ensure compliance with competition specifications, establishing clear interfaces between subsystems. This systematic approach prevented integration issues that could derail entire projects.\n\nThe electronics design presented unique challenges. I designed robot electronics including power distribution systems and motor control circuits, supporting PCB development from initial schematics through layout and fabrication. These custom electronics boards were essential for reliable operation under the extreme conditions of competitive robotics competitions.\n\nTesting became a continuous cycle of iteration and refinement. I conducted iterative bench testing to validate individual components, followed by live testing in controlled environments. Each test revealed new insights that drove design improvements, gradually building system reliability through methodical failure analysis and rapid prototyping.\n\n![IMAGE:/projects-images/bot-testing.png]\n\nThe results spoke for themselves. We won competitions, secured sponsorships from industry partners, and delivered workshops to both industry professionals and high school students through STEM outreach programs. The success of the program attracted collaboration opportunities with teams from prestigious institutions including MIT, Purdue, Duke, Carnegie Mellon, and Caltech.\n\n![IMAGE:/projects-images/competition-bot.png]\n\n![IMAGE:/projects-images/networking-bots.png]\n\nThis project wasn't just about building robots—it was about building engineers. Through multiple design cycles, I guided students through the complete engineering lifecycle, from concept ideation to live competition testing. The emphasis on iterative design, failure analysis, and rapid prototyping mirrored professional engineering workflows, preparing team members for careers in industry.",
    highlights: [
      "Founded and led an 80+ member multidisciplinary engineering team through multiple design-build-test cycles",
      "Led CAD-based mechanical design, producing manufacturable assemblies and technical drawings",
      "Aimed system integration across mechanical, electrical, and software by creating requirements for competition compliance",
      "Designed robot electronics including power distribution and motor control, supporting PCB development",
      "Conducted iterative bench and live testing to validate performance and refine system reliability",
      "Won competitions, secured sponsorships, and delivered industry workshops and STEM outreach",
      "Collaborated with teams from MIT, Purdue, Duke, Carnegie Mellon, and Caltech",
      "Visit the website: https://rmitbattlebots.com/",
    ],
    image: "/projects-images/combatrobots.jpg",
    slug: "rmit-battlebots",
  },
  {
    title: "Custom ISA and CPU Datapath Design",
    description:
      "Designed and implemented an 8-bit CPU datapath capable of executing a binary search algorithm written in assembly language. Based on a custom RISC-5 inspired instruction set architecture, this CPU incorporates fundamental computer architecture components including an instruction set, datapath, control unit, and memory hierarchy to ensure full support for the target algorithm's execution.\n\nThe CPU design adopts the Harvard architecture, which separates instruction memory from data memory. This design choice allows simultaneous access to program instructions and data, improving processing efficiency and supporting fast instruction throughput during execution. The entire system was implemented and verified using Intel Quartus Prime.\n\nThe instruction set architecture is based on RISC-5 principles and includes approximately 16 different opcodes specifically designed to support binary search operations. The binary search algorithm works by maintaining left and right boundaries, calculating a middle index, and comparing the middle value with the target to determine whether to search the upper or lower half of the sorted array.\n\nThe datapath includes several key components: a program counter that acts as the heart of the system, coordinating component operations; RAM configured as 8-bit width with 10 addressable locations; a register file with 16 addresses, each 8 bits wide, for temporary memory storage; an ALU providing arithmetic and logic operations including addition, subtraction, and bit shifting (left and right), with overflow flags for comparison operations; and a control unit that interprets opcodes and generates control signals to direct the CPU's operation.\n\nThe project demonstrates the complete design cycle from ISA definition through datapath implementation to algorithm execution. The binary search algorithm was successfully simulated and verified, showing the CPU correctly locating target values within sorted arrays by iteratively narrowing the search space based on comparisons.\n\nhttps://www.youtube.com/watch?v=VAfr-Zdzpp8",
    highlights: [
      "Designed and implemented an 8-bit CPU datapath with custom RISC-5 inspired ISA",
      "Implemented Harvard architecture with separate instruction and data memory for improved efficiency",
      "Developed complete datapath components: program counter, RAM, register file (16x8), ALU, and control unit",
      "Created ALU with arithmetic operations (add, subtract) and bit shifting with overflow detection",
      "Implemented binary search algorithm in assembly language and verified execution through simulation",
      "Designed control unit to interpret opcodes and generate control signals for CPU operation",
      "Validated entire system using Intel Quartus Prime simulation and waveform analysis",
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
      "Developed a comprehensive web application utilizing AWS services, including EC2, S3, API Gateway, Lambda, and DynamoDB. The application allows users to register, log in, and manage their music subscriptions with functionalities such as querying music information, subscribing to songs, and viewing artist images.\n\n**AWS EC2**: Deployed the application on an Ubuntu Server, ensuring full functionality in a web server environment.\n\n**AWS DynamoDB**: Created and managed tables for user login and music data, implementing both through code and console.\n\n**AWS S3**: Programmatically downloaded and uploaded artist images, integrating them into the application.\n\n**Login and Registration System**: Developed a secure login and registration system validating user credentials and storing user data in DynamoDB.\n\n**API Gateway and Lambda Functions**: Implemented RESTful APIs for data operations, handling user interactions and data modifications through Lambda functions.\n\n**User Interface**: Designed intuitive web pages for user login, registration, and music subscription management, ensuring a seamless user experience.\n\nhttps://www.youtube.com/watch?v=oIH_J6MM7_o",
    highlights: [
      "Deployed application on AWS EC2 Ubuntu Server with full web server functionality",
      "Created and managed DynamoDB tables for user login and music data (code and console)",
      "Programmatically managed artist images in S3 with download and upload capabilities",
      "Developed secure login and registration system with DynamoDB user data storage",
      "Implemented RESTful APIs using API Gateway and Lambda for data operations",
      "Designed intuitive user interface for login, registration, and music subscription management",
    ],
    image: "/projects-images/aws.png",
    slug: "aws-web-application",
  },
  {
    title: "CAN Bus Communication and Control",
    description:
      "This project implements an embedded CAN communication system on an STM32F10x microcontroller. The system integrates button inputs, LED control, ADC sensing, and CAN bus messaging to demonstrate bidirectional communication between nodes on a CAN network.\n\nThe program initializes the system clock, GPIO interfaces, ADC module, timer, and CAN controller with configured message filters. Two push buttons are used to control system states: a wake-up button and a user button, each updating corresponding LEDs and broadcasting their status over the CAN bus using predefined message identifiers.\n\nOnce the system is initialized, a timer periodically triggers the transmission of ADC sensor readings over CAN. The ADC value is read from an analog input channel, packaged into a CAN message, and transmitted to other nodes on the network.\n\nThe system also supports receiving CAN messages, which are parsed and used to control external LEDs (LED8 and LED9). Incoming messages are filtered by identifier and processed to determine whether the LEDs should be turned on or off based on the received data payload.\n\nhttps://www.youtube.com/watch?v=NtcbJck8bWE",
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
