import PageShell from "@/components/PageShell";

export const metadata = { title: "Terms & Conditions — Happy Frames" };

export default function Terms() {
  return (
    <PageShell title="Terms & Conditions" subtitle="Happy Frames istemal karne ki shuraayat.">
      <p>Hamari website istemal karke aur order de kar aap in shuraayat se ittefaq karte hain.</p>

      <h2>Orders</h2>
      <ul>
        <li>Order tabhi confirm hota hai jab hamari team aapse phone/message par confirm kar de.</li>
        <li>Hum kisi bhi order ko reject/cancel karne ka haq rakhte hain (jaise stock na ho ya galat maloomat ho).</li>
        <li>Prices aur availability bina ittila badal sakti hain.</li>
      </ul>

      <h2>Payment</h2>
      <ul>
        <li>Payment options: Cash on Delivery (COD), JazzCash, UPaisa, aur (jald) card/online gateway.</li>
        <li>Online payment ke liye di gayi transaction details sahi honi chahiye.</li>
      </ul>

      <h2>Delivery</h2>
      <ul>
        <li>Delivery poore Pakistan mein available hai. Delivery time area par depend karta hai.</li>
        <li>Delivery charges (agar hon) order confirm karte waqt bata diye jayenge.</li>
      </ul>

      <h2>Product</h2>
      <p>Hum products ko sahi tareeqe se dikhane ki koshish karte hain, lekin screen ke hisaab se rang thoda mukhtalif lag sakta hai. Handcrafted hone ki wajah se mamooli farq mumkin hai.</p>

      <h2>Returns</h2>
      <p>Return/refund ke liye hamari <a href="/refund">Refund & Return Policy</a> dekhein.</p>

      <p className="legal-note">In shuraayat ke baare mein sawaal ho to <a href="/contact">Contact</a> karein.</p>
    </PageShell>
  );
}
