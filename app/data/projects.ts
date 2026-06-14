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
    title: "Melbourne RoboCats Mentorship",
    description: `
I mentored Melbourne RoboCats, an all-girls high-school team, on the software and electrical side of their FIRST Robotics Competition (FRC) robot. Most of the season went into getting the students comfortable with embedded programming on the NI RoboRIO using WPILib (C++), and helping them think about the robot as a control system rather than just a pile of code.

![IMAGE:/projects-images/robocats_1.jpg]

We started with the basics: how the RoboRIO, power distribution hub, motor controllers, and sensors all fit together as one system. From there we laid out a code structure that kept autonomous logic, driver control, the individual subsystems (drive, intake, shooter, climber), and shared helpers separate. The students got used to breaking the game down into features and turning those into reusable bits of code.

On the embedded side, I walked them through motor control with WPILib, including setting up CAN motor controllers, current limits, and neutral modes. We wired in encoders, gyroscopes, and limit switches so the robot could run closed-loop control and not drive its mechanisms past their limits. The students wrote the drive code, mechanism control, and the safety checks that kept everything within the rules and easy on the hardware.

![IMAGE:/projects-images/robocats_2.jpg]

Autonomous was the part everyone was most nervous about. We mapped the field out into coordinates and paths, then turned those into command sequences that mixed sensor feedback with timed moves. Dashboards and telemetry let us watch the sensor data live, track down problems, and tune things like PID gains, motion profiles, and timing.

Electrical work got just as much attention. We went through wire gauge, fuses and breakers, grounding, and keeping the CAN and sensor lines clean. The students learned to lay out tidy wiring, label everything, and actually work through problems like brownouts, dropped CAN packets, and noisy sensors instead of guessing at them.

![IMAGE:/projects-images/robocats_3.jpg]

The whole season ran on small loops: write a bit of code, test it on the robot, watch what it actually did, then fix it. That kept the robot drivable and forgiving for the drivers once competition pressure kicked in. The students also had to explain their control strategy and electrical choices to judges, which forced them to really understand their own work.

![IMAGE:/projects-images/robocats_4.jpg]

The season wasn't all in the workshop either. We made it to the Melbourne Formula 1 Grand Prix, which was a nice way to connect the precision and teamwork we were practising on the robot to engineering at the very top end of the sport.

![IMAGE:/projects-images/robocats_5.jpg]

By the end, the RoboCats were adding to the codebase on their own, safely changing the electrical system, and using telemetry to debug and improve the robot without me hovering over them. They walked away with a competitive FRC robot and some real experience in embedded systems, control, and working as a team against a deadline.

![IMAGE:/projects-images/robocats_6.jpg]
`.trim(),
    highlights: [
      "Mentored an all-girls high-school FRC team (Melbourne RoboCats) in embedded software and electrical systems",
      "Developed a structured control-system architecture on NI RoboRIO using WPILib (C++)",
      "Implemented real-time motor control using CAN-based motor controllers with encoder and gyro feedback",
      "Integrated sensors (encoders, gyroscopes, limit switches) for autonomous and tele-operated control",
      "Guided safe electrical system design including power distribution, breakers, wiring layout, and signal integrity",
      "Taught students to use telemetry and dashboards for debugging, tuning, and performance analysis",
      "Attended the Melbourne Formula 1 Grand Prix as part of the broader mentorship experience",
      "Enabled students to independently extend the robot codebase and confidently modify electrical systems",
    ],
    image: "/projects-images/robocats_1.jpg",
    slug: "robocats-frc",
  },
  {
    title: "Advanced RMIT Competitive Robotics",
    description: `
I founded Advanced RMIT Competitive Robotics (ARCR) and grew it into a team of more than 80 students across mechanical, electrical, and software. We ran full design-build-test cycles on a tight budget, and the robots we built went on to win competitions.

![IMAGE:/projects-images/Robotics-social_event.png]

Getting the club off the ground meant first figuring out how it would actually run day to day. I took the team through complete design cycles, starting with CAD work that produced parts we could really manufacture and proper technical drawings. Every robot had to balance weight limits, material choices, and what we could realistically build with the money we had.

![IMAGE:/projects-images/Bot-CAD.png]

A big part of leading the team was making sure the mechanical, electrical, and software work all fit together. I wrote up the requirements so everything stayed within the competition rules and the subsystems had clear interfaces, which saved us from the kind of integration headaches that can sink an entire build.

The electronics were their own challenge. I designed the robot electronics, including power distribution and motor control circuits, and helped take PCBs from schematic through layout and fabrication. Custom boards were really the only way to get reliable behaviour under the beating these robots take in competition.

Testing was a constant loop. We bench-tested individual parts, then ran live tests in a controlled setup. Every test taught us something and fed straight back into the next revision, so reliability built up gradually through failure analysis and a lot of prototyping.

![IMAGE:/projects-images/bot-testing.png]

It paid off. We won competitions, brought in sponsors, and ran workshops for both industry people and high-school students through STEM outreach. The club's profile also opened doors to teams from MIT, Purdue, Duke, Carnegie Mellon, and Caltech.

![IMAGE:/projects-images/competition-bot.png]

![IMAGE:/projects-images/networking-bots.png]

As ARCR grew, I was invited onto SYN radio to talk about the club: the engineering we were doing, the competitions we were entering, and the hands-on culture we were trying to build for students who wanted more than classroom robotics.

Near the end of my degree I also pushed to get the club officially recognised by the university and to bring on a dedicated academic advisor. That backing mattered for the long run, since it gave future cohorts a clearer path to resources and mentorship as the leadership changed hands each year.

In the end the club was about building engineers, not just robots. Running multiple design cycles took students from a rough idea all the way to live competition, and the focus on iteration, failure analysis, and prototyping lined up closely with how engineering actually works in industry.
`.trim(),
    highlights: [
      "Founded and led an 80+ member multidisciplinary engineering team through multiple design-build-test cycles",
      "Led CAD-based mechanical design, producing manufacturable assemblies and technical drawings",
      "Aimed system integration across mechanical, electrical, and software by creating requirements for competition compliance",
      "Designed robot electronics including power distribution and motor control, supporting PCB development",
      "Conducted iterative bench and live testing to validate performance and refine system reliability",
      "Won competitions, secured sponsorships, and delivered industry workshops and STEM outreach",
      "Collaborated with teams from MIT, Purdue, Duke, Carnegie Mellon, and Caltech",
      "Featured on SYN FM to discuss the club, its engineering work, and its impact on students",
      "Advocated for official university recognition and a dedicated academic advisor for long-term club sustainability",
      "Visit the website: https://rmitbattlebots.com/",
    ],
    image: "/projects-images/combatrobots.jpg",
    slug: "rmit-battlebots",
  },
  {
    title: "Custom ISA and CPU Datapath Design",
    description: `
I designed and built an 8-bit CPU datapath that can run a binary search algorithm written in assembly. It uses a custom, RISC-5 inspired instruction set, and includes all the usual pieces you need to actually execute a program: an instruction set, a datapath, a control unit, and a memory hierarchy.

The CPU uses a Harvard architecture, so instruction memory and data memory are kept separate. That lets it fetch an instruction and access data at the same time, which keeps the throughput up during execution. I built and verified the whole thing in Intel Quartus Prime.

The instruction set has around 16 opcodes, picked specifically to support binary search. The algorithm keeps a left and right boundary, works out the middle index, and compares the middle value against the target to decide which half of the sorted array to look in next.

The datapath is made up of a few main parts: a program counter that coordinates everything, RAM that's 8 bits wide with 10 addressable locations, a register file with 16 addresses of 8 bits each for temporary storage, an ALU that handles addition, subtraction, and left/right bit shifts (with overflow flags for comparisons), and a control unit that reads each opcode and produces the control signals that drive the rest of the CPU.

The project covers the full cycle, from defining the ISA to building the datapath to running the algorithm on it. The binary search ran correctly in simulation, narrowing the search space comparison by comparison until it landed on the target value in the sorted array.

https://www.youtube.com/watch?v=VAfr-Zdzpp8
`.trim(),
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
    description: `
This was a garage project I took on just to see if I could build a working tube furnace from scratch and use it to study silicon oxidation by watching the colour of the oxide layer change. The furnace is a quartz glass tube wrapped in 22AWG nichrome heating wire, held in place with high-temperature ceramic cement and wrapped in ceramic fibre blanket for insulation. A variac (variable autotransformer) controls the power so I can ramp the temperature smoothly, and a high-temperature thermocouple keeps an eye on the process. I run it at roughly 25 degrees per minute so nothing gets thermally shocked and the oxidation stays even. Feeding steam in at one end speeds the oxidation up, which lets me see how temperature and time change the rate and quality of the silicon dioxide that forms. The oxide layers come out in different colours depending on their thickness, so I get a quick visual read on how the oxidation is going across the wafer.

![IMAGE:/projects-images/tube-furnace-setup.png]

I started by picking materials that could actually survive the temperatures silicon oxidation needs (usually 800-1200°C). The quartz tube does double duty as the reaction chamber and a window to watch what's happening inside. I went with quartz because it handles heat well, barely expands, and holds its shape at high temperatures.

![IMAGE:/projects-images/nichrome-wire.png]

I wound the 22AWG nichrome wire around the tube in an even helix so the heat would spread evenly, then locked it down with high-temperature ceramic cement, which also keeps the turns electrically separated. The cement holds up past 1000°C and stops the wire shifting as things heat up and cool down. After that I wrapped about a metre of ceramic fibre insulation around the whole assembly. That keeps the heat in, protects me from burns, and holds a steady temperature along the tube. It also stops the tube cooling so fast that it cracks. Temperature control is the part that really makes or breaks the process. The variac lets me adjust the voltage smoothly for a controlled ramp, and I keep it at around 25 degrees per minute so neither the wafers nor the quartz tube crack from thermal shock. A K-type thermocouple sitting inside the tube gives me live temperature feedback the whole way through.

![IMAGE:/projects-images/hot_tube_furnace.png]

To push the oxidation along, I introduce steam at one end of the tube. The water vapour speeds silicon oxidation up a lot compared to dry oxygen on its own. By changing the temperature and how long I leave it, I can watch how each one affects the oxidation rate. The silicon dioxide layers end up with their own colours depending on thickness, thanks to thin-film interference. Thin layers look yellow or gold, and as they get thicker they move through blue and purple before going more or less transparent or white.

![IMAGE:/projects-images/silicone-oxide-comparison.png]

That gives me instant feedback on how the oxidation is going without having to destroy the sample to measure it. By matching the colours I see against known oxide thicknesses, I can estimate the growth rate under different conditions. It ended up being a genuinely useful little research tool, and it pulled together materials science, thermal engineering, and a bit of semiconductor processing into one build.
`.trim(),
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
    description: `
I built a music subscription web app on top of a handful of AWS services: EC2, S3, API Gateway, Lambda, and DynamoDB. Users can register, log in, and manage their subscriptions, look up music info, subscribe to songs, and see artist images.

**AWS EC2**: Hosted the app on an Ubuntu server and got it running as a proper web server.

**AWS DynamoDB**: Set up and managed the tables for user logins and music data, both through code and the console.

**AWS S3**: Pulled artist images down and pushed them back up programmatically, then wired them into the app.

**Login and registration**: Built a login and registration flow that checks user credentials and stores the user data in DynamoDB.

**API Gateway and Lambda**: Wrote REST APIs for the data operations, with Lambda functions handling the user actions and updates behind them.

**User interface**: Put together the pages for login, registration, and managing subscriptions, and kept the flow simple to move through.

https://www.youtube.com/watch?v=oIH_J6MM7_o
`.trim(),
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
    description: `
This is an embedded CAN communication system running on an STM32F10x microcontroller. It ties together button inputs, LED control, ADC sensing, and CAN messaging to show two nodes talking back and forth over a CAN network.

On startup the program sets up the system clock, GPIO, ADC, a timer, and the CAN controller with its message filters. Two push buttons drive the state: a wake-up button and a user button, each one updating its LED and broadcasting its status over CAN using fixed message IDs.

Once it's up and running, a timer periodically fires off the ADC readings over CAN. It reads the value from an analog input, packs it into a CAN message, and sends it out to the other nodes on the network.

It also receives CAN messages and uses them to control two external LEDs (LED8 and LED9). Incoming messages are filtered by ID, and the payload decides whether each LED turns on or off.

https://www.youtube.com/watch?v=NtcbJck8bWE
`.trim(),
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
    description: `
I built a cross-platform mobile app that delivers guided meditation content, working closely with the client from start to finish.
`.trim(),
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
