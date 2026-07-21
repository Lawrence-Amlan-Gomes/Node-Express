// A real value that changes on ITS OWN schedule — standing in for a real
// stock price, a live score, anything a server updates independently of
// whether any client has ever asked about it.
let currentPrice = 100;
let lastChangedAt = Date.now();

// Ticks the real price on a real interval — completely separate from any
// HTTP request. This is the thing polling has to keep asking about.
export function startPriceTicker() {
  return setInterval(() => {
    const randomWalk = (Math.random() - 0.5) * 4; // a real random change, -2 to +2
    currentPrice = Math.round((currentPrice + randomWalk) * 100) / 100;
    lastChangedAt = Date.now();
  }, 900);
}

// The only thing a polling client can ever do: ask "what's the value RIGHT
// NOW?" — there's no way for it to ask "tell me when it changes."
export function getLatestPrice(req, res) {
  res.json({ price: currentPrice, changedAt: lastChangedAt });
}
