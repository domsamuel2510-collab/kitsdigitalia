// ============================================================
// _catalog-meta.js — Metadados do catálogo para sync com o banco
//
// Mantido em sincronia com KD_PRODUCTS (scripts/main.js).
// Usado exclusivamente pelo syncCatalogProducts em admin.js.
// Não expõe descrições completas nem traduções — apenas o
// mínimo necessário para popular a tabela products no Supabase.
// ============================================================

'use strict';

const CATALOG_META = {
  // ── IA ──────────────────────────────────────────────────────
  'chatgpt-pro':        { name: 'ChatGPT Pro',            category: 'ai'           },
  'claude-pro':         { name: 'Claude Pro',             category: 'ai'           },
  'gemini-veo-3':       { name: 'Gemini Veo 3',           category: 'ai'           },
  'manus-4000-credits': { name: 'Manus 4.000 Credits',    category: 'productivity' },
  // ── Design ──────────────────────────────────────────────────
  'canva-pro':          { name: 'Canva Pro',              category: 'design'       },
  'capcut-pro':         { name: 'CapCut Pro',             category: 'design'       },
  // ── Streaming ───────────────────────────────────────────────
  'spotify-premium':    { name: 'Spotify Premium',        category: 'streaming'                                        },
  'netflix':            { name: 'Netflix',                category: 'streaming', image_url: '/assets/products/netflix.png'    },
  'youtube-premium':    { name: 'YouTube Premium',        category: 'streaming', image_url: '/assets/products/youtube.png'    },
  'iptv':               { name: 'IPTV',                   category: 'streaming', image_url: '/assets/products/iptv.png'       },
  'disney-plus':        { name: 'Disney+ Star',           category: 'streaming', image_url: '/assets/products/disney.png'     },
  'prime-video':        { name: 'Prime Video',            category: 'streaming', image_url: '/assets/products/prime.png'      },
  'premiere-sports':    { name: 'Premiere Sports',        category: 'streaming', image_url: '/assets/products/premiere.png'   },
  'paramount-plus':     { name: 'Paramount+',             category: 'streaming', image_url: '/assets/products/paramount.png'  },
  'apple-tv':           { name: 'Apple TV+',              category: 'streaming', image_url: '/assets/products/appletv.png'    },
  'nba-league-pass':    { name: 'NBA League Pass',        category: 'streaming', image_url: '/assets/products/nba.png'        },
  // ── Combos ──────────────────────────────────────────────────
  'combo-mais-vendido': { name: 'Combo Mais Vendido',     category: 'streaming'                                        },
  'combo-filmes':       { name: 'Combo Filmes',           category: 'streaming'                                        },
  // ── Social Media ────────────────────────────────────────────
  'ig-followers-1k':    { name: '1K Seguidores Instagram', category: 'social'     },
  'ig-followers-3k':    { name: '3K Seguidores Instagram', category: 'social'     },
  'ig-followers-5k':    { name: '5K Seguidores Instagram', category: 'social'     },
  'ig-likes-1k':        { name: '1K Likes Instagram',      category: 'social'     },
  'ig-likes-3k':        { name: '3K Likes Instagram',      category: 'social'     },
  'ig-likes-5k':        { name: '5K Likes Instagram',      category: 'social'     },
  'ig-views-1k':        { name: '1K Views Instagram',      category: 'social'     },
};

module.exports = { CATALOG_META };
