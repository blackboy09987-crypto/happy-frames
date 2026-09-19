import PageShell from "@/components/PageShell";

export const metadata = { title: "Refund & Return Policy — Happy Frames" };

export default function Refund() {
  return (
    <PageShell title="Refund & Return Policy" subtitle="Aapki santushti hamari zimmedari hai.">
      <h2>7-Day Return</h2>
      <p>Agar aapko product milne ke <strong>7 din</strong> ke andar koi masla ho — jaise damaged, defective, ya galat item — to aap return/replacement ke liye rabta kar sakte hain. Product original condition aur packing mein hona chahiye.</p>

      <h2>Damaged ya galat product</h2>
      <p>Agar frame delivery ke waqt toota hua ya defective mile, to <strong>24 ghante</strong> ke andar humein Instagram/email par unboxing ki photo/video ke saath ittila dein. Hum free replacement ya full refund denge.</p>

      <h2>Refund ka tareeqa</h2>
      <ul>
        <li>Return approve hone ke baad refund <strong>5–7 working days</strong> mein process hota hai.</li>
        <li>Online payment (card/JazzCash/UPaisa) wapas usi account mein aayega.</li>
        <li>COD orders ka refund bank transfer/wallet ke zariye kiya jayega.</li>
      </ul>

      <h2>Kya return nahi ho sakta</h2>
      <ul>
        <li>Custom-made / personalized frames (jab tak defective na hon)</li>
        <li>Wo products jo istemal kiye gaye ya damaged kiye gaye hon (customer ki taraf se)</li>
        <li>7 din guzarne ke baad</li>
      </ul>

      <h2>Cancellation</h2>
      <p>Order dispatch hone se pehle cancel kiya ja sakta hai. Dispatch ke baad return policy lagoo hogi.</p>

      <p className="legal-note">Return ke liye <a href="/contact">Contact page</a> se rabta karein.</p>
    </PageShell>
  );
}
