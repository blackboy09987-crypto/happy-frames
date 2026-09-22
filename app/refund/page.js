import PageShell from "@/components/PageShell";

export const metadata = { title: "Refund & Return Policy — Happy Frames" };

export default function Refund() {
  return (
    <PageShell title="Refund & Return Policy" subtitle="Your satisfaction is our responsibility.">
      <h2>7-Day Return</h2>
      <p>If there is any issue within <strong>7 days</strong> of receiving your product — such as a damaged, defective, or wrong item — you can contact us for a return/replacement. The product must be in its original condition and packing.</p>

      <h2>Damaged or wrong product</h2>
      <p>If a frame arrives broken or defective, please notify us within <strong>24 hours</strong> on Instagram/WhatsApp with an unboxing photo/video. We'll provide a free replacement or a full refund.</p>

      <h2>How refunds work</h2>
      <ul>
        <li>Once a return is approved, the refund is processed within <strong>5–7 working days</strong>.</li>
        <li>Online payments (card/JazzCash/UPaisa) are returned to the same account.</li>
        <li>COD orders are refunded via bank transfer/wallet.</li>
      </ul>

      <h2>What cannot be returned</h2>
      <ul>
        <li>Custom-made / personalized frames (unless defective)</li>
        <li>Products that have been used or damaged (by the customer)</li>
        <li>After 7 days have passed</li>
      </ul>

      <h2>Cancellation</h2>
      <p>An order can be cancelled before it is dispatched. After dispatch, the return policy applies.</p>

      <p className="legal-note">To request a return, reach us via the <a href="/contact">Contact page</a>.</p>
    </PageShell>
  );
}
