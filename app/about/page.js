import PageShell from "@/components/PageShell";

export const metadata = { title: "About Us — Happy Frames" };

export default function About() {
  return (
    <PageShell title="About Happy Frames" subtitle="Frames that make you happy.">
      <p>Happy Frames ek Pakistan-based handcrafted photo frames brand hai. Hum aapki khoobsurat yaadon ko ek premium ghar dete hain — solid material, custom sizes, aur aise designs jo har deewar ko muskuraahat de.</p>

      <h2>Hum kya banate hain</h2>
      <ul>
        <li>Classic, minimal, vintage aur collage wall frames</li>
        <li>Custom sizes (A5, A4, A3 aur zyada) — aapki pasand ke hisaab se</li>
        <li>Scratch-proof finish jo saalon chale</li>
      </ul>

      <h2>Hamara wada</h2>
      <p>Quality material, saaf-suthri packing, aur poore Pakistan mein safe delivery. Aapki santushti hamari pehli tarjeeh hai.</p>

      <h2>Rabta (Contact)</h2>
      <p>Instagram: <a href="https://www.instagram.com/happy.frames_/" target="_blank" rel="noopener">@happy.frames_</a><br />
      Aur detail ke liye <a href="/contact">Contact page</a> dekhein.</p>
    </PageShell>
  );
}
