// /lib/constants.ts — Global Constants & Maps

export const ROLES = ['gc', 'ae', 'sub', 'supplier', 'admin'] as const;
export const TIERS = [
  'gc_starter',
  'gc_growth',
  'gc_unlimited',
  'ae_professional',
  'ae_enterprise',
  'sub_free',
  'sub_verified_pro',
  'sub_elite_partner',
  'supplier_free',
  'supplier_pro',
] as const;

export const AI_FEATURES = [
  'scope',
  'takeoff',
  'estimate',
  'proposal',
  'schedule',
  'compare',
  'insights',
  'mapper',
  'gap',
  'summary',
  'voice',
];

export const DIVISIONS = {
  '01': 'General Requirements',
  '02': 'Existing Conditions',
  '03': 'Concrete',
  '04': 'Masonry',
  '05': 'Metals',
  '06': 'Wood, Plastics, and Composites',
  '07': 'Thermal and Moisture Protection',
  '08': 'Openings',
  '09': 'Finishes',
  '10': 'Specialties',
  '11': 'Equipment',
  '12': 'Furnishings',
  '13': 'Special Construction',
  '14': 'Conveying Equipment',
  '21': 'Fire Suppression',
  '22': 'Plumbing',
  '23': 'HVAC',
  '26': 'Electrical',
  '31': 'Earthwork',
  '32': 'Exterior Improvements',
  '33': 'Utilities',
  '48': 'Electrical Power Generation'
};
