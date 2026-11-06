/**
 * KIIT Event Management Platform
 * Master Event Dataset & Metadata
 * Contains curated events, dynamic countdown dates, high-resolution imagery, and venue details.
 */

// Helper to compute dynamic upcoming dates so countdowns are always live
function getFutureDate(daysAhead, hours = 10, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatDate(dateObj) {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
}

function formatTime(dateObj) {
  return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export const CATEGORIES = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'tech', label: 'Tech & AI', icon: '💻' },
  { id: 'cultural', label: 'Culture & Arts', icon: '🎭' },
  { id: 'music', label: 'Music & Concerts', icon: '🎵' },
  { id: 'workshops', label: 'Workshops', icon: '🎓' },
  { id: 'gaming', label: 'Gaming & Esports', icon: '🎮' },
  { id: 'sports', label: 'Sports League', icon: '🏆' }
];

export const CAMPUS_ZONES = [
  { id: 'all', name: 'All Campuses', label: '28+ Campuses' },
  { id: 'campus-6', name: 'Campus 6', label: 'Auditorium & Tech Complex' },
  { id: 'campus-13', name: 'Campus 13', label: 'Stadium & Sports Grounds' },
  { id: 'campus-7', name: 'Campus 7', label: 'Chintan Convention Hall' },
  { id: 'campus-11', name: 'Campus 11', label: 'TBI Innovation Incubator' },
  { id: 'campus-15', name: 'Campus 15', label: 'Open Amphitheatre' }
];

