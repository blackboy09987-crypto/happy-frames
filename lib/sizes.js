// Standard frame sizes with discount (old -> new). Ek jagah — har jagah yahi use hoti hain,
// isliye naye frame par bhi automatic apply.
export const STANDARD_SIZES = [
  { label: "A5", price: 750, old: 1000 },
  { label: "A4", price: 1150, old: 1500 },
  { label: "A3", price: 2450, old: 2800 },
];
export const BASE_PRICE = 750; // sabse choti size ki new price ("from")

// label -> price (custom frame + validation ke liye)
export const SIZE_PRICE = { A5: 750, A4: 1150, A3: 2450 };
export const SIZE_OLD = { A5: 1000, A4: 1500, A3: 2800 };

// 3-panel SET frames ki pricing (Islamic calligraphy sets etc.)
export const SET_SIZES = [
  { label: "A5", price: 2250 },
  { label: "A4", price: 3200 },
  { label: "A3", price: 6999 },
];
export const SET_BASE_PRICE = 2250;

// 2 se zyada frames (3+) par delivery free
export const FREE_DELIVERY_MIN_QTY = 3;
