import ContactClient from './ContactClient';

export const metadata = {
  title: 'Enquire — Editorial Wedding Photographer Toronto | Fotogracia',
  description:
    'Get in touch with Fotogracia to discuss your wedding, portrait session, or creative project. Toronto and GTA-based. Limited wedding dates each season.',
  alternates: {
    canonical: 'https://fotogracia.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
