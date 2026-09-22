import PageShell from "@/components/PageShell";

export const metadata = { title: "Terms & Conditions — Happy Frames" };

export default function Terms() {
  return (
    <PageShell title="Terms & Conditions" subtitle="The basics of using Happy Frames.">
      <p>By using our website and placing an order, you agree to these terms.</p>

      <h2>Orders</h2>
      <ul>
        <li>An order is confirmed only once our team confirms it with you by phone/message.</li>
        <li>We reserve the right to reject/cancel any order (e.g. out of stock or incorrect information).</li>
        <li>Prices and availability may change without notice.</li>
      </ul>

      <h2>Payment</h2>
      <ul>
        <li>Payment options: Cash on Delivery (COD), JazzCash, UPaisa, and (soon) card/online gateway.</li>
        <li>Transaction details provided for online payments must be accurate.</li>
      </ul>

      <h2>Delivery</h2>
      <ul>
        <li>Delivery is available all across Pakistan. Delivery time depends on your area.</li>
        <li>Delivery charges (if any) will be confirmed when your order is confirmed.</li>
      </ul>

      <h2>Product</h2>
      <p>We try to display our products accurately, but colours may look slightly different depending on your screen. As items are handcrafted, minor variations are possible.</p>

      <h2>Returns</h2>
      <p>For returns/refunds, please see our <a href="/refund">Refund & Return Policy</a>.</p>

      <p className="legal-note">If you have any questions about these terms, please <a href="/contact">contact us</a>.</p>
    </PageShell>
  );
}
