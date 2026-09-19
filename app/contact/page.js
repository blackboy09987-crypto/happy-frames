import PageShell from "@/components/PageShell";

export const metadata = { title: "Contact — Happy Frames" };

export default function Contact() {
  return (
    <PageShell title="Contact Us" subtitle="Koi sawaal ya custom order? Hum se rabta karein.">
      <div className="contact-grid">
        <div className="contact-card">
          <span className="contact-ic">📸</span>
          <h3>Instagram</h3>
          <p><a href="https://www.instagram.com/happy.frames_/" target="_blank" rel="noopener">@happy.frames_</a></p>
        </div>
        <div className="contact-card">
          <span className="contact-ic">✉️</span>
          <h3>Email</h3>
          <p><a href="mailto:support@happyframes.online">support@happyframes.online</a></p>
        </div>
        <div className="contact-card">
          <span className="contact-ic">📱</span>
          <h3>WhatsApp / Call</h3>
          <p>0339 2192490</p>
        </div>
      </div>

      <h2>Order ke baare mein</h2>
      <p>Apne order ki tafseel ya status ke liye humein Instagram par message karein ya email bhejein. Custom size/design chahiye to bhi rabta karein — hum aapki madad karenge.</p>

      <h2>Business hours</h2>
      <p>Monday – Saturday, 11:00 AM – 8:00 PM (PKT)</p>
    </PageShell>
  );
}
