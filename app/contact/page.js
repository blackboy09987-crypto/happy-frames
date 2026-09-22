import PageShell from "@/components/PageShell";

export const metadata = { title: "Contact — Happy Frames" };

export default function Contact() {
  return (
    <PageShell title="Contact Us" subtitle="Have a question or a custom order? Get in touch.">
      <div className="contact-grid">
        <div className="contact-card">
          <span className="contact-ic">📸</span>
          <h3>Instagram</h3>
          <p><a href="https://www.instagram.com/happy.frames_/" target="_blank" rel="noopener">@happy.frames_</a></p>
        </div>
        <div className="contact-card">
          <span className="contact-ic">📱</span>
          <h3>WhatsApp / Call</h3>
          <p><a href="tel:+923392192490">0339 2192490</a></p>
        </div>
        <div className="contact-card">
          <span className="contact-ic">☎️</span>
          <h3>Call / WhatsApp</h3>
          <p><a href="tel:+923332032533">0333 2032533</a></p>
        </div>
      </div>

      <h2>About your order</h2>
      <p>For order details or status, message us on Instagram or WhatsApp/call the numbers above. Need a custom size or design? Get in touch and we'll be happy to help.</p>

      <h2>Business hours</h2>
      <p>Monday – Saturday, 11:00 AM – 8:00 PM (PKT)</p>
    </PageShell>
  );
}
