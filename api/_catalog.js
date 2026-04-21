// ============================================================
// _catalog.js — Catálogo de produtos (fonte de verdade server-side)
//
// Sincronizado com KD_PRODUCTS em scripts/main.js.
// O backend SEMPRE recalcula o preço a partir daqui.
// Nunca confia no preço ou disponibilidade enviados pelo cliente.
// ============================================================

const PRODUCT_CATALOG = {
  // ── IA ───────────────────────────────────────────────────────
  'chatgpt-pro':        { price: 15, soldOut: false },
  'claude-pro':         { price: 15, soldOut: false },
  'gemini-veo-3':       { price: 10, soldOut: false },
  'manus-4000-credits': { price: 15, soldOut: false },
  // ── Design / Produtividade ───────────────────────────────────
  'canva-pro':          { price: 5,  soldOut: false },
  'capcut-pro':         { price: 7,  soldOut: false },
  // ── Streaming — ativos ───────────────────────────────────────
  'spotify-premium':    { price: 10, soldOut: false },
  'netflix':            { price: 6,  soldOut: false },
  'youtube-premium':    { price: 6,  soldOut: false },
  'iptv':               { price: 8,  soldOut: false },
  'prime-video':        { price: 5,  soldOut: false },
  'paramount-plus':     { price: 6,  soldOut: false },
  'apple-tv':           { price: 6,  soldOut: false },
  // ── Streaming — esgotados ────────────────────────────────────
  'disney-plus':        { price: 6,  soldOut: true  },
  'premiere-sports':    { price: 6,  soldOut: true  },
  'nba-league-pass':    { price: 6,  soldOut: true  }, // alinhado com frontend (era 15)
  // ── Combos ───────────────────────────────────────────────────
  'combo-mais-vendido': { price: 19, soldOut: false },
  'combo-filmes':       { price: 15, soldOut: false },
  // ── Social Media ─────────────────────────────────────────────
  'ig-followers-1k':    { price: 10, soldOut: false },
  'ig-followers-3k':    { price: 20, soldOut: false },
  'ig-followers-5k':    { price: 40, soldOut: false },
  'ig-likes-1k':        { price: 5,  soldOut: false },
  'ig-likes-3k':        { price: 10, soldOut: false },
  'ig-likes-5k':        { price: 25, soldOut: false },
  'ig-views-1k':        { price: 10, soldOut: false },
};

module.exports = { PRODUCT_CATALOG };
