// Business details. Edit these; no code changes needed.
// Anything left as '' is hidden on the site or replaced with a "call us" fallback,
// so nothing made-up is ever shown. Fill these in before launch.
export const BIZ = {
  name: 'Inversa Rx',
  optical: 'Inversa Rx Optical',
  pharmacy: 'Inversa Rx Pharmacy',
  neighborhood: 'The Bronx, New York',

  // TODO: fill in before launch
  address: '', // e.g. '123 Example Ave, Bronx, NY 10451'
  mapsUrl: '', // Google Maps link to the storefront
  phone: '', // e.g. '(718) 555-0100'
  email: '',
  hours: [] as { days: string; time: string }[], // e.g. [{ days: 'Mon–Fri', time: '9am–7pm' }]
  insurance: '', // e.g. 'We accept most major vision plans, including …'
  socials: [
    { label: 'Instagram', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'TikTok', url: '' },
  ],

  // From the Jamaica Observer, 19 Nov 2026
  pricing: {
    examWithGlasses: 'Free',
    comprehensive: 'US$75',
  },
  press: {
    outlet: 'Jamaica Observer',
    date: 'November 19, 2026',
    headline: 'Jamaican entrepreneur brings affordable vision care to the Bronx',
    url: 'https://www.jamaicaobserver.com/2026/11/19/jamaican-entrepreneur-brings-affordable-vision-care-bronx/',
  },
};

export const tel = (p: string) => 'tel:' + p.replace(/[^\d+]/g, '');
