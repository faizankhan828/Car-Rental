import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const WA_NUMBER = '923104330007';
const CONTACT_INFO = [
  { icon: Phone, label: 'Phone', value: '+92 339 1919171 ', href: 'tel:+923391919171', color: 'bg-blue-100 text-blue-600' },
  { icon: Mail, label: 'Email', value: 'raheelkhan888889@gmail.com', href: 'mailto:raheelkhan888889@gmail.com', color: 'bg-purple-100 text-purple-600' },
  { icon: MapPin, label: 'Location', value: 'Lahore, Pakistan', href: null, color: 'bg-red-100 text-red-600' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+92 310 4330007', href: `https://wa.me/${WA_NUMBER}`, color: 'bg-green-100 text-green-600' },
];

export default function Contact() {
  const handleWA = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const msg = e.target.message.value.trim();
    if (!name || !msg) { toast.error('Please fill all fields'); return; }
    const text = encodeURIComponent(`Hi PrimeRide!\n\nMy name is ${name}.\n\n${msg}`);
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');
    e.target.reset();
    toast.success('Opening WhatsApp...');
  };

  return (
    <>
      <Helmet>
        <title>Contact — PrimeRide</title>
        <meta name="description" content="Contact PrimeRide for car rental in Lahore. Call or WhatsApp +92 310 4330007." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Get in Touch</h1>
            <p className="text-gray-500 text-base max-w-lg">We're here to help with your car rental needs. Reach out via any channel below.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Contact details */}
            <div className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors text-sm mt-0.5 block">
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium text-sm mt-0.5">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20want%20to%20book%20a%20car`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#22C35C] text-white font-bold rounded-2xl transition-colors shadow-sm text-sm"
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Start a WhatsApp Chat
              </a>
            </div>

            {/* Message form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Send a Message</h2>
              <form className="space-y-4" onSubmit={handleWA}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Name <span className="text-red-500">*</span></label>
                  <input name="name" type="text" placeholder="Ahmed Khan" required
                    className="w-full py-2.5 px-4 text-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Message <span className="text-red-500">*</span></label>
                  <textarea name="message" placeholder="How can we help you?" rows={4} required
                    className="w-full py-2.5 px-4 text-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <button type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
