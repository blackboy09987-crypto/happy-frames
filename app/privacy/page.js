import PageShell from "@/components/PageShell";

export const metadata = { title: "Privacy Policy — Happy Frames" };

export default function Privacy() {
  return (
    <PageShell title="Privacy Policy" subtitle="Aapki maloomat ki hifazat hamare liye ahem hai.">
      <p>Ye policy batati hai ke Happy Frames aapki zaati maloomat kaise jama, istemal aur mehfooz karta hai jab aap hamari website (happyframes.online) istemal karte hain.</p>

      <h2>Hum kya jama karte hain</h2>
      <ul>
        <li><strong>Order details:</strong> naam, phone number, delivery address, sheher.</li>
        <li><strong>Payment info:</strong> payment method aur (agar aap dein) transaction ID/screenshot. Card ki details hum store nahi karte — wo mehfooz payment gateway (jaise PayFast) handle karta hai.</li>
        <li><strong>Basic technical data:</strong> browser/website usage (behtari ke liye).</li>
      </ul>

      <h2>Hum ise kaise istemal karte hain</h2>
      <ul>
        <li>Aapke order ko process aur deliver karne ke liye</li>
        <li>Order confirm/update ke liye aapse rabta karne ke liye</li>
        <li>Customer support aur service behtari ke liye</li>
      </ul>

      <h2>Maloomat sharing</h2>
      <p>Hum aapki maloomat kisi ko <strong>bechte nahi</strong>. Ise sirf order pura karne ke liye zaroori partners (jaise courier/delivery aur payment gateway) ke saath share kiya jata hai.</p>

      <h2>Data security</h2>
      <p>Payments SSL-secured hain aur regulated payment gateways ke zariye process hote hain. Hum aapki maloomat ko mehfooz rakhne ki poori koshish karte hain.</p>

      <h2>Aapke haqooq</h2>
      <p>Aap apni maloomat dekhne, theek karne ya delete karwane ke liye humse rabta kar sakte hain.</p>

      <p className="legal-note">Sawaalat ke liye <a href="/contact">Contact page</a> dekhein.</p>
    </PageShell>
  );
}
