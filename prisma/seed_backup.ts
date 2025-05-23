// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const TRADE_SEED = [
  { division: 'Precon, Planning and Supervision', name: '3rd Party Plan Room' },
  { division: 'Precon, Planning and Supervision', name: 'Architect' },
  { division: 'Precon, Planning and Supervision', name: 'Building Information Modeling' },
  { division: 'Precon, Planning and Supervision', name: 'Commissioning' },
  { division: 'Precon, Planning and Supervision', name: 'Construction Progress Photography' },
  { division: 'Precon, Planning and Supervision', name: 'Energy Consulting' },
  { division: 'Precon, Planning and Supervision', name: 'Engineering' },
  { division: 'Precon, Planning and Supervision', name: 'Environmental Compliance and Support' },
  { division: 'Precon, Planning and Supervision', name: 'Heavy Equipment Rentals' },
  { division: 'Precon, Planning and Supervision', name: 'Hotel Procurement' },
  { division: 'Precon, Planning and Supervision', name: 'Material Estimating' },
  { division: 'Precon, Planning and Supervision', name: 'Mobilization' },
  { division: 'Precon, Planning and Supervision', name: 'NPDES Monitoring' },
  { division: 'Precon, Planning and Supervision', name: 'Permit Services' },
  { division: 'Precon, Planning and Supervision', name: 'Radar Imaging' },
  { division: 'Precon, Planning and Supervision', name: 'Reprographics' },
  { division: 'Precon, Planning and Supervision', name: 'Safety Oversight, Support and Training' },
  { division: 'Precon, Planning and Supervision', name: 'Scheduling of Work / Construction Progress' },
  { division: 'Precon, Planning and Supervision', name: 'Security Services' },
  { division: 'Precon, Planning and Supervision', name: 'Site Supervisor' },
  { division: 'Precon, Planning and Supervision', name: 'Steel Detailing' },
  { division: 'Precon, Planning and Supervision', name: 'Surveying' },
  { division: 'Precon, Planning and Supervision', name: 'Temporary Barricades' },
  { division: 'Precon, Planning and Supervision', name: 'Temporary Facilities - Offices and Storage' },
  { division: 'Precon, Planning and Supervision', name: 'Testing & Inspection Services' },
  { division: 'Precon, Planning and Supervision', name: 'Utility Submetering' },

  { division: 'Demolition and Site Construction', name: 'Asphalt Paving' },
  { division: 'Demolition and Site Construction', name: 'Caissons' },
  { division: 'Demolition and Site Construction', name: 'Curb and Gutter' },
  { division: 'Demolition and Site Construction', name: 'Dewatering' },
  { division: 'Demolition and Site Construction', name: 'Directional Drilling' },
  { division: 'Demolition and Site Construction', name: 'Drainage and Containment' },
  { division: 'Demolition and Site Construction', name: 'Erosion Control' },
  { division: 'Demolition and Site Construction', name: 'Exterior Demolition' },
  { division: 'Demolition and Site Construction', name: 'Fences and Gates' },
  { division: 'Demolition and Site Construction', name: 'Grading and Fill' },
  { division: 'Demolition and Site Construction', name: 'Hazardous Waste Recovery Process' },
  { division: 'Demolition and Site Construction', name: 'Heavy Duty Concrete Paving' },
  { division: 'Demolition and Site Construction', name: 'Horizontial Drilling' },
  { division: 'Demolition and Site Construction', name: 'Hydro-Demolition' },
  { division: 'Demolition and Site Construction', name: 'Hydro-Excavation' },
  { division: 'Demolition and Site Construction', name: 'Interior Demolition' },
  { division: 'Demolition and Site Construction', name: 'Line Striping' },
  { division: 'Demolition and Site Construction', name: 'Manholes & Catch Basins' },
  { division: 'Demolition and Site Construction', name: 'Marine Work / Marine Diving' },
  { division: 'Demolition and Site Construction', name: 'Paving Specialties - Imprinting/Decorative' },
  { division: 'Demolition and Site Construction', name: 'Permeable Paving' },
  { division: 'Demolition and Site Construction', name: 'Retaining Walls' },
  { division: 'Demolition and Site Construction', name: 'Sanitary Sewerage' },
  { division: 'Demolition and Site Construction', name: 'Sidewalks' },
  { division: 'Demolition and Site Construction', name: 'Site Work / Excavation' },
  { division: 'Demolition and Site Construction', name: 'Soil Treatment' },
  { division: 'Demolition and Site Construction', name: 'Structural Shoring' },
  { division: 'Demolition and Site Construction', name: 'Tree Removal' },
  { division: 'Demolition and Site Construction', name: 'Trucking / Hauling' },
  { division: 'Demolition and Site Construction', name: 'Tunnel Excavation' },
  { division: 'Demolition and Site Construction', name: 'Underground Utilities' },
  { division: 'Demolition and Site Construction', name: 'Utilities Locating' },
  
  { division: 'Concrete Construction', name: 'Architectural Precast Concrete' },
  { division: 'Concrete Construction', name: 'Concrete / Redi Mix Supplier' },
  { division: 'Concrete Construction', name: 'Concrete Cast-In-Place (Slabs)' },
  { division: 'Concrete Construction', name: 'Concrete Cutting' },
  { division: 'Concrete Construction', name: 'Concrete Footers and Stem Walls' },
  { division: 'Concrete Construction', name: 'Concrete Pumping' },
  { division: 'Concrete Construction', name: 'Concrete Reinforcement / Rebar' },
  { division: 'Concrete Construction', name: 'Decorative Concrete' },
  { division: 'Concrete Construction', name: 'Foundation Stabilization / Repairs' },
  { division: 'Concrete Construction', name: 'Gypsum Cement Underlayment' },
  { division: 'Concrete Construction', name: 'Hollowcore Precast Concrete' },
  { division: 'Concrete Construction', name: 'Lightweight Concrete Roof Insulation' },
  { division: 'Concrete Construction', name: 'Pile Foundations / Excavation Support' },
  { division: 'Concrete Construction', name: 'Structural Precast Concrete' },

  { division: 'Masonry Construction', name: 'Architectural Cast Stone' },
  { division: 'Masonry Construction', name: 'Brick and Stone' },
  { division: 'Masonry Construction', name: 'Concrete Walls (CMU)' },
  { division: 'Masonry Construction', name: 'Glass Unit Masonry' },
  { division: 'Masonry Construction', name: 'Insulated Concrete Forms (ICF)' },
  { division: 'Masonry Construction', name: 'Stone / Rock Supplier' },
  { division: 'Masonry Construction', name: 'Stone Restoration' },

  // Metal and Steel Construction
  { division: 'Metal and Steel Construction', name: 'Aluminum Railings' },
  { division: 'Metal and Steel Construction', name: 'Decorative Metal Railings' },
  { division: 'Metal and Steel Construction', name: 'Expansion Joint Cover Assemblies' },
  { division: 'Metal and Steel Construction', name: 'Handrails and Railings' },
  { division: 'Metal and Steel Construction', name: 'Light Gauge Metal Framing' },
  { division: 'Metal and Steel Construction', name: 'Metal Fabrications' },
  { division: 'Metal and Steel Construction', name: 'Metal Fasteners - Bolts, Nuts, Washers, Rivets' },
  { division: 'Metal and Steel Construction', name: 'Metal Restoration' },
  { division: 'Metal and Steel Construction', name: 'Metal Stairs and Ladders' },
  { division: 'Metal and Steel Construction', name: 'Metal Wall Panels' },
  { division: 'Metal and Steel Construction', name: 'Ornamental Metal' },
  { division: 'Metal and Steel Construction', name: 'Stainless Steel Railings' },
  { division: 'Metal and Steel Construction', name: 'Steel Bridge Fabrication' },
  { division: 'Metal and Steel Construction', name: 'Steel Deck' },
  { division: 'Metal and Steel Construction', name: 'Steel Joists' },
  { division: 'Metal and Steel Construction', name: 'Structural Steel Erection' },

  // Wood Carpentry and Plastics Construction
  { division: 'Wood Carpentry and Plastics Construction', name: 'Architectural Woodwork' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Architectural Woodwork - Hotels' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Finish Carpentry' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'FRP - Wall Panels' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Glued Laminated Timber' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Heavy Timber Construction' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Plastic Fabrications' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Plastic Laminates' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'PVC Architectural Products' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Rough Carpentry and Wood Framing' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Structural Insulated Panels' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Structural Plastics' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Vinyl Railings' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Wood and Plastic Restoration and Cleaning' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Wood Decking' },
  { division: 'Wood Carpentry and Plastics Construction', name: 'Wood Stairs / Railings' },

  // Roofing, Thermal and Moisture Protection
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Architectural Metals' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Asphalt Shingles' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Damproofing and Waterproofing' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Ethylene Propylene Diene Monomer (EPDM)' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Fascia' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Flashing' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Flat Roof' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Fluid-Applied Membrane Air Barriers' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Green Roofs and Green Walls' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Gutters' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Joint Sealant and Expansion Control' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Metal Roofing' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Polyvinyl Chloride (PVC) Roofing' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Slate Roofing' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Soffit' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Steel Trusses' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Thermoplactic Polyolefin (TPO)' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Tile Roof' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Wood Shake Shingles' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Wood Truss Supplier' },
  { division: 'Roofing, Thermal and Moisture Protection', name: 'Wood Trusses and Sheathing Installer' },

  // Exterior Siding and Masonry
  { division: 'Exterior Siding and Masonry', name: 'Aluminum Composite Material Panels' },
  { division: 'Exterior Siding and Masonry', name: 'Brick Siding' },
  { division: 'Exterior Siding and Masonry', name: 'Corrugated & Ribbed Panels' },
  { division: 'Exterior Siding and Masonry', name: 'Exterior Painting' },
  { division: 'Exterior Siding and Masonry', name: 'Fiber-cement Siding' },
  { division: 'Exterior Siding and Masonry', name: 'Metal Siding' },
  { division: 'Exterior Siding and Masonry', name: 'Stone and Stone Veneer Siding' },
  { division: 'Exterior Siding and Masonry', name: 'Stucco and EIFS' },
  { division: 'Exterior Siding and Masonry', name: 'Vinyl Siding' },
  { division: 'Exterior Siding and Masonry', name: 'Wood Siding' },

  // Doors, Glass and Windows
  { division: 'Doors, Glass and Windows', name: 'Automatic Entrance Doors' },
  { division: 'Doors, Glass and Windows', name: 'Blinds' },
  { division: 'Doors, Glass and Windows', name: 'Coiling Doors and Grilles' },
  { division: 'Doors, Glass and Windows', name: 'Curtain Walls' },
  { division: 'Doors, Glass and Windows', name: 'Detention / Security Doors' },
  { division: 'Doors, Glass and Windows', name: 'Door Hardware and Access Controls' },
  { division: 'Doors, Glass and Windows', name: 'Exterior Doors' },
  { division: 'Doors, Glass and Windows', name: 'Folding Doors and Grille' },
  { division: 'Doors, Glass and Windows', name: 'French Doors' },
  { division: 'Doors, Glass and Windows', name: 'Garage / Overhead Doors' },
  { division: 'Doors, Glass and Windows', name: 'Glass and Mirrors' },
  { division: 'Doors, Glass and Windows', name: 'Glass Coatings' },
  { division: 'Doors, Glass and Windows', name: 'Glass Railings' },
  { division: 'Doors, Glass and Windows', name: 'Glass Restoration' },
  { division: 'Doors, Glass and Windows', name: 'Glazing and Storefronts' },
  { division: 'Doors, Glass and Windows', name: 'Hangar Doors / Vertical Lift Doors' },
  { division: 'Doors, Glass and Windows', name: 'Impact Resistant Doors and Windows' },
  { division: 'Doors, Glass and Windows', name: 'Interior Doors' },
  { division: 'Doors, Glass and Windows', name: 'Shower Doors' },
  { division: 'Doors, Glass and Windows', name: 'Side Folding Gate' },
  { division: 'Doors, Glass and Windows', name: 'Skylights' },
  { division: 'Doors, Glass and Windows', name: 'Sliding Doors' },
  { division: 'Doors, Glass and Windows', name: 'Storm and Screen Doors' },
  { division: 'Doors, Glass and Windows', name: 'Structural Glass' },
  { division: 'Doors, Glass and Windows', name: 'Translucent Glazing' },
  { division: 'Doors, Glass and Windows', name: 'Window Film' },
  { division: 'Doors, Glass and Windows', name: 'Window Treatments' },
  { division: 'Doors, Glass and Windows', name: 'Windows' },

  // Interior Walls, Ceilings and Insulation
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Acoustical Ceiling and Wall Panels' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Drywall Installation' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Finish and Textured Drywall' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Firestopping' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Glass Fiber Reinforced Gypsum (GFRG)' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Plaster Fabrication' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Plastering' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Soundproofing' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Spray Foam Insulation' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Textured Ceiling' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Thermal Insulation' },
  { division: 'Interior Walls, Ceilings and Insulation', name: 'Wall and Ceiling Panels' },

  // Flooring
  { division: 'Flooring', name: 'Athletic Flooring' },
  { division: 'Flooring', name: 'Brick and Stone Flooring' },
  { division: 'Flooring', name: 'Carpet' },
  { division: 'Flooring', name: 'Dance Flooring' },
  { division: 'Flooring', name: 'Epoxy/Resinous Flooring' },
  { division: 'Flooring', name: 'Hardwood Flooring' },
  { division: 'Flooring', name: 'Laminate Flooring' },
  { division: 'Flooring', name: 'Marble Flooring' },
  { division: 'Flooring', name: 'Polished Concrete' },
  { division: 'Flooring', name: 'Raised Access Flooring' },
  { division: 'Flooring', name: 'Sealed Concrete' },
  { division: 'Flooring', name: 'Terrazzo Flooring' },
  { division: 'Flooring', name: 'Tile Flooring' },
  { division: 'Flooring', name: 'Vinyl and VCT Flooring' },

  // Painting and Wallcovering
  { division: 'Painting and Wallcovering', name: 'Caulking' },
  { division: 'Painting and Wallcovering', name: 'Decorative Wall Finishing' },
  { division: 'Painting and Wallcovering', name: 'Electrostatic Painting' },
  { division: 'Painting and Wallcovering', name: 'Painting' },
  { division: 'Painting and Wallcovering', name: 'Plastering' },
  { division: 'Painting and Wallcovering', name: 'Sandblasting' },
  { division: 'Painting and Wallcovering', name: 'Special Coatings' },
  { division: 'Painting and Wallcovering', name: 'Wall Marble, Stone and Tile' },
  { division: 'Painting and Wallcovering', name: 'Wall Paper' },

  // Kitchens and Baths
  { division: 'Kitchens and Baths', name: 'Appliances' },
  { division: 'Kitchens and Baths', name: 'Backsplash' },
  { division: 'Kitchens and Baths', name: 'Bath Fitter' },
  { division: 'Kitchens and Baths', name: 'Bathroom Accessories' },
  { division: 'Kitchens and Baths', name: 'Cabinets / Millwork' },
  { division: 'Kitchens and Baths', name: 'Countertops' },
  { division: 'Kitchens and Baths', name: 'Sink and Disposals' },
  { division: 'Kitchens and Baths', name: 'Vanities and Toilets' },
  { division: 'Kitchens and Baths', name: 'Wall and Decorative Tile' },

  // Electrical and Low Voltage
  { division: 'Electrical and Low Voltage', name: 'Audio / Visual Wiring' },
  { division: 'Electrical and Low Voltage', name: 'Cable / Telephone Wiring' },
  { division: 'Electrical and Low Voltage', name: 'Electric Motor Repair/Rewind Service' },
  { division: 'Electrical and Low Voltage', name: 'Electrical Power' },
  { division: 'Electrical and Low Voltage', name: 'Electrical Wiring / Installation' },
  { division: 'Electrical and Low Voltage', name: 'Electronic Access Control' },
  { division: 'Electrical and Low Voltage', name: 'Firealarms' },
  { division: 'Electrical and Low Voltage', name: 'Generator Installation' },
  { division: 'Electrical and Low Voltage', name: 'Lighting / Fixture / Fan Installation' },
  { division: 'Electrical and Low Voltage', name: 'Security Systems' },
  { division: 'Electrical and Low Voltage', name: 'Solar Panels' },

  // HVAC
  { division: 'HVAC', name: 'Boilers & Radiators' },
  { division: 'HVAC', name: 'Duct Work and Vents' },
  { division: 'HVAC', name: 'Furnace Repair/Replacement' },
  { division: 'HVAC', name: 'Geothermal Energy Systems' },
  { division: 'HVAC', name: 'Heat Pumps' },
  { division: 'HVAC', name: 'HVAC Installation' },
  { division: 'HVAC', name: 'HVAC Repair/Service' },
  { division: 'HVAC', name: 'HVAC, Duct and Vent Cleaning' },
  { division: 'HVAC', name: 'Mechanical Insulation' },
  { division: 'HVAC', name: 'Process Piping' },
  { division: 'HVAC', name: 'Radiant Heating and Cooling Units' },
  { division: 'HVAC', name: 'Refrigeration and Equipment' },
  { division: 'HVAC', name: 'Testing, Adjusting & Balancing' },
  { division: 'HVAC', name: 'Thermostats and Controls' },

  // Plumbing
  { division: 'Plumbing', name: 'Backflow Prevention' },
  { division: 'Plumbing', name: 'Drain Cleaning' },
  { division: 'Plumbing', name: 'Interior Sprinklers' },
  { division: 'Plumbing', name: 'Plumbing Fixtures and Equipment' },
  { division: 'Plumbing', name: 'Plumbing Installation' },
  { division: 'Plumbing', name: 'Plumbing Repair/Service' },
  { division: 'Plumbing', name: 'Septic Systems' },
  { division: 'Plumbing', name: 'Water Heater Installation' },
  { division: 'Plumbing', name: 'Well Drilling and Pumping' },

  // Fire Protection
  { division: 'Fire Protection', name: 'Bi-Directional Amplifier Installation (BDA Systems)' },
  { division: 'Fire Protection', name: 'Fire Alarms' },
  { division: 'Fire Protection', name: 'Fire Suppression' },
  { division: 'Fire Protection', name: 'Fireproofing' },
  { division: 'Fire Protection', name: 'Firestopping' },
  { division: 'Fire Protection', name: 'Interior Sprinklers' },
  { division: 'Fire Protection', name: 'Life Safety - Nurse Call Systems' },
  { division: 'Fire Protection', name: 'Spray Firestopping Foams' },

  // Exterior Improvements and Landscaping
  { division: 'Exterior Improvements and Landscaping', name: 'Asphalt Paving' },
  { division: 'Exterior Improvements and Landscaping', name: 'Awnings / Canopies' },
  { division: 'Exterior Improvements and Landscaping', name: 'Driveways / Patios / Sidewalks' },
  { division: 'Exterior Improvements and Landscaping', name: 'Extruded Aluminum Cover Systems' },
  { division: 'Exterior Improvements and Landscaping', name: 'Fencing and Gates' },
  { division: 'Exterior Improvements and Landscaping', name: 'Fountains and Water Features' },
  { division: 'Exterior Improvements and Landscaping', name: 'Hardscapes and Retaining Walls' },
  { division: 'Exterior Improvements and Landscaping', name: 'Landscape Design' },
  { division: 'Exterior Improvements and Landscaping', name: 'Landscape Maintenance' },
  { division: 'Exterior Improvements and Landscaping', name: 'Landscaping' },
  { division: 'Exterior Improvements and Landscaping', name: 'Line Striping' },
  { division: 'Exterior Improvements and Landscaping', name: 'Outdoor Lighting' },
  { division: 'Exterior Improvements and Landscaping', name: 'Pavers and Stone' },
  { division: 'Exterior Improvements and Landscaping', name: 'Pool and Spa Construction' },
  { division: 'Exterior Improvements and Landscaping', name: 'Screen Enclosures' },
  { division: 'Exterior Improvements and Landscaping', name: 'Solar Outdoor Lighting' },
  { division: 'Exterior Improvements and Landscaping', name: 'Sprinkler/Irrigation Systems' },
  { division: 'Exterior Improvements and Landscaping', name: 'Wild Life Deterrent Fencing' },

  // Cleaning and Construction Maintenance
  { division: 'Cleaning and Construction Maintenance', name: 'Dumpster Service' },
  { division: 'Cleaning and Construction Maintenance', name: 'Maid Service' },
  { division: 'Cleaning and Construction Maintenance', name: 'Portable Toilets' },
  { division: 'Cleaning and Construction Maintenance', name: 'Post-Construction Cleanup' },
  { division: 'Cleaning and Construction Maintenance', name: 'Power Washing' },
  { division: 'Cleaning and Construction Maintenance', name: 'Property Cleanup' },
  { division: 'Cleaning and Construction Maintenance', name: 'Street Sweeping' },
  { division: 'Cleaning and Construction Maintenance', name: 'Waste and Junk Removal' },
  { division: 'Cleaning and Construction Maintenance', name: 'Window Cleaning' },

  // Specialties
  { division: 'Specialties', name: '3D Laser Scanning' },
  { division: 'Specialties', name: 'Aerial Photography' },
  { division: 'Specialties', name: 'Antenna Systems' },
  { division: 'Specialties', name: 'Automatic Vehicular Gates' },
  { division: 'Specialties', name: 'Cast Bronze and Aluminum Plaques' },
  { division: 'Specialties', name: 'Central Vacuum Systems' },
  { division: 'Specialties', name: 'Clocks' },
  { division: 'Specialties', name: 'Closet / Waldrobe Specialties' },
  { division: 'Specialties', name: 'Cubicle Curtain and Track' },
  { division: 'Specialties', name: 'Display Cases and Directories' },
  { division: 'Specialties', name: 'Fall Protection' },
  { division: 'Specialties', name: 'Fire Extinguishers' },
  { division: 'Specialties', name: 'Fireplaces and Stoves' },
  { division: 'Specialties', name: 'Flagpoles' },
  { division: 'Specialties', name: 'Flood Barrier' },
  { division: 'Specialties', name: 'Interior Wall Protection' },
  { division: 'Specialties', name: 'Lighting Design' },
  { division: 'Specialties', name: 'Lockers' },
  { division: 'Specialties', name: 'Louvers and Vents' },
  { division: 'Specialties', name: 'Luminous Egress Path Markings' },
  { division: 'Specialties', name: 'Movable Glass Walls' },
  { division: 'Specialties', name: 'Operable Partitions' },
  { division: 'Specialties', name: 'Partitions' },
  { division: 'Specialties', name: 'Pest Control' },
  { division: 'Specialties', name: 'Postal Specialties / Mailboxes' },
  { division: 'Specialties', name: 'Privacy / Blackout Curtains' },
  { division: 'Specialties', name: 'Restoration - Water / Fire / Mold' },
  { division: 'Specialties', name: 'Roofscreens' },
  { division: 'Specialties', name: 'Safety Padding' },
  { division: 'Specialties', name: 'Sauna / Steam Rooms' },
  { division: 'Specialties', name: 'Security Grills' },
  { division: 'Specialties', name: 'Shower Coatings' },
  { division: 'Specialties', name: 'Signage' },
  { division: 'Specialties', name: 'Signage - Lettering/Graphics' },
  { division: 'Specialties', name: 'Signal / Lighting / IT' },
  { division: 'Specialties', name: 'Slide Poles' },
  { division: 'Specialties', name: 'Storage Shelving' },
  { division: 'Specialties', name: 'Storm Panel / Exterior Shutters' },
  { division: 'Specialties', name: 'Telephone and Intercommunication Equipment' },
  { division: 'Specialties', name: 'Toilet, Bath and Laundry Specialties' },
  { division: 'Specialties', name: 'Vehicle Barriers and Guard Rails' },
  { division: 'Specialties', name: 'Visual Display Boards' },

  // Equipment / Supplies
  { division: 'Equipment / Supplies', name: 'Air Compressors and Vacuum Pumps' },
  { division: 'Equipment / Supplies', name: 'All Other Suppliers' },
  { division: 'Equipment / Supplies', name: 'Athletic and Recreational Equipment' },
  { division: 'Equipment / Supplies', name: 'Audio-Visual Equipment' },
  { division: 'Equipment / Supplies', name: 'Central Vacuum Systems' },
  { division: 'Equipment / Supplies', name: 'Chutes, Compactors, Pneumatic Waste Equipment' },
  { division: 'Equipment / Supplies', name: 'Commercial Laundry and Dry Cleaning Equipment' },
  { division: 'Equipment / Supplies', name: 'Corner Guards' },
  { division: 'Equipment / Supplies', name: 'Crane Services / Rental' },
  { division: 'Equipment / Supplies', name: 'Electrical Supplies' },
  { division: 'Equipment / Supplies', name: 'Food Service Equipment' },
  { division: 'Equipment / Supplies', name: 'Fuel Equipment' },
  { division: 'Equipment / Supplies', name: 'HVAC Equipment' },
  { division: 'Equipment / Supplies', name: 'Lab Equipment / Casework' },
  { division: 'Equipment / Supplies', name: 'Lighting and Fixture Manufacture' },
  { division: 'Equipment / Supplies', name: 'Loading Dock Equipment' },
  { division: 'Equipment / Supplies', name: 'Lumber Suppliers' },
  { division: 'Equipment / Supplies', name: 'Medical Equipment' },
  { division: 'Equipment / Supplies', name: 'Natural Stone Supplier' },
  { division: 'Equipment / Supplies', name: 'Office Equipment' },
  { division: 'Equipment / Supplies', name: 'Parking & Traffic Control' },
  { division: 'Equipment / Supplies', name: 'Playground Equipment' },
  { division: 'Equipment / Supplies', name: 'Plumbing Supplies' },
  { division: 'Equipment / Supplies', name: 'Scaffolding' },
  { division: 'Equipment / Supplies', name: 'Security Furniture / Detention Equipment' },
  { division: 'Equipment / Supplies', name: 'Theater and Stage Equipment' },
  { division: 'Equipment / Supplies', name: 'Vehicle Charging Equipment' },
  { division: 'Equipment / Supplies', name: 'Vending Equipment' },
  { division: 'Equipment / Supplies', name: 'Water Supply and Treatment Equipment' },

  // Décor and Furnishings
  { division: 'Décor and Furnishings', name: 'Art' },
  { division: 'Décor and Furnishings', name: 'Bicycle Racks / Storage' },
  { division: 'Décor and Furnishings', name: 'Booths and Table Seating' },
  { division: 'Décor and Furnishings', name: 'Decorative Metal' },
  { division: 'Décor and Furnishings', name: 'Entrance Flooring and Grilles' },
  { division: 'Décor and Furnishings', name: 'Fabrics' },
  { division: 'Décor and Furnishings', name: 'Fixed Audience Seating' },
  { division: 'Décor and Furnishings', name: 'Furnishing and Accessories' },
  { division: 'Décor and Furnishings', name: 'Furniture' },
  { division: 'Décor and Furnishings', name: 'Hotel Furnishing' },
  { division: 'Décor and Furnishings', name: 'Interior Decorating' },
  { division: 'Décor and Furnishings', name: 'Interior Plants' },
  { division: 'Décor and Furnishings', name: 'Manufactured Casework' },
  { division: 'Décor and Furnishings', name: 'Retail Store Fixtures' },

  // Special Construction
  { division: 'Special Construction', name: 'Aquariums' },
  { division: 'Special Construction', name: 'Artificial Turf' },
  { division: 'Special Construction', name: 'Asbestos Abatement' },
  { division: 'Special Construction', name: 'Asbestos Assessment' },
  { division: 'Special Construction', name: 'Athletic Courts and Tracks - Asphalt' },
  { division: 'Special Construction', name: 'Athletic Fields' },
  { division: 'Special Construction', name: 'Building Automation and Controls' },
  { division: 'Special Construction', name: 'Building Modules' },
  { division: 'Special Construction', name: 'Cathodic Protection / Corrosion Control' },
  { division: 'Special Construction', name: 'Cold Storage - Insulated/Wine Rooms' },
  { division: 'Special Construction', name: 'Controlled Environment Rooms' },
  { division: 'Special Construction', name: 'Ice Rinks' },
  { division: 'Special Construction', name: 'Lead Based Paint Abatement' },
  { division: 'Special Construction', name: 'Lightning Protection' },
  { division: 'Special Construction', name: 'Pool and Spa Construction' },
  { division: 'Special Construction', name: 'Pre-Engineered Structures' },
  { division: 'Special Construction', name: 'Prefabricated Modular Enclosures' },
  { division: 'Special Construction', name: 'Radiation Protection' },
  { division: 'Special Construction', name: 'Restoration - Water / Fire / Mold' },
  { division: 'Special Construction', name: 'Sauna / Steam Rooms' },
  { division: 'Special Construction', name: 'Stadium and Arena Seating' },
  { division: 'Special Construction', name: 'Storage Tanks' },

  // Conveying Systems
  { division: 'Conveying Systems', name: 'Bridge Cranes' },
  { division: 'Conveying Systems', name: 'Dumbwaiters' },
  { division: 'Conveying Systems', name: 'Elevators' },
  { division: 'Conveying Systems', name: 'Escalators and Moving Walks' },
  { division: 'Conveying Systems', name: 'Lifts' },
  { division: 'Conveying Systems', name: 'Monorail Systems' },
  { division: 'Conveying Systems', name: 'Pneumatic Tube Systems' },
  { division: 'Conveying Systems', name: 'Railroad Track Construction' },
  { division: 'Conveying Systems', name: 'Scaffolding' },
  { division: 'Conveying Systems', name: 'Wheelchair Lifts' }
  // Add additional divisions and trade names below in the same format
]

async function main() {
  console.log(' M-1 Seeding PlanHub-style trades...');

  for (const trade of TRADE_SEED) {
    try {
      await prisma.trade.upsert({
        where: { name: trade.name },
        update: {},
        create: trade,
      });
      console.log(`✅ Seeded: ${trade.division} - ${trade.name}`);
    } catch (err: any) {
      console.error(`❌ Failed on: ${trade.name}`, err?.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

