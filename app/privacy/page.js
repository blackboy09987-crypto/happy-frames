import PageShell from "@/components/PageShell";

export const metadata = { title: "Privacy Policy — Happy Frames" };

export default function Privacy() {
  return (
    <PageShell title="Privacy Policy" subtitle="Protecting your information matters to us.">
      <p>This policy explains how Happy Frames collects, uses, and protects your personal information when you use our website (happyframes.online).</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Order details:</strong> name, phone number, delivery address, city.</li>
        <li><strong>Payment info:</strong> payment method and (if you provide it) transaction ID/screenshot. We do not store card details — those are handled by a secure payment gateway (such as PayFast).</li>
        <li><strong>Basic technical data:</strong> browser/website usage (for improvements).</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To process and deliver your order</li>
        <li>To contact you for order confirmation/updates</li>
        <li>For customer support and to improve our service</li>
      </ul>

      <h2>Information sharing</h2>
      <p>We do <strong>not</strong> sell your information. It is only shared with the partners necessary to complete your order (such as courier/delivery and the payment gateway).</p>

      <h2>Data security</h2>
      <p>Payments are SSL-secured and processed through regulated payment gateways. We make every effort to keep your information safe.</p>

      <h2>Your rights</h2>
      <p>You can contact us to view, correct, or delete your information.</p>

      <p className="legal-note">For any questions, see our <a href="/contact">Contact page</a>.</p>
    </PageShell>
  );
}
