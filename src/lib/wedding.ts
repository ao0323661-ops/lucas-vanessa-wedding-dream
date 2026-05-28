/**
 * ============================================================================
 * CONFIGURAÇÃO DO CASAMENTO - LUCAS & VANESSA
 * ============================================================================
 *
 * Dados públicos do convite de Lucas & Vanessa.
 */

import gallery2 from "@/assets/gallery2.jpg";
import gallery4 from "@/assets/gallery4.jpg";

export const WEDDING = {
  // 1. Nomes do casal
  names: {
    bride: "Vanessa",
    groom: "Lucas",
    full: "Lucas & Vanessa",
  },

  // 2. Data e hora
  // Formato: YYYY-MM-DDTHH:mm:ss-03:00 (Brasília)
  date: new Date("2026-08-02T16:00:00-03:00"),
  dateLabel: "2 de agosto de 2026",
  timeLabel: "16:00h",

  // 3. Financeiro / presentes
  pix: {
    key: "sua-chave-pix-aqui@exemplo.com",
    name: "Lucas & Vanessa",
    bank: "Nome do Banco",
  },

  // 4. Lista de cotas de presentes
  gifts: [
    {
      id: "jantar-paris",
      name: "Jantar em Paris",
      amount: 200,
      description: "Uma mesa reservada durante a viagem",
    },
    {
      id: "gondola-veneza",
      name: "Veneza ao fim da tarde",
      amount: 350,
      description: "Um passeio para atravessar a cidade com calma",
    },
    {
      id: "hotel-boutique",
      name: "Diária em Hotel Boutique",
      amount: 800,
      description: "Uma noite bem escolhida no roteiro",
    },
    {
      id: "cafe-da-manha",
      name: "Café da manhã",
      amount: 80,
      description: "Um começo de dia sem pressa",
    },
    {
      id: "brinde-espumante",
      name: "Espumante",
      amount: 50,
      description: "Uma garrafa para uma noite da viagem",
    },
    {
      id: "contribuicao-livre",
      name: "Contribuição livre",
      amount: 0,
      description: "Um valor aberto para compor o roteiro",
    },
  ],

  // 5. Fotos do site
  photos: {
    hero: "/images/capa-casal.jpg",
    gallery: [gallery2, gallery4],
  },
};
