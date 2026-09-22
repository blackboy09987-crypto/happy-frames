import PageShell from "@/components/PageShell";

export const metadata = { title: "About Us — Happy Frames" };

export default function About() {
  return (
    <PageShell title="About Happy Frames" subtitle="Frames that make you happy.">
      <p>Happy Frames is a Pakistan-based handcrafted photo frames brand. We give your beautiful memories a premium home — solid materials, custom sizes, and designs that bring a smile to every wall.</p>

      <h2>What we make</h2>
      <ul>
        <li>Classic, minimal, vintage and collage wall frames</li>
        <li>Custom sizes (A5, A4, A3 and more) — made to your choice</li>
        <li>Scratch-proof finish that lasts for years</li>
      </ul>

      <h2>Our promise</h2>
      <p>Quality materials, clean packing, and safe delivery all across Pakistan. Your satisfaction is our top priority.</p>

      <h2>Contact</h2>
      <p>Instagram: <a href="https://www.instagram.com/happy.frames_/" target="_blank" rel="noopener">@happy.frames_</a><br />
      For more details, see our <a href="/contact">Contact page</a>.</p>
    </PageShell>
  );
}
