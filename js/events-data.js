/**
 * K-Explore Events Platform
 * Master Event Dataset
 * Contains rich metadata, schedules, speakers, venue information, and dynamic future dates.
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
  { id: 'all', label: 'All Events', icon: 'sparkles' },
  { id: 'tech', label: 'Tech & Coding', icon: 'code' },
  { id: 'cultural', label: 'Cultural & Arts', icon: 'palette' },
  { id: 'music', label: 'Music & Concerts', icon: 'music' },
  { id: 'workshops', label: 'Workshops & Seminars', icon: 'graduation-cap' },
  { id: 'gaming', label: 'Gaming & Esports', icon: 'gamepad' },
  { id: 'sports', label: 'Sports & Athletics', icon: 'trophy' }
];

export const EVENTS_DATA = [
  {
    id: 'k-hacksprint-2026',
    title: 'HackSprint X: 36-Hour National Hackathon',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    featured: true,
    targetDate: getFutureDate(12, 9, 30),
    timeRange: '09:30 AM - 09:30 PM (36 Hrs)',
    venue: 'Campus 6 Auditorium & Lab Complex, KIIT',
    locationShort: 'Campus 6, KIIT',
    price: 'Free',
    isFree: true,
    capacity: 350,
    registeredCount: 298,
    badge: 'Flagship Event',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Unleash your coding superpowers in a 36-hour sprint solving challenges in Generative AI, Web3, and HealthTech.',
    fullDescription: 'HackSprint X is Eastern India\'s premier collegiate hackathon hosted at KIIT University. Over 36 hours of relentless innovation, student developers, designers, and problem solvers team up to create high-impact software and hardware solutions. With industry mentors from Google, Microsoft, and leading unicorns, participants receive round-the-clock guidance, high-speed connectivity, free food, and exciting hardware kits.',
    highlights: [
      '₹2,50,000 Total Prize Pool + Cloud Credits',
      'Direct Fast-Track Internship Interviews',
      'Free Swag Kits, RedBull, & Midnight Snacks',
      'Mentorship from Senior Silicon Valley Engineers'
    ],
    schedule: [
      { time: 'Day 1 - 09:30 AM', activity: 'Registration & Welcome Keynote' },
      { time: 'Day 1 - 11:00 AM', activity: 'Hacking Commences & Problem Statements Revealed' },
      { time: 'Day 1 - 04:00 PM', activity: 'Mentor Checkpoint 1 & Idea Validation' },
      { time: 'Day 2 - 12:00 AM', activity: 'Midnight Mystery Mini-Game Challenge' },
      { time: 'Day 2 - 09:00 AM', activity: 'Final Submissions & Code Freeze' },
      { time: 'Day 2 - 02:00 PM', activity: 'Grand Finale Pitches & Award Ceremony' }
    ],
    speakers: [
      { name: 'Dr. Arjun Sen', role: 'Head of AI Research, DeepScale', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      { name: 'Rhea Patel', role: 'Staff Engineer, Google Cloud', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all college students (Undergraduate & Postgraduate). Teams of 2 to 4 members.'
  },
  {
    id: 'kalliope-fest-2026',
    title: 'Kalliope ’26: Annual Inter-University Cultural Fest',
    category: 'cultural',
    categoryLabel: 'Cultural & Arts',
    featured: true,
    targetDate: getFutureDate(25, 17, 0),
    timeRange: '05:00 PM - 11:30 PM (3 Days)',
    venue: 'Central Stadium Grounds, Campus 13',
    locationShort: 'Stadium Grounds, Campus 13',
    price: '₹299',
    isFree: false,
    capacity: 2500,
    registeredCount: 1980,
    badge: 'Selling Fast',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'The grandest cultural carnival with celebrity musical nights, theatrical battles, fashion shows, and art installations.',
    fullDescription: 'Kalliope is the annual cultural extravaganza bringing together 15,000+ students from over 60 universities across India. Experience three electrifying evenings of live concert performances by chart-topping artists, high-voltage street plays, beatbox showdowns, runway fashion showcases, and culinary carnivals.',
    highlights: [
      'Headline Concert by Bollywood & Indie Rock Icons',
      'National Inter-College Choreography Showdown',
      'Art Installations & Lantern Light Walk',
      'Over 40 Curated Food & Lifestyle Stalls'
    ],
    schedule: [
      { time: 'Day 1 - 05:00 PM', activity: 'Opening Ceremony & Classical Fusion Night' },
      { time: 'Day 2 - 06:00 PM', activity: 'Vogue Runway Fashion Showcase' },
      { time: 'Day 3 - 07:00 PM', activity: 'Mega Star Night Live Concert' }
    ],
    speakers: [
      { name: 'Aditi Varma', role: 'Celebrity Choreographer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
      { name: 'Kabir Roy', role: 'Music Producer & Indie Artist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all valid university students and alumni with valid ID.'
  },
  {
    id: 'ai-robotics-summit',
    title: 'NextGen AI & Autonomous Robotics Conclave',
    category: 'workshops',
    categoryLabel: 'Workshops & Seminars',
    featured: true,
    targetDate: getFutureDate(8, 10, 0),
    timeRange: '10:00 AM - 05:00 PM',
    venue: 'Chintan Convention Hall, Campus 7',
    locationShort: 'Convention Hall, Campus 7',
    price: 'Free',
    isFree: true,
    capacity: 200,
    registeredCount: 188,
    badge: 'Almost Full',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Hands-on immersion with humanoid robots, drone swarms, and cutting-edge Edge AI computer vision pipelines.',
    fullDescription: 'Join industry pioneers, roboticists, and machine learning researchers for an inspiring day exploring intelligent machines. Watch live demonstrations of quadruped robot dogs, autonomous indoor drones, and learn how to deploy multimodal foundation models on microcontrollers and embedded GPUs.',
    highlights: [
      'Live Quadruped & Autonomous Drone Arena',
      'Hands-on Lab with Jetson Nano & OpenCV',
      'Networking Lunch with Robotics Startup Founders',
      'Certificate of Advanced Robotics Competency'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Keynote: The Age of Embodied Intelligence' },
      { time: '11:45 AM', activity: 'Interactive Workshop: ROS 2 & Vision Models' },
      { time: '01:00 PM', activity: 'Networking Buffet Lunch' },
      { time: '02:30 PM', activity: 'Drone Racing & Autonomous Navigation Demo' },
      { time: '04:15 PM', activity: 'Panel Discussion & Q&A' }
    ],
    speakers: [
      { name: 'Dr. Vikram Chandra', role: 'Chief Scientist, RoboDynamics Lab', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Open to all engineering, science, and computing enthusiasts.'
  },
  {
    id: 'electropulse-music-fest',
    title: 'ElectroPulse: Neon EDM & Bass Festival',
    category: 'music',
    categoryLabel: 'Music & Concerts',
    featured: false,
    targetDate: getFutureDate(18, 18, 30),
    timeRange: '06:30 PM - 11:00 PM',
    venue: 'Open Air Amphitheatre, Campus 15',
    locationShort: 'Amphitheatre, Campus 15',
    price: '₹199',
    isFree: false,
    capacity: 1200,
    registeredCount: 840,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'An exhilarating sonic journey featuring dual DJ stages, synchronized laser lighting, and heavy synth wave beats.',
    fullDescription: 'Get ready to jump and glow! ElectroPulse brings together top university DJs and guest headliners for a night of progressive house, trap, synthwave, and drum & bass. Free neon body paint, glow sticks, and sensory visual projections accompany the beats.',
    highlights: [
      '30,000-Watt Sound Experience with Laser FX',
      'Complimentary Neon Glow Bands & Face Glitter',
      'Multi-DJ Battle with Audience Voting',
      'Chill Out Mocktail Zone'
    ],
    schedule: [
      { time: '06:30 PM', activity: 'Gates Open & Ambient DJ Warm-up' },
      { time: '07:30 PM', activity: 'Bass House & Electro Set' },
      { time: '09:00 PM', activity: 'Headline DJ Neon Rave Session' }
    ],
    speakers: [
      { name: 'DJ Zeddrix', role: 'Resident Fest DJ & Remixer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'All students with university registration passes.'
  },
  {
    id: 'esports-arena-battle',
    title: 'Campus Valorant & BGMI Esports Championship',
    category: 'gaming',
    categoryLabel: 'Gaming & Esports',
    featured: true,
    targetDate: getFutureDate(4, 11, 0),
    timeRange: '11:00 AM - 08:00 PM',
    venue: 'Indoor Sports Complex & Esports Arena, Campus 12',
    locationShort: 'Esports Arena, Campus 12',
    price: 'Free',
    isFree: true,
    capacity: 160,
    registeredCount: 144,
    badge: 'Starting Soon',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Compete on 240Hz gaming rigs in the ultimate collegiate tactical shooter and battle royale championship.',
    fullDescription: 'The biggest gaming showdown of the semester! 32 Valorant squads and 24 BGMI teams clash for the golden trophy. Broadcasted live with professional shoutcasters on YouTube and Twitch with spectator arena seating.',
    highlights: [
      'High-Refresh Pro Gaming Rigs & Mechanical Peripherals Provided',
      '₹75,000 Winner Pot + Pro Gaming Gear',
      'Live Shoutcasting & Big-Screen Spectator Lounge',
      '1v1 Aim Lab Mini-Challenges for Visitors'
    ],
    schedule: [
      { time: '11:00 AM', activity: 'Bracket Seeding & Warmup Sessions' },
      { time: '01:00 PM', activity: 'Quarter-Finals & Semi-Finals' },
      { time: '05:30 PM', activity: 'Grand Finals Bo5 (Best of 5)' }
    ],
    speakers: [
      { name: 'Kunal "Apex" Das', role: 'Official Esports Shoutcaster', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Teams of 5 players for Valorant; Squad of 4 for BGMI.'
  },
  {
    id: 'kiit-cricket-championship',
    title: 'KPL 2026: Floodlight Cricket League Finals',
    category: 'sports',
    categoryLabel: 'Sports & Athletics',
    featured: false,
    targetDate: getFutureDate(15, 16, 0),
    timeRange: '04:00 PM - 10:00 PM',
    venue: 'Cricket Stadium, KIIT Campus 13',
    locationShort: 'Cricket Stadium, Campus 13',
    price: 'Free',
    isFree: true,
    capacity: 1500,
    registeredCount: 1120,
    badge: 'Finals',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Witness the intense showdown between the top school teams in the thrilling 10-over cricket championship under floodlights.',
    fullDescription: 'The climax of the inter-school sports season! Watch the highest-scoring cricket final under high-power floodlights with cheer squads, DJ commentary, live giant-screen replays, and man-of-the-match awards.',
    highlights: [
      'Floodlight T-10 Championship Climax',
      'Live DJ Commentary & Boundary Cheers',
      'Trophy Presentation by Ranji Trophy Captain',
      'Free Spectator Cheer Flags & Refreshments'
    ],
    schedule: [
      { time: '04:00 PM', activity: 'Toss & National Anthem' },
      { time: '04:30 PM', activity: 'First Innings (10 Overs)' },
      { time: '06:00 PM', activity: 'Second Innings Chase' },
      { time: '07:30 PM', activity: 'Trophy & Cash Award Presentation' }
    ],
    speakers: [
      { name: 'Sourav Mohanty', role: 'State Cricket Coach', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' }
    ],
    eligibility: 'Spectator passes open to all students, faculty, and guests.'
  },
  {
    id: 'web3-cloud-masterclass',
    title: 'Web3 & Cloud Architectures Masterclass',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    featured: false,
    targetDate: getFutureDate(3, 14, 0),
    timeRange: '02:00 PM - 06:00 PM',
    venue: 'Auditorium Hall B, School of Computer Engineering',
    locationShort: 'Auditorium Hall B, Campus 15',
    price: 'Free',
    isFree: true,
    capacity: 180,
    registeredCount: 172,
    badge: 'Starting in 3 Days',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A deep-dive workshop on building scalable serverless backends and writing secure Solidity smart contracts.',
    fullDescription: 'Master how modern web apps bridge cloud scalability with decentralized networks. You will build, test, and deploy a decentralized file-sharing vault utilizing serverless edge functions and Ethereum smart contracts.',
    highlights: [
      'Deploy Smart Contracts on Sepolia Testnet',
      'Free Serverless Cloud Tier Credits',
      'Hands-on Code Walkthroughs with GitHub Repos',
      'Digital NFT Attendance Certificate'
    ],
    schedule: [
      { time: '02:00 PM', activity: 'Modern Web Architecture: From Cloud to Web3' },
      { time: '03:15 PM', activity: 'Building REST & GraphQL APIs with Edge Workers' },
      { time: '04:30 PM', activity: 'Smart Contract Deployment & Testing' },
      { time: '05:30 PM', activity: 'Q&A & Verification of Certificates' }
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
    categoryLabel: 'Workshops & Seminars',
    featured: false,
    targetDate: getFutureDate(6, 10, 0),
    timeRange: '10:00 AM - 04:30 PM',
    venue: 'Design Studio Lab 3, Campus 17',
    locationShort: 'Design Studio, Campus 17',
    price: '₹99',
    isFree: false,
    capacity: 120,
    registeredCount: 96,
    badge: 'Interactive Lab',
    image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Learn Figma component architecture, micro-interactions, and design tokens used by world-class product teams.',
    fullDescription: 'Step up your design game from wireframes to enterprise design systems. Learn auto-layout mastery, token variables, accessible color contrasts, and prototype interactive micro-animations that impress recruiters.',
    highlights: [
      'Production Figma UI Kit Included',
      'Portfolio Review Session with Senior Product Designers',
      'Figma Community Badge & Certificate',
      'UI Redesign Challenge with Goodies'
    ],
    schedule: [
      { time: '10:00 AM', activity: 'Design Thinking & Information Architecture' },
      { time: '11:30 AM', activity: 'Figma Auto-Layout & Design Tokens Mastery' },
      { time: '01:30 PM', activity: 'Interactive Micro-interactions & Motion' },
      { time: '03:00 PM', activity: 'Live Portfolio Critique' }
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
    categoryLabel: 'Cultural & Arts',
    featured: false,
    targetDate: getFutureDate(30, 11, 30),
    timeRange: '11:30 AM - 07:00 PM',
    venue: 'Convention Centre Gallery, Campus 6',
    locationShort: 'Gallery Hall, Campus 6',
    price: 'Free',
    isFree: true,
    capacity: 400,
    registeredCount: 260,
    badge: 'Art Exhibition',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'A celebration of visual storytelling featuring short film premieres, documentary screenings, and photography galleries.',
    fullDescription: 'Immerse yourself in cinematic creativity! Browse curated photography prints from 120+ student photographers across India, followed by screenings of award-winning student short films with director Q&A sessions.',
    highlights: [
      'Screening of 15 Selected Short Documentaries',
      'Gallery of 200+ Framed Fine Art Photographs',
      'Fireside Chat with Indie Film Directors',
      'People’s Choice Award for Best Street Photography'
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
    categoryLabel: 'Workshops & Seminars',
    featured: false,
    targetDate: getFutureDate(21, 10, 30),
    timeRange: '10:30 AM - 05:00 PM',
    venue: 'TBI Auditorium (Technology Business Incubator), Campus 11',
    locationShort: 'TBI Hall, Campus 11',
    price: 'Free',
    isFree: true,
    capacity: 250,
    registeredCount: 215,
    badge: 'Seed Grants',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'Pitch your breakthrough venture to angel investors, venture capitalists, and university incubator directors.',
    fullDescription: 'Got an audacious idea? Pitch directly to seasoned angel syndicates and startup mentors. Selected ventures will receive equity-free incubation grants, cloud infrastructure support, and legal advisory.',
    highlights: [
      'Up to ₹10 Lakhs in Seed Grants & Mentorship',
      'Networking with 15+ Active Angel Investors',
      '1-on-1 Legal & IP Protection Clinic',
      'Complimentary Founder Lunch & Networking Mixer'
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
    featured: false,
    targetDate: getFutureDate(7, 17, 30),
    timeRange: '05:30 PM - 09:00 PM',
    venue: 'KIMS Lakeside Lawn, Campus 5',
    locationShort: 'Lakeside Lawn, Campus 5',
    price: 'Free',
    isFree: true,
    capacity: 300,
    registeredCount: 275,
    badge: 'Cozy Evening',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    shortDescription: 'An intimate evening of soothing acoustic guitars, spoken word poetry, and storytelling under fairy lights.',
    fullDescription: 'Escape the hustle and enjoy a golden-hour acoustic session. Settle in on beanbags and lawn mats beside the lake as student vocalists, poets, and instrumentalists share raw, unplugged performances.',
    highlights: [
      'Fairy-Lit Lakeside Seating with Free Hot Chai',
      'Open Mic Slots Available for Spontaneous Performers',
      'Live Percussion Jam Session',
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
    eligibility: 'Open to everyone seeking art and relaxation.'
  },
  {
    id: 'robowar-mech-arena',
    title: 'RoboWars 2026: Heavyweight Combat Arena',
    category: 'tech',
    categoryLabel: 'Tech & Coding',
    featured: false,
    targetDate: getFutureDate(9, 13, 0),
    timeRange: '01:00 PM - 07:00 PM',
    venue: 'Automobile Engineering Workshop Arena, Campus 8',
    locationShort: 'Mech Arena, Campus 8',
    price: 'Free',
    isFree: true,
    capacity: 600,
    registeredCount: 520,
    badge: 'High Action',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    shortDescription: '15kg and 30kg custom combat robots battle it out in a reinforced Lexan arena with spinning blades and flippers.',
    fullDescription: 'Metal meets metal in the most adrenaline-pumping collegiate robotics clash! Teams engineer custom remote-controlled combat bots fitted with spinning drums, pneumatic flippers, and wedge armor. Sparks fly as bots fight to immobilize their opponents.',
    highlights: [
      'Full Bullet-Proof Polycarbonate Combat Cage',
      '15kg Featherweight & 30kg Middleweight Categories',
      'Pit Crew Repair Bays with Welding & Electronics Stations',
      '₹1,20,000 Cash Pool for Top Combat Engineers'
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
  }
];

// Helper functions for formatting display
export function getFormattedEvent(event) {
  return {
    ...event,
    formattedDate: formatDate(event.targetDate),
    formattedTime: formatTime(event.targetDate),
    seatsRemaining: Math.max(0, event.capacity - event.registeredCount),
    percentFull: Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
  };
}
