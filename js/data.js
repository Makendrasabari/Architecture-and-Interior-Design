/**
 * STACKLY Architecture & Interior Design Studio
 * Unified Studio Datasets (Vanilla JS - Global Namespace)
 */

window.STACKLY_DATA = {
  projects: [
    {
      id: 'villa-aurelia',
      name: 'Villa Aurelia',
      category: 'Residential',
      location: 'Amalfi Coast, Italy',
      year: '2025',
      area: '14,200 sq.ft',
      headline: 'Monumental limestone cantilever suspended over the Mediterranean horizon.',
      description: 'Carved directly into the cliffside topography, Villa Aurelia dissolves the boundary between natural rock strata and refined architectural concrete. Featuring sweeping glass facades, cascading infinity reflecting pools, and bespoke micro-cement interior volumes.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Completed',
      progress: 100,
      budget: '$18.4M',
      client: 'Private Collector',
      completion: 'Q4 2025'
    },
    {
      id: 'salem-residence',
      name: 'Salem Residence',
      category: 'Residential & Heritage',
      location: 'Salem, Massachusetts',
      year: '2025',
      area: '8,800 sq.ft',
      headline: 'A dialogue between historic Salem craftsmanship and austere modern minimalism.',
      description: 'Set within the historic architectural enclave of Salem, MA, this private residence juxtaposes charred cedar vertical cladding with brutalist thermal-break concrete and expansive floor-to-ceiling blackened steel apertures.',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Completed',
      progress: 100,
      budget: '$9.2M',
      client: 'Vanguard Estate Group',
      completion: 'Q2 2025'
    },
    {
      id: 'urban-house',
      name: 'Urban House',
      category: 'Urban Sanctuary',
      location: 'Tribeca, New York',
      year: '2026',
      area: '6,400 sq.ft',
      headline: 'Multi-tiered daylight well puncturing an urban cast-iron architectural volume.',
      description: 'A transformative urban townhome featuring an interior glass atrium, floating walnut and steel spiral staircase, fluted acoustic panelling, and integrated biophilic courtyards.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'In Construction',
      progress: 82,
      budget: '$12.1M',
      client: 'Sterling Urban Partners',
      completion: 'Q3 2026'
    },
    {
      id: 'horizon-office',
      name: 'Horizon Office',
      category: 'Commercial',
      location: 'Reykjavik, Iceland',
      year: '2026',
      area: '36,000 sq.ft',
      headline: 'Geothermal-powered architectural headquarters sculpted from basalt and glass.',
      description: 'Designed as a net-zero commercial campus, Horizon Office integrates geothermal radiant slabs, dynamic solar facade fins, and raw volcanic stone surfaces into a state-of-the-art collaborative environment.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Design Development',
      progress: 64,
      budget: '$42.0M',
      client: 'Nordic Clean Capital',
      completion: 'Q4 2026'
    },
    {
      id: 'terra-retreat',
      name: 'Terra Retreat',
      category: 'Hospitality',
      location: 'Sedona, Arizona',
      year: '2025',
      area: '22,500 sq.ft',
      headline: 'Rammed earth pavilions embedded into the red rock landscape of the high desert.',
      description: 'An architectural eco-resort utilizing local red clay aggregate for rammed earth walls, low-emissivity glass curtain walls, and shaded private courtyards configured along solar orientation lines.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Completed',
      progress: 100,
      budget: '$26.5M',
      client: 'Terra Hospitality Global',
      completion: 'Q1 2025'
    },
    {
      id: 'modern-courtyard',
      name: 'Modern Courtyard',
      category: 'Residential',
      location: 'Kyoto, Japan',
      year: '2026',
      area: '5,200 sq.ft',
      headline: 'Contemporary architectural meditation on Japanese courtyard space planning.',
      description: 'An introspective residential retreat framing a central Zen rock garden through blackened cedar engawa terraces, ultra-thin sliding shoji glazed doors, and precision hand-finished concrete planes.',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80'
      ],
      status: 'Planning & Permitting',
      progress: 45,
      budget: '$7.8M',
      client: 'Morioka Private Trust',
      completion: 'Q1 2027'
    }
  ],

  servicesData: [
    {
      id: 'architecture',
      number: '01',
      title: 'Architecture',
      shortDesc: 'Monumental forms, contextual materiality, and sculptural geometries that shape modern living.',
      fullDesc: 'From private luxury residences to commercial headquarters, our architectural practice synthesizes site specificity, structural innovation, and timeless aesthetics. Every line drawn is calibrated for light, thermal performance, and human experience.',
      features: [
        'Site Analysis & Feasibility Studies',
        'Conceptual & Schematic Design',
        'Structural Engineering Coordination',
        'Permitting & Building Code Compliance',
        'Detailed Construction Documentation'
      ],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'interior-design',
      number: '02',
      title: 'Interior Design',
      shortDesc: 'Curated environments defined by bespoke millwork, tactile materials, and atmospheric lighting.',
      fullDesc: 'We treat interior spaces as intimate architectural volumes. Our interior design atelier sources rare natural stones, hand-finished timbers, patinated bronzes, and custom furniture to curate cohesive sensory landscapes.',
      features: [
        'Interior Architectural Detailing',
        'Custom Millwork & Joinery Design',
        'FF&E Procurement & Sourcing',
        'Bespoke Lighting Design & Controls',
        'Textile & Material Curation'
      ],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'space-planning',
      number: '03',
      title: 'Space Planning',
      shortDesc: 'Mathematical flow, ergonomic circulation, and spatial optimization for elite residences and workplaces.',
      fullDesc: 'Spatial choreography is the soul of architecture. We dissect human movement, acoustic requirements, and functional adjacencies to craft floor plans that feel effortlessly intuitive, expansive, and tailored.',
      features: [
        'Circulation & Flow Optimization',
        'Zoning: Public, Private & Service',
        'Ergonomic Proportions & Clearances',
        'Flexible Modular Space Planning',
        'Acoustic & Privacy Matrixing'
      ],
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3d-visualization',
      number: '04',
      title: '3D Visualization',
      shortDesc: 'Photorealistic architectural CGI, immersive digital twins, and cinematic lighting animations.',
      fullDesc: 'Using cutting-edge ray-traced rendering and real-time architectural game engines, we bring unbuilt visions to life. Experience physical daylight studies, material texture interaction, and cinematic fly-throughs prior to ground-breaking.',
      features: [
        'Hyper-Realistic Architectural Renders',
        'Atmospheric Lighting & Day/Night Studies',
        'Virtual Reality Interactive Walkthroughs',
        'Material & Texture Digital Mockups',
        'Cinematic Architectural Animation'
      ],
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'landscape-design',
      number: '05',
      title: 'Landscape Design',
      shortDesc: 'Seamless integration between built architecture and botanical topography.',
      fullDesc: 'Our landscape architecture connects indoor living rooms directly to the open sky. We sculpt infinity water features, xeriscape stone gardens, terraced outdoor living pavilions, and native flora ecosystems.',
      features: [
        'Architectural Hardscape Design',
        'Native Botany & Planting Palettes',
        'Pool, Spa & Water Feature Engineering',
        'Outdoor Kitchens & Cantilever Pavilions',
        'Exterior Architectural Illumination'
      ],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'project-management',
      number: '06',
      title: 'Project Management',
      shortDesc: 'Uncompromising execution, budget stewardship, and rigorous on-site quality control.',
      fullDesc: 'From initial ground-breaking to white-glove handover, our studio directs general contractors, craftsmen, and specialty consultants with militant attention to detail, maintaining timeline precision and budget fidelity.',
      features: [
        'Contractor Tendering & Evaluation',
        'Comprehensive Schedule & Milestone Tracking',
        'Budget Management & Cost Auditing',
        'On-Site Construction Administration',
        'Turnkey Handover & Commissioning'
      ],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
    }
  ],

  blogPosts: [
    {
      id: 'cantilever-engineering-minimalism',
      title: 'The Poetics of the Cantilever: Structural Drama in Modern Residences',
      category: 'Architecture',
      date: 'Sep 2026',
      readTime: '6 min read',
      excerpt: 'How post-tensioned architectural concrete and concealed steel outriggers allow luxury structures to float effortlessly over natural landscapes.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      content: `Cantilever architecture has long represented the ultimate expression of human ambition against gravity. In contemporary residential practice, the cantilever is no longer merely a structural show of force—it has evolved into a delicate poetic device that frames horizons and dissolves the boundary between domestic comfort and raw landscape.

### Structural Integrity Hidden in Plain Sight
By deploying hybrid steel trusses embedded within cellular concrete cores, our Salem studio creates 35-foot unassisted projections. This engineering allows floor-to-ceiling ultra-clear glazing without corner mullions, granting owners panoramic vistas across oceanic cliffs and rugged coastlines.

### Thermal Breaks and Material Honesty
Modern cantilever envelopes require rigorous thermal barrier detailing to prevent structural thermal bridging. Using aerogel insulative sleeves and carbon-fiber reinforcement ties, we ensure the building envelope achieves passive house efficiency while retaining a knife-edge architectural profile.`,
      author: 'Marcus Vance, Lead Principal'
    },
    {
      id: 'travertine-and-dark-charcoal-palettes',
      title: 'Quiet Luxury: The Dialogue Between Roman Travertine and Charred Timber',
      category: 'Materials',
      date: 'Aug 2026',
      readTime: '5 min read',
      excerpt: 'Examining the tactile resonance created when porous unfilled Italian travertine meets Shou Sugi Ban blackened wood in contemporary interiors.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      content: `True luxury in interior architecture does not scream; it whispers through the weight, texture, and historical resonance of natural materials. The pairing of open-pore travertine alongside charred Japanese cedar creates a sensory friction that grounds the occupant.

Travertine absorbs and softens daylight with its warm, calcium-rich matrix. Conversely, carbonized timber recedes into shadow, creating depth and framing views. When juxtaposed with brushed bronze architectural hardware, the space achieves a timeless dignity immune to transient design fads.`,
      author: 'Elena Rostova, Design Director'
    },
    {
      id: 'geothermal-and-passive-solar-geometry',
      title: 'Net-Zero Monumentality: Integrating Geothermal Systems with Monolithic Massing',
      category: 'Sustainability',
      date: 'Aug 2026',
      readTime: '7 min read',
      excerpt: 'Why high-performance sustainable architecture begins with solar orientation, high-albedo envelopes, and deep earth thermal loops.',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      content: `Sustainability should never be an afterthought applied to an arbitrary facade. In STACKLY's sustainable projects, building form is directly sculpted by sunlight vectors, prevailing wind microclimates, and geothermal borehole depths.

By utilizing high-mass thermal concrete floors, our buildings absorb excess solar heat during peak daytime hours and release it gently into the living volumes as temperatures drop at night, dramatically slashing HVAC energy demands.`,
      author: 'Julian Chen, Sustainability Lead'
    },
    {
      id: 'biophilic-space-planning-evolution',
      title: 'The Inner Forest: Courtyard Space Planning for Contemporary Urban Sanctuaries',
      category: 'Interior Design',
      date: 'Jul 2026',
      readTime: '4 min read',
      excerpt: 'Choreographing interior living circulation around private contemplative Zen atriums and internal rainwater pools.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
      content: `In dense metropolitan environments, exterior views are often compromised by urban noise and visual clutter. Our solution is the introverted architectural sanctuary: turning the house inward toward a private, glass-encased courtyard.

Light filters through Japanese maple leaves and cascades across textured stone feature walls, casting dancing shadow patterns across living room floors throughout the day.`,
      author: 'Elena Rostova, Design Director'
    },
    {
      id: 'architectural-monochrome-trends-2027',
      title: 'Red Accents & Deep Charcoal: The Rise of High-Contrast Editorial Architecture',
      category: 'Design Trends',
      date: 'Jun 2026',
      readTime: '5 min read',
      excerpt: 'How bold crimson gradients and monolithic obsidian volumes are defining the next era of luxury architecture aesthetics.',
      image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80',
      content: `The era of all-beige neutral minimalism is evolving into an era of confident, deliberate architectural contrast. Clean white gallery volumes are now juxtaposed with deep charcoal structural frames and sculptural crimson accents.

A single red-gradient pivot door, a crimson lacquered wine cellar niche, or subtle red linear cove lighting transforms clean architectural geometry into an unforgettable visual experience.`,
      author: 'Marcus Vance, Lead Principal'
    },
    {
      id: 'salem-residence-case-study',
      title: 'Case Study: The Making of Salem Residence — Balancing Heritage and Future',
      category: 'Case Studies',
      date: 'May 2026',
      readTime: '8 min read',
      excerpt: 'An inside look into the 24-month design and construction journey of our award-winning Salem Massachusetts studio commission.',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1000&q=80',
      content: `Building in historic Salem requires immense reverence for historical architectural typologies. For the Salem Residence, our studio spent six months studying maritime carpentry, local stone foundations, and historical roof pitches before putting pen to paper.

The final home features custom-milled white pine, locally quarried granite plinths, and triple-glazed architectural curtain walls that celebrate Salem's heritage while establishing an uncompromising modern vocabulary.`,
      author: 'Julian Chen, Senior Project Architect'
    }
  ],

  materialsData: [
    {
      id: 'american-walnut',
      category: 'Wood',
      name: 'American Black Walnut',
      finish: 'Ultra-Matte Polyurethane & Hand-Rubbed Oil',
      origin: 'Appalachian Valley, USA',
      durability: 'Class A Commercial',
      image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=600&q=80',
      specs: 'Moisture content 7-9%, FSC Certified sustainably harvested, rift cut grain alignment.',
      applications: 'Architectural wall paneling, bespoke kitchen cabinetry, executive desks.'
    },
    {
      id: 'smoked-european-oak',
      category: 'Wood',
      name: 'Smoked European Oak',
      finish: 'Deep Fumed Reactive Stain, Wire-Brushed',
      origin: 'Burgundy, France',
      durability: 'Class A Commercial (Janka 1360)',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      specs: '220mm wide plank, 6mm solid wear layer on birch multi-ply substrate.',
      applications: 'Monumental chevron flooring, floating stair treads, feature ceilings.'
    },
    {
      id: 'plantation-teak',
      category: 'Wood',
      name: 'Burmese Golden Teak',
      finish: 'Marine-Grade Natural Penetrating Wax',
      origin: 'Certified Plantations, Myanmar',
      durability: 'Extreme Weather & Water Resistance',
      image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80',
      specs: 'Naturally high silica and oil content, insect resistant, zero warpage outdoors.',
      applications: 'Poolside terraces, exterior soffits, spa wet-room decking.'
    },
    {
      id: 'roman-travertine',
      category: 'Stone',
      name: 'Roman Navona Travertine',
      finish: 'Honed, Open-Pore Architectural Matrix',
      origin: 'Tivoli, Italy',
      durability: 'High Compressive Strength (112 MPa)',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      specs: 'Calcite alabaster composition with subtle linear thermal veining.',
      applications: 'Interior monolithic fireplace towers, bathroom vanity blocks, exterior cladding.'
    },
    {
      id: 'carrara-marble',
      category: 'Stone',
      name: 'Statuario White Carrara',
      finish: 'Velvet Satin Honed (Zero Glare)',
      origin: 'Carrara, Italy',
      durability: 'Medium Density Luxury Interior',
      image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
      specs: 'Bookmatched slab sets, ultra-pure crystalline calcium carbonate ground.',
      applications: 'Kitchen waterfall islands, master spa slabs, lobby reception monoliths.'
    },
    {
      id: 'nero-marquina',
      category: 'Stone',
      name: 'Nero Marquina Obsidian',
      finish: 'Polished or Leathered Deep Black',
      origin: 'Basque Country, Spain',
      durability: 'Dense Fine-Grain Metamorphic',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
      specs: 'Deep obsidian ground punctuated by striking diagonal white calcite fractures.',
      applications: 'Bar surfaces, powder room feature alcoves, architectural bench plinths.'
    },
    {
      id: 'brushed-champagne-brass',
      category: 'Metal',
      name: 'Brushed Champagne Brass',
      finish: 'Micro-Directional Satin with Nano-Ceramic Seal',
      origin: 'Solingen, Germany',
      durability: 'Anti-Tarnish Lifetime PVD Finish',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      specs: 'Solid alloy 385 architectural brass, custom warm champagne tone.',
      applications: 'Custom door pull hardware, concealed cabinet reveals, luminaire stems.'
    },
    {
      id: 'gunmetal-blackened-steel',
      category: 'Metal',
      name: 'Blackened Gunmetal Steel',
      finish: 'Cold-Rolled Acid Etched & Beeswax Buffed',
      origin: 'Sheffield, United Kingdom',
      durability: 'Structural Industrial Grade',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
      specs: 'Structural 8mm plate, hand-patinated with mottled charcoal-to-indigo undertones.',
      applications: 'Fireplace surrounds, staircase stringers, glass partition frames.'
    },
    {
      id: 'architectural-fluted-glass',
      category: 'Glass',
      name: 'Linear Fluted Reeded Glass',
      finish: 'Low-Iron High Clarity Textured Pattern',
      origin: 'Antwerp, Belgium',
      durability: 'Tempered & Laminated Safety Certified',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
      specs: '12mm thickness, 10mm fluting pitch, acoustic transmission class STC 36.',
      applications: 'Office conference dividers, master bath shower enclosures, wine room doors.'
    },
    {
      id: 'smoked-bronze-glass',
      category: 'Glass',
      name: 'Smoked Bronze Architectural Glass',
      finish: 'Body-Tinted Float Glass with Anti-Reflective Coating',
      origin: 'St. Gobain, France',
      durability: '10mm Toughened Safety Glass',
      image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=600&q=80',
      specs: 'Light transmission 28%, blocks 72% of solar glare while maintaining transparency.',
      applications: 'Walk-in dressing room wardrobes, backlit bar display shelving.'
    },
    {
      id: 'textured-wool-boucle',
      category: 'Fabric',
      name: 'Alpaca Wool Bouclé',
      finish: 'Untreated Natural Curl with Stain Resistance',
      origin: 'Biella, Italy',
      durability: '65,000 Martindale Rubs (Heavy Domestic & Commercial)',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
      specs: '70% virgin wool, 20% alpaca, 10% silk. Flame retardant EN 1021.',
      applications: 'Curved custom sofas, sculptural armchairs, acoustic upholstered headboards.'
    },
    {
      id: 'belgian-washed-linen',
      category: 'Fabric',
      name: 'Masters of Linen® Washed Belgian Linen',
      finish: 'Enzyme Washed for Tactile Softness',
      origin: 'Flanders, Belgium',
      durability: 'Oeko-Tex Standard 100 Class 1',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
      specs: '100% long-staple European flax, 480 g/m² heavy weight drape.',
      applications: 'Floor-to-ceiling architectural drapery, tailored lounge cushions, roman shades.'
    }
  ],

  floorPlanData: {
    projectTitle: 'Villa Aurelia — Main Living & Cantilever Level',
    scale: '1/4" = 1\'-0"',
    totalSquareFootage: '6,850 sq.ft',
    orientation: 'South-Southwest Exposure',
    zones: [
      { name: 'Public Entertaining', color: 'rgba(217, 38, 56, 0.35)', badge: 'Public' },
      { name: 'Private Sanctuary', color: 'rgba(139, 14, 30, 0.35)', badge: 'Private' },
      { name: 'Culinary & Service', color: 'rgba(97, 9, 19, 0.35)', badge: 'Service' }
    ],
    rooms: [
      {
        id: 'grand-atrium',
        name: 'Grand Living Atrium & Fireplace',
        zone: 'Public Entertaining',
        dimensions: '38\' - 6" × 24\' - 0"',
        area: '924 sq.ft',
        ceilingHeight: '16\' - 0" Exposed Ribbed Concrete',
        flooring: 'Honed Roman Navona Travertine 1200×600mm',
        glazing: 'Triple-Pane Structural Silicone Low-Iron Glass',
        lighting: 'Concealed 2700K Linear LED Cove with Dali Dynamic Controls',
        description: 'Double-height volume framing 180-degree cliffside vistas, centered around a 12-foot monolithic blackened steel hearth.',
        svgProps: { x: 50, y: 60, width: 260, height: 180 }
      },
      {
        id: 'cantilever-dining',
        name: 'Cantilever Dining Pavilion',
        zone: 'Public Entertaining',
        dimensions: '22\' - 0" × 18\' - 6"',
        area: '407 sq.ft',
        ceilingHeight: '12\' - 6" American Walnut Acoustic Slats',
        flooring: 'Honed Roman Navona Travertine Seamless Flush',
        glazing: 'Motorized Frameless Sliding Pocket Glazing System',
        lighting: 'Custom Brushed Brass Architectural Chandelier + Micro-Downlights',
        description: 'Projecting 18 feet beyond the stone foundation edge, providing an illusion of hovering above the coastal drop.',
        svgProps: { x: 320, y: 60, width: 170, height: 130 }
      },
      {
        id: 'culinary-lab',
        name: 'Culinary Laboratory & Scullery',
        zone: 'Culinary & Service',
        dimensions: '26\' - 0" × 16\' - 4"',
        area: '424 sq.ft',
        ceilingHeight: '11\' - 0" Micro-Cement Smooth Finish',
        flooring: 'Continuous Polished Basalt Aggregate',
        glazing: 'Reeded Glass Clerestory Daylight Band',
        lighting: 'High-CRI 98 Architectural Task Lighting with Flos Magnetics',
        description: 'Dual-island layout featuring Statuario Carrara waterfall counters, Gaggenau 400 series appliances, and concealed walk-in pantry.',
        svgProps: { x: 320, y: 200, width: 170, height: 150 }
      },
      {
        id: 'master-sanctuary',
        name: 'Primary Master Suite & Retreat',
        zone: 'Private Sanctuary',
        dimensions: '32\' - 0" × 20\' - 0"',
        area: '640 sq.ft',
        ceilingHeight: '11\' - 6" Acoustic Plaster',
        flooring: 'Fumed Smoked European Oak Wide Plank',
        glazing: 'Triple-Glazed Acoustic Facade with Automated Sheers',
        lighting: 'Perimeter Graze Warm Dimmable Accentuation',
        description: 'Private ocean-facing sanctuary with bespoke walnut millwork headboard wall and direct terrace portal.',
        svgProps: { x: 50, y: 250, width: 260, height: 150 }
      },
      {
        id: 'infinity-terrace',
        name: 'Infinity Reflecting Pool & Terrace',
        zone: 'Public Entertaining',
        dimensions: '54\' - 0" × 16\' - 0"',
        area: '864 sq.ft',
        ceilingHeight: 'Open Sky Cantilever Canopy',
        flooring: 'Anti-Slip Flamed Travertine Pavers on Pedestals',
        glazing: 'Frameless Glass Balustrade (Zero Mullion)',
        lighting: 'Submerged Fiber-Optic Linear Pool Edge Illumination',
        description: 'Zero-edge heated saltwater reflecting pool extending toward the horizon with sunken conversation pit.',
        svgProps: { x: 50, y: 410, width: 440, height: 90 }
      }
    ],
    circulation: [
      { label: 'Primary Gallery Axis', path: 'M 180, 50 L 180, 420' },
      { label: 'Culinary Portal', path: 'M 310, 150 L 330, 150' },
      { label: 'Terrace Threshold', path: 'M 200, 395 L 200, 415' }
    ]
  },

  interiorProjectsList: [
    {
      id: 'int-1',
      roomType: 'Penthouse Living & Hearth Suite',
      client: 'Vanguard Estate Group',
      location: 'Salem Historic District',
      progress: 92,
      status: 'Finishing Touches',
      budget: '$1.85M',
      image: 'assets/interior/penthouse-suite.webp',
      materials: 'Travertine, Smoked Oak, Wool Bouclé'
    },
    {
      id: 'int-2',
      roomType: 'Minimalist Chef Culinary Suite',
      client: 'Lord Harrington',
      location: 'Amalfi Coast Residence',
      progress: 78,
      status: 'Millwork Installation',
      budget: '$920K',
      image: 'assets/interior/culinary-suite.webp',
      materials: 'Statuario Marble, Fluted Glass, Brass'
    },
    {
      id: 'int-3',
      roomType: 'Spa & Hydrotherapy Sanctuary',
      client: 'Private Collector',
      location: 'Tribeca Townhome',
      progress: 100,
      status: 'Completed',
      budget: '$1.15M',
      image: 'assets/interior/spa-sanctuary.webp',
      materials: 'Nero Marquina, Teak Decking, Concealed LED'
    },
    {
      id: 'int-4',
      roomType: 'Executive Library & Cigar Lounge',
      client: 'Nordic Clean Capital',
      location: 'Reykjavik Campus',
      progress: 60,
      status: 'Joinery Prototyping',
      budget: '$1.40M',
      image: 'assets/interior/executive-library.webp',
      materials: 'American Walnut, Saddle Leather, Gunmetal'
    }
  ],

  moodboardItems: [
    {
      category: 'Furniture',
      title: 'Curved Bouclé Lounge Settee',
      details: 'Custom Pierre Augustin Rose edition in Italian alpaca wool bouclé.',
      image: 'assets/interior/boucle-settee.webp'
    },
    {
      category: 'Lighting',
      title: 'Patinated Brass Radial Chandelier',
      details: 'Hand-hammered warm brass disc with dimmable diffuse halogen core.',
      image: 'assets/interior/brass-chandelier.webp'
    },
    {
      category: 'Materials',
      title: 'Honed Roman Travertine & Charcoal Steel',
      details: 'Porous calcium stone slab paired with 8mm acid-etched blackened steel plates.',
      image: 'assets/interior/travertine-plinth.webp'
    },
    {
      category: 'Textures',
      title: 'Washed Belgian Linen Drapery & Fluted Oak',
      details: 'Floor-to-ceiling 480 g/m² linen sheers filtering ambient coastal daylight.',
      image: 'assets/interior/silk-drapery.webp'
    },
    {
      category: 'Colors & Palette',
      title: 'Atelier Signature Color Swatches',
      details: 'Deep Crimson #D92638 • Wine #8B0E1E • Charcoal #141416 • Chalk #F1F1F4',
      image: 'assets/interior/oak-dining.webp'
    }
  ]
};
