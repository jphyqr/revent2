export const categories = [
  { id: "builds", string: "Custom Builds", type: "standard_service" },
  { id: "services", string: "Construction Services", type: "standard_service" },
  { id: "deals", string: "Best Deals on Materials", type: "promotion" },
  { id: "supplies", string: "Supply Packages", type: "standard_service" },
  { id: "toolRentals", string: "Tool Rentals", type: "standard_service" },
  { id: "plumbingJobs", string: "Plumbing Jobs", type: "promotion" },
  { id: "electricalJobs", string: "Electrical Jobs", type: "standard_service" },
  { id: "carpentryJobs", string: "Carpentry Jobs", type: "standard_service" },
  {
    id: "landscapingJobs",
    string: "Landscaping Jobs",
    type: "standard_service"
  }
];

export const plumbingJobs = [
  { id: "plumbing_drain_clean", string: "Drain Cleaning", type: "service" },
  {
    id: "plumbing_furnace_fix",
    string: "Furnace Maintenance",
    type: "service"
  },
  {
    id: "plumbing_water_heater",
    string: "Water Heater Maintenance",
    type: "service"
  },
  {
    id: "plumbing_air_conditioner",
    string: "A/C Maintenance",
    type: "service"
  },
  { id: "supplies_plumbing", string: "Plumbing Supplies", type: "supply" },
  { id: "deals_fixtures", string: "Deals on Fixtures", type: "deal" }
];

export const electricalJobs = [
  {
    id: "electrical_new_service",
    string: "New Electrical Service",
    type: "service"
  },
  {
    id: "electrical_light_fixtures",
    string: "Light Fixture Install",
    type: "service"
  },
  {
    id: "electrical_fix_plug",
    string: "Receptical Maintenance",
    type: "service"
  },
  {
    id: "electrical_ceiling_fan",
    string: "Ceiling Fan Install",
    type: "service"
  },
  { id: "supplies_electrical", string: "Electrical Supplies", type: "supply" }
];

export const carpentryJobs = [
  { id: "carpentry_framing", string: "Framing Service", type: "service" },
  { id: "carpentry_drywall", string: "Drywall Install", type: "service" },
  { id: "carpentry_windows", string: "Window Install", type: "service" },
  { id: "carpentry_doors", string: "Door Install", type: "service" },
  { id: "carpentry_bracing", string: "Steel Bracing Install", type: "service" }
];

export const landscapingJobs = [
  { id: "landscaping_snow_removal", string: "Snow Removal", type: "service" },
  { id: "landscaping_yard_cleanup", string: "Spring Cleanup", type: "service" },
  { id: "landscaping_supply", string: "Landscape Supplies", type: "supply" },
  { id: "design_landscape", string: "Landscape Design", type: "design" },
  { id: "tools_dumptrailer", string: "Dump Trailer Rental", type: "tool" },

  { id: "tools_skidsteer", string: "Skidsteer Rental", type: "tool" }
];

export const builds = [
  { id: "home", string: "Custom Home Build", type: "service" },
  { id: "kitchen", string: "Kitchen Renovation", type: "service" },
  { id: "bathroom", string: "Bathroom Renovation", type: "service" },
  { id: "basement", string: "Basement Development", type: "service" },
  { id: "garage", string: "Garage Build", type: "service" },

  { id: "addition", string: "Custom Additions", type: "service" }
];

export const services = [
  { id: "services_dumpster", string: "Dumpster Drop Off", type: "service" },
  { id: "services_cleanup", string: "Construction Clean up", type: "service" },
  { id: "services_fence", string: "Fence Rental", type: "service" },
  { id: "services_security", string: "Site Security", type: "service" },
  {
    id: "services_financing",
    string: "Finance your Renovation",
    type: "service"
  }
];

export const designs = [
  { id: "design_structural", string: "Structural Engineer", type: "design" },
  { id: "design_architect", string: "Architects", type: "design" },
  { id: "design_paint", string: "Paint Designers", type: "design" },
  {
    id: "design_landscape",
    string: "Landscape Designers",
    type: "sdesignervice"
  }
];
export const toolRentals = [
  { id: "tools_jackhammer", string: "Jackhammer", type: "tool" },
  { id: "tools_dumptrailer", string: "Dump Trailer", type: "tool" },
  { id: "tools_auger", string: "Auger", type: "tool" },
  { id: "tools_skidsteer", string: "Skidsteer ", type: "tool" }
];

export const supplies = [
  { id: "supplies_paint", string: "Paint", type: "supply" },
  { id: "supplies_mud", string: "Mup and Tape", type: "supply" },
  { id: "supplies_wall", string: "Wall Supplies", type: "supply" },
  { id: "supplies_insulation", string: "Insulation Pack", type: "supply" },
  { id: "supplies_plumbing", string: "Plumbing Pack", type: "supply" },
  { id: "supplies_electrical", string: "Electrical Pack", type: "supply" },
  { id: "supplies_general", string: "General Pack", type: "supply" },
  { id: "supplies_carpentry", string: "Carpentry Pack ", type: "supply" }
];

export const deals = [
  { id: "deals_flooring", string: "Flooring", type: "deal" },
  { id: "deals_fixtures", string: "Fixtures ", type: "deal" },
  { id: "deals_paint", string: "Paint", type: "deal" },
  { id: "deals_tile", string: "Tile ", type: "deal" },
  { id: "deals_lighting", string: "Lighting", type: "deal" }
];

export const allItems = {
  plumbingJobs: plumbingJobs,
  electricalJobs: electricalJobs,
  carpentryJobs: carpentryJobs,
  landscapingJobs: landscapingJobs,
  builds: builds,
  services: services,
  designs: designs,
  toolRentals: toolRentals,
  supplies: supplies,
  deals: deals
};
