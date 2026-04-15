// ============================================================
// _catalog.js — Catálogo de produtos (fonte de verdade server-side)
//
// Sincronizado com KD_PRODUCTS em scripts/main.js.
// O backend SEMPRE recalcula o preço a partir daqui.
// Nunca confia no preço ou disponibilidade enviados pelo cliente.
// ============================================================

const PRODUCT_CATALOG = {
  'chatgpt-pro':        { price: 15, soldOut: false },
  'claude-pro':         { price: 15, soldOut: false },
  'canva-pro':          { price: 5,  soldOut: false },
  'gemini-veo-3':       { price: 10, soldOut: false },
  'capcut-pro':         { price: 7,  soldOut: false },
  'manus-4000-credits': { price: 15, soldOut: false },
  'spotify-premium':    { price: 10, soldOut: false },
  'netflix':            { price: 6,  soldOut: false },
  'youtube-premium':    { price: 6,  soldOut: false },
  'iptv':               { price: 8,  soldOut: false },
  'prime-video':        { price: 5,  soldOut: false },
  'disney-plus':        { price: 6,  soldOut: true  },
  'premiere-sports':    { price: 6,  soldOut: true  },
  'nba-league-pass':    { price: 15, soldOut: true  },
};

module.exports = { PRODUCT_CATALOG };