export const EVENTS_DATA = [
  {
    id: 'kiit-hacksprint-2026',
    title: 'HackSprint X: 36-Hour National Hackathon',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    campusZone: 'campus-6',
    featured: true,
    targetDate: getFutureDate(11, 9, 30),
    timeRange: '09:30 AM - 09:30 PM (36 Hrs)',
    venue: 'Campus 6 Auditorium & Central Computing Lab, KIIT',
    locationShort: 'Campus 6, KIIT',
    price: 'Free',
    isFree: true,
    capacity: 400,
    registeredCount: 342,
    badge: 'Flagship Event',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Unleash your coding powers in Eastern India\'s largest 36-hour hackathon tackling Generative AI, Web3, and HealthTech.',
    fullDescription: 'HackSprint X is KIIT University\'s premier national collegiate hackathon. Over 36 hours of non-stop innovation, student builders, designers, and software engineers collaborate to build production-grade solutions. Backed by industry mentors from Google, Microsoft, and premier tech startups, teams get 24/7 technical guidance, high-speed fiber internet, compute credits, and free meals.',
    highlights: [
      '₹3,50,000 Total Prize Pool + $25,000 Cloud Credits',
      'Direct Fast-Track Internship Interviews with Tech Leaders',
      'Complimentary Swag Bags, RedBull, & Midnight Snacks',
      'Mentorship from Senior Silicon Valley Engineers'
    ],
    schedule: [
      { time: 'Day 1 - 09:30 AM', activity: 'Registration & Keynote Opening Address' },
      { time: 'Day 1 - 11:00 AM', activity: 'Hacking Commences & Problem Tracks Revealed' },
      { time: 'Day 1 - 04:00 PM', activity: 'Checkpoint 1: Architecture & Mentorship' },
      { time: 'Day 2 - 12:00 AM', activity: 'Midnight Mystery Mini-Game Challenge' },
      { time: 'Day 2 - 09:00 AM', activity: 'Code Freeze & GitHub Submissions' },
      { time: 'Day 2 - 02:00 PM', activity: 'Grand Jury Pitches & Award Ceremony' }
    ],
    speakers: [
      { name: 'Dr. Arjun Sen', role: 'Head of AI Research, DeepScale', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rhea Patel', role: 'Staff Engineer, Google Cloud', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all college students (Undergraduate & Postgraduate). Teams of 2 to 4 members.'
  },
  {
    id: 'kalliope-fest-2026',
    title: 'Kalliope ’26: Annual Inter-University Cultural Fest',
    category: 'cultural',
    categoryLabel: 'Culture & Arts',
    campusZone: 'campus-13',
    featured: true,
    targetDate: getFutureDate(24, 17, 0),
    timeRange: '05:00 PM - 11:30 PM (3 Days)',
    venue: 'Central Stadium Grounds, Campus 13',
    locationShort: 'Stadium Grounds, Campus 13',
    price: '₹299',
    isFree: false,
    capacity: 3000,
    registeredCount: 2450,
    badge: 'Selling Fast',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The grandest cultural carnival with celebrity musical concerts, theatrical battles, runway fashion shows, and art galas.',
    fullDescription: 'Kalliope is KIIT\'s celebrated annual cultural festival, attracting over 20,000 attendees from across 70+ universities nationwide. Featuring 3 magical evenings with star headliners, national dance crew face-offs, runway fashion showcases, gourmet food zones, and interactive street art installations.',
    highlights: [
      'Headline Concert by Renowned Bollywood & Indie Rock Stars',
      'National Inter-College Choreography & Dance Battles',
      'Illuminated Art Pavilions & Lantern Light Installations',
      'Over 50 Curated Food & Lifestyle Stalls'
    ],
    schedule: [
      { time: 'Day 1 - 05:00 PM', activity: 'Opening Ceremony & Classical Fusion Night' },
      { time: 'Day 2 - 06:00 PM', activity: 'Vogue Runway Fashion Showcase' },
      { time: 'Day 3 - 07:00 PM', activity: 'Mega Star Night Live Concert & Drone Show' }
    ],
    speakers: [
      { name: 'Aditi Varma', role: 'Celebrity Choreographer & Judge', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kabir Roy', role: 'Music Producer & Indie Artist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all valid university students, faculty, and alumni with valid ID.'
  },
  {
    id: 'ai-robotics-summit',
    title: 'NextGen AI & Autonomous Robotics Conclave',
    category: 'workshops',
    categoryLabel: 'Workshops',
    campusZone: 'campus-7',
    featured: true,
    targetDate: getFutureDate(7, 10, 0),
    timeRange: '10:00 AM - 05:00 PM',
    venue: 'Chintan Convention Hall, Campus 7',
    locationShort: 'Convention Hall, Campus 7',
    price: 'Free',
    isFree: true,
    capacity: 250,
    registeredCount: 228,
    badge: 'Almost Full',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Hands-on immersion with quadruped robots, drone swarms, and cutting-edge Edge AI computer vision pipelines.',
    fullDescription: 'Explore the frontiers of embodied artificial intelligence! Experience live demonstrations of quadruped robot dogs, indoor autonomous drone swarms, and edge-deployed multimodal AI models running on NVIDIA Jetson architectures. Includes interactive breakout labs and panel discussions with leading roboticists.',
    highlights: [
      'Live Quadruped & Autonomous Drone Arena Demonstrations',
      'Hands-on Lab with Jetson Orin & OpenCV Vision Models',
      'Networking Buffet Lunch with Robotics Startup Founders',
      'Certificate of Advanced Robotics Competency'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Keynote: The Horizon of Embodied Intelligence' },
      { time: '11:45 AM', activity: 'Hands-on Lab: ROS 2 & Vision Foundation Models' },
      { time: '01:00 PM', activity: 'Networking Buffet Lunch' },
      { time: '02:30 PM', activity: 'Drone Racing & Autonomous Navigation Demo' },
      { time: '04:15 PM', activity: 'Panel Discussion & Q&A' }
    ],
    speakers: [
      { name: 'Dr. Vikram Chandra', role: 'Chief Scientist, RoboDynamics Lab', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all engineering, science, and computing enthusiasts.'
  },
  {
    id: 'electropulse-music-fest',
    title: 'ElectroPulse: Neon EDM & Bass Festival',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    campusZone: 'campus-15',
    featured: false,
    targetDate: getFutureDate(17, 18, 30),
    timeRange: '06:30 PM - 11:30 PM',
    venue: 'Open Air Amphitheatre, Campus 15',
    locationShort: 'Amphitheatre, Campus 15',
    price: '₹199',
    isFree: false,
    capacity: 1500,
    registeredCount: 1120,
    badge: 'High Energy',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'An exhilarating sonic journey featuring dual DJ stages, synchronized laser lighting, and heavy synth wave beats.',
    fullDescription: 'Get ready to jump and glow! ElectroPulse unites top collegiate DJs and guest headliners for a night of progressive house, trap, synthwave, and drum & bass. Free neon body paint, glow bands, and immersive visual projections turn Campus 15 into a luminous festival paradise.',
    highlights: [
      '40,000-Watt Line-Array Sound & Synchronized Laser Rig',
      'Complimentary Neon Glow Bands & Festival Face Glitter',
      'Multi-DJ Battle with Audience Voting & Live Visuals',
      'Luminous Chill Out Lounge & Mocktail Bar'
    ],
    schedule: [
      { time: '06:30 PM', activity: 'Gates Open & Ambient DJ Warm-up' },
      { time: '07:30 PM', activity: 'Bass House & Electro Set' },
      { time: '09:00 PM', activity: 'Headline DJ Neon Rave & Pyrotechnic Finale' }
    ],
    speakers: [
      { name: 'DJ Zeddrix', role: 'Headliner & Resident Fest Artist', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'All students with valid university registration passes.'
  },
  {
    id: 'esports-arena-battle',
    title: 'Campus Valorant & BGMI Esports Championship',
    category: 'gaming',
    categoryLabel: 'Gaming & Esports',
    campusZone: 'campus-13',
    featured: true,
    targetDate: getFutureDate(5, 11, 0),
    timeRange: '11:00 AM - 08:30 PM',
    venue: 'Indoor Sports Complex & Esports Arena, Campus 12',
    locationShort: 'Esports Arena, Campus 12',
    price: 'Free',
    isFree: true,
    capacity: 200,
    registeredCount: 184,
    badge: 'Starting Soon',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Compete on 240Hz tournament rigs in the ultimate collegiate tactical shooter and battle royale showdown.',
    fullDescription: 'The biggest competitive gaming tournament of the semester! 32 Valorant squads and 24 BGMI teams clash for the championship trophy. Broadcasted live with professional shoutcasters on YouTube and Twitch with spectator arena seating and immersive game audio.',
    highlights: [
      'Tournament-Grade 240Hz Gaming Rigs & Mechanical Peripherals',
      '₹1,00,000 Total Prize Pool + Gaming Hardware Goodies',
      'Live Shoutcasting & Giant LED Spectator Arena',
      '1v1 Aim Challenge Booths with Instant Prizes'
    ],
    schedule: [
      { time: '11:00 AM', activity: 'Bracket Seeding & Team Check-ins' },
      { time: '01:00 PM', activity: 'Quarter-Finals & Semi-Finals' },
      { time: '05:30 PM', activity: 'Grand Finals Bo5 (Best of 5) Live Showdown' }
    ],
    speakers: [
      { name: 'Kunal "Apex" Das', role: 'Official Esports Shoutcaster', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Teams of 5 players for Valorant; Squad of 4 for BGMI.'
  },
  {
    id: 'kiit-cricket-championship',
    title: 'KPL 2026: Floodlight Cricket League Finals',
    category: 'sports',
    categoryLabel: 'Sports League',
    campusZone: 'campus-13',
    featured: false,
    targetDate: getFutureDate(14, 16, 0),
    timeRange: '04:00 PM - 10:30 PM',
    venue: 'Cricket Stadium, KIIT Campus 13',
    locationShort: 'Cricket Stadium, Campus 13',
    price: 'Free',
    isFree: true,
    capacity: 2000,
    registeredCount: 1680,
    badge: 'Championship Finals',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Witness the intense clash between the top collegiate teams in the high-stakes T-10 floodlight cricket championship.',
    fullDescription: 'The pinnacle of the campus sports calendar! Experience the highest-scoring cricket final under high-power floodlights with cheer squads, DJ commentary, live giant-screen slow-mo replays, and man-of-the-match awards presented by Indian sports icons.',
    highlights: [
      'Full Floodlit T-10 Super League Climax',
      'Live DJ Commentary & Boundary Cheers',
      'Trophy Presentation by Ranji Trophy Captain',
      'Free Spectator Flags & Energy Drinks'
    ],
    schedule: [
      { time: '04:00 PM', activity: 'Toss & National Anthem' },
      { time: '04:30 PM', activity: 'First Innings (10 Overs of Action)' },
      { time: '06:00 PM', activity: 'Second Innings Chase & Super Over (if tied)' },
      { time: '07:30 PM', activity: 'Trophy & Gold Medal Presentation' }
    ],
    speakers: [
      { name: 'Sourav Mohanty', role: 'State Cricket Coach & Former Captain', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Spectator passes open to all students, faculty, and guests.'
  },
  {
    id: 'web3-cloud-masterclass',
    title: 'Web3 & Cloud Architectures Masterclass',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    campusZone: 'campus-6',
    featured: false,
    targetDate: getFutureDate(3, 14, 0),
    timeRange: '02:00 PM - 06:00 PM',
    venue: 'Auditorium Hall B, School of Computer Engineering',
    locationShort: 'Auditorium Hall B, Campus 15',
    price: 'Free',
    isFree: true,
    capacity: 200,
    registeredCount: 185,
    badge: 'Starting in 3 Days',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A deep-dive workshop on building scalable serverless backends and writing secure Solidity smart contracts.',
    fullDescription: 'Master how modern web apps bridge cloud scalability with decentralized networks. You will build, test, and deploy a decentralized file-sharing vault utilizing serverless edge functions, IPFS, and Ethereum smart contracts with live code reviews.',
    highlights: [
      'Deploy Smart Contracts Live on Sepolia Testnet',
      'Free Serverless Cloud Tier Credits & Domain Vouchers',
      'Hands-on Code Walkthroughs with GitHub Repositories',
      'Verified Digital Blockchain Credential'
    ],
    schedule: [
      { time: '02:00 PM', activity: 'Modern Web Architecture: Cloud vs Decentralization' },
      { time: '03:15 PM', activity: 'Building REST & GraphQL APIs with Edge Workers' },
      { time: '04:30 PM', activity: 'Smart Contract Deployment & Security Auditing' },
      { time: '05:30 PM', activity: 'Q&A & Certificate Distribution' }
    ],
    speakers: [
      { name: 'Pooja Nair', role: 'Cloud Solutions Architect', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Familiarity with basic JavaScript or Python is recommended.'
  },
  {
    id: 'designverse-uiux-sprint',
    title: 'DesignVerse: UI/UX & Design Systems Sprint',
    category: 'workshops',
    categoryLabel: 'Workshops',
    campusZone: 'campus-6',
    featured: false,
    targetDate: getFutureDate(6, 10, 0),
    timeRange: '10:00 AM - 04:30 PM',
    venue: 'Design Studio Lab 3, Campus 17',
    locationShort: 'Design Studio, Campus 17',
    price: '₹99',
    isFree: false,
    capacity: 140,
    registeredCount: 118,
    badge: 'Interactive Lab',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Learn Figma component architecture, micro-interactions, and design tokens used by world-class product teams.',
    fullDescription: 'Step up your design game from wireframes to enterprise design systems. Master auto-layout, token variables, accessible color contrasts, and prototype interactive micro-animations that impress tech recruiters and product leads.',
    highlights: [
      'Production Figma UI Design Kit Included Free',
      '1-on-1 Portfolio Reviews with Senior Product Designers',
      'Figma Community Badge & Certificate of Excellence',
      'UI Redesign Challenge with Exciting Goodies'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Design Thinking & Information Architecture' },
      { time: '11:30 AM', activity: 'Figma Auto-Layout & Design Tokens Mastery' },
      { time: '01:30 PM', activity: 'Interactive Micro-interactions & Motion Design' },
      { time: '03:00 PM', activity: 'Live Portfolio Critique & Feedback' }
    ],
    speakers: [
      { name: 'Tanmay Saxena', role: 'Lead Product Designer, Fintech Co.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to UI/UX designers, developers, and aspiring product creators.'
  },
  {
    id: 'chaar-chinar-film-expo',
    title: 'Chaar-Chinar: National Student Film & Photo Expo',
    category: 'cultural',
    categoryLabel: 'Culture & Arts',
    campusZone: 'campus-6',
    featured: false,
    targetDate: getFutureDate(28, 11, 30),
    timeRange: '11:30 AM - 07:00 PM',
    venue: 'Convention Centre Gallery, Campus 6',
    locationShort: 'Gallery Hall, Campus 6',
    price: 'Free',
    isFree: true,
    capacity: 450,
    registeredCount: 320,
    badge: 'Art Exhibition',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A celebration of visual storytelling featuring short film premieres, documentary screenings, and photography galleries.',
    fullDescription: 'Immerse yourself in cinematic creativity! Browse curated photography prints from 120+ student photographers across India, followed by screenings of award-winning student short films with director Q&A sessions and filmmaking workshops.',
    highlights: [
      'Screening of 15 Selected Short Documentaries',
      'Gallery of 200+ Framed Fine Art Photographs',
      'Fireside Chat with Indie Film Directors',
      'People’s Choice Award for Best Visual Storytelling'
    ],
    schedule: [
      { time: '11:30 AM', activity: 'Gallery Exhibition Ribbon Cutting' },
      { time: '02:00 PM', activity: 'Short Film Screening Block A' },
      { time: '04:30 PM', activity: 'Panel: Storytelling with Minimal Gear' },
      { time: '06:00 PM', activity: 'Best Director & Photo Awards' }
    ],
    speakers: [
      { name: 'Maya Sengupta', role: 'National Award-Winning Documentarian', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all film lovers, photographers, and creatives.'
  },
  {
    id: 'founders-crucible-summit',
    title: 'Founder\'s Crucible: Startup Pitch & Seed Summit',
    category: 'workshops',
    categoryLabel: 'Workshops',
    campusZone: 'campus-11',
    featured: false,
    targetDate: getFutureDate(20, 10, 30),
    timeRange: '10:30 AM - 05:00 PM',
    venue: 'TBI Auditorium (Technology Business Incubator), Campus 11',
    locationShort: 'TBI Hall, Campus 11',
    price: 'Free',
    isFree: true,
    capacity: 280,
    registeredCount: 245,
    badge: 'Seed Grants',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Pitch your breakthrough venture to angel investors, venture capitalists, and university incubator directors.',
    fullDescription: 'Got an audacious idea? Pitch directly to seasoned angel syndicates and startup mentors. Selected ventures will receive equity-free incubation grants, cloud infrastructure support, legal advisory, and desk space at KIIT-TBI.',
    highlights: [
      'Up to ₹15 Lakhs in Non-Dilutive Seed Grants',
      'Networking with 20+ Active Angel Investors & VCs',
      '1-on-1 Legal & IP Protection Clinic',
      'Complimentary Founder Lunch & Mixer'
    ],
    schedule: [
      { time: '10:30 AM', activity: 'Keynote: Zero to Product-Market Fit' },
      { time: '11:30 AM', activity: 'Cohort Pitching Rounds (3 min pitch + 2 min Q&A)' },
      { time: '02:00 PM', activity: 'Angel Investor Fireside Chat' },
      { time: '04:00 PM', activity: 'Grant Winners Announcement' }
    ],
    speakers: [
      { name: 'Raghav Khanna', role: 'Partner, Horizon Ventures', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Student founders and early-stage startup teams.'
  },
  {
    id: 'acoustic-sunset-unplugged',
    title: 'Acoustic Sunset: Poetry & Open Mic Unplugged',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    campusZone: 'campus-15',
    featured: false,
    targetDate: getFutureDate(8, 17, 30),
    timeRange: '05:30 PM - 09:00 PM',
    venue: 'KIMS Lakeside Lawn, Campus 5',
    locationShort: 'Lakeside Lawn, Campus 5',
    price: 'Free',
    isFree: true,
    capacity: 350,
    registeredCount: 310,
    badge: 'Cozy Evening',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'An intimate evening of soothing acoustic guitars, spoken word poetry, and storytelling under fairy lights.',
    fullDescription: 'Escape the hustle and enjoy a golden-hour acoustic session. Settle in on beanbags and lawn mats beside the lake as student vocalists, poets, and instrumentalists share raw, unplugged performances under warm fairy lights.',
    highlights: [
      'Fairy-Lit Lakeside Seating with Hot Chai & Cookies',
      'Open Mic Slots Available for Spontaneous Performers',
      'Live Percussion & Acoustic Jam Session',
      'Handcrafted Souvenir Bookmarks'
    ],
    schedule: [
      { time: '05:30 PM', activity: 'Sunset Acoustic Guitar Solos' },
      { time: '06:30 PM', activity: 'Spoken Word Poetry & Stories' },
      { time: '07:45 PM', activity: 'Folk & Indie Ensemble Jam' }
    ],
    speakers: [
      { name: 'Simran Sethi', role: 'Slam Poetry Champion', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to everyone seeking art, relaxation, and music.'
  },
  {
    id: 'robowar-mech-arena',
    title: 'RoboWars 2026: Heavyweight Combat Arena',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    campusZone: 'campus-6',
    featured: false,
    targetDate: getFutureDate(10, 13, 0),
    timeRange: '01:00 PM - 07:00 PM',
    venue: 'Automobile Engineering Workshop Arena, Campus 8',
    locationShort: 'Mech Arena, Campus 8',
    price: 'Free',
    isFree: true,
    capacity: 650,
    registeredCount: 570,
    badge: 'High Action',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    shortDescription: '15kg and 30kg custom combat robots battle it out in a reinforced Lexan arena with spinning blades and flippers.',
    fullDescription: 'Metal meets metal in the most adrenaline-pumping collegiate robotics clash! Teams engineer custom remote-controlled combat bots fitted with spinning drums, pneumatic flippers, and titanium wedge armor. Sparks fly as bots fight to immobilize their opponents.',
    highlights: [
      'Full Bullet-Proof Polycarbonate Combat Cage',
      '15kg Featherweight & 30kg Middleweight Categories',
      'Pit Crew Repair Bays with Welding & Electronics Stations',
      '₹1,50,000 Cash Pool for Top Combat Engineers'
    ],
    schedule: [
      { time: '01:00 PM', activity: 'Safety Inspections & Weapon Weigh-in' },
      { time: '02:00 PM', activity: 'Round of 16 Knockouts' },
      { time: '04:30 PM', activity: 'Semi-Finals & Pit Repairs' },
      { time: '06:00 PM', activity: 'Grand Combat Final & Rumble' }
    ],
    speakers: [
      { name: 'Prof. Debashis Panda', role: 'Faculty Advisor, Robotics Society', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Teams of up to 5 members with robots adhering to weight guidelines.'
  },
  {
    id: 'tedx-kiit-2026',
    title: 'TEDxKIIT: Catalysts of Tomorrow',
    category: 'workshops',
    categoryLabel: 'Workshops',
    campusZone: 'campus-6',
    featured: true,
    targetDate: getFutureDate(16, 10, 0),
    timeRange: '10:00 AM - 04:30 PM',
    venue: 'Main Auditorium, Campus 6',
    locationShort: 'Main Auditorium, Campus 6',
    price: '₹349',
    isFree: false,
    capacity: 500,
    registeredCount: 462,
    badge: 'Premier Conclave',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'An independently organized TED event featuring 8 multidisciplinary visionaries sharing paradigm-shifting ideas.',
    fullDescription: 'Join us on the iconic red dot stage as TEDxKIIT brings together innovators, scientists, artists, and climate leaders. Dive deep into talks that challenge conventions, spark breakthroughs, and inspire community-driven impact.',
    highlights: [
      'Official TEDx Attendee Kit & Badge',
      '8 Dynamic Talks Across Science, Art, & Tech',
      'Gourmet Networking Lunch with Speakers',
      'Exclusive Interactive Innovation Exhibits'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Session 1: Horizons of Perception' },
      { time: '12:00 PM', activity: 'Networking Lunch & Interactive Exhibits' },
      { time: '02:00 PM', activity: 'Session 2: Uncharted Territories' },
      { time: '04:00 PM', activity: 'Speaker Q&A & Concluding Remarks' }
    ],
    speakers: [
      { name: 'Dr. Meera Nambiar', role: 'Climate Scientist & Ashoka Fellow', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Aakash Verma', role: 'Quantum Computing Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to registered student delegates and faculty.'
  },
  {
    id: 'kiit-green-marathon',
    title: 'Campus Green Run: 10K & 5K Fitness Marathon',
    category: 'sports',
    categoryLabel: 'Sports League',
    campusZone: 'campus-13',
    featured: false,
    targetDate: getFutureDate(22, 6, 0),
    timeRange: '06:00 AM - 10:00 AM',
    venue: 'Sports Complex Gate 1, Campus 13',
    locationShort: 'Sports Complex, Campus 13',
    price: 'Free',
    isFree: true,
    capacity: 1200,
    registeredCount: 980,
    badge: 'Fitness & Health',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Lace up your running shoes for the annual eco-friendly campus marathon promoting mental wellness and sustainability.',
    fullDescription: 'Promote active living and green campus practices! The KIIT Green Marathon features timed 5K and 10K circuits winding through the leafy boulevards of our lush university campus. Hydration stations, medical support, and breakfast are provided.',
    highlights: [
      'Official Dri-FIT Marathon T-Shirt & Bib with RFID Timing Chip',
      'Custom Finisher Medals for All Completers',
      'Healthy Post-Run Breakfast & Fruit Buffet',
      '₹50,000 in Prizes for Top Finishers across Age Groups'
    ],
    schedule: [
      { time: '06:00 AM', activity: 'Warm-up Zumba Session & Flag-off' },
      { time: '06:30 AM', activity: '10K Elite & Open Runners Start' },
      { time: '07:00 AM', activity: '5K Fun Run & Faculty Walk' },
      { time: '08:45 AM', activity: 'Medal Ceremony & Breakfast' }
    ],
    speakers: [
      { name: 'Ananya Rath', role: 'National Triathlete & Fitness Coach', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'All students, staff, and guests.'
  }
];

// Helper functions for formatting display
export function getFormattedEvent(event) {
  const d = event.targetDate;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const diffDays = Math.max(0, Math.ceil((d - now) / (1000 * 60 * 60 * 24)));

  return {
    ...event,
    formattedDate: formatDate(d),
    formattedTime: formatTime(d),
    monthShort: monthNames[d.getMonth()],
    dayNumber: d.getDate(),
    weekday: dayNames[d.getDay()],
    daysLeft: diffDays,
    seatsRemaining: Math.max(0, event.capacity - event.registeredCount),
    percentFull: Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
  };
}
