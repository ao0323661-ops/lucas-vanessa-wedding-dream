/**
 * ============================================================================
 * CONFIGURAÇÃO DO CASAMENTO - LUCAS & VANESSA
 * ============================================================================
 *
 * Dados públicos do convite de Lucas & Vanessa.
 */

export const WEDDING = {
  // 1. Nomes do casal
  names: {
    bride: "Vanessa",
    groom: "Lucas",
    full: "Lucas & Vanessa",
  },

  // 2. Data e hora
  // Formato: YYYY-MM-DDTHH:mm:ss-03:00 (Brasília)
  date: new Date("2026-08-02T09:00:00-03:00"),
  dateLabel: "2 de agosto de 2026",
  timeLabel: "9h00",

  // 3. Local
  venue: {
    name: "Fazenda do Limoeiro",
    note: "Luz natural e verde ao redor",
  },

  // 4. Financeiro / presentes
  pix: {
    key: "contaff15as@gmail.com",
    name: "Lucas & Vanessa",
    bank: "Nome do Banco",
  },

  // 5. Lista de cotas de presentes
  gifts: [
    {
      id: "passagem",
      name: "Passagem",
      amount: 350,
      description: "Uma ajuda para o caminho dos noivos na viagem",
    },
    {
      id: "hospedagem",
      name: "Hospedagem",
      amount: 500,
      description: "Uma diária tranquila para descansar e aproveitar com calma",
    },
    {
      id: "cafe-manha-noivos",
      name: "Café da manhã dos noivos",
      amount: 80,
      description: "Um começo de dia leve durante a viagem",
    },
    {
      id: "jantar-especial",
      name: "Jantar especial",
      amount: 220,
      description: "Uma noite à mesa para celebrar o começo dessa nova fase",
    },
    {
      id: "passeio-noivos",
      name: "Passeio dos noivos",
      amount: 180,
      description: "Um momento para caminhar, respirar e guardar memórias",
    },
    {
      id: "nossa-viagem",
      name: "Nossa viagem",
      amount: 150,
      description: "Uma contribuição para pequenos momentos do roteiro",
    },
    {
      id: "lua-de-mel",
      name: "Lua de mel",
      amount: 700,
      description: "Um carinho para compor os primeiros dias de casados",
    },
    {
      id: "contribuicao-livre",
      name: "Contribuição livre",
      amount: 0,
      description: "Um valor aberto para participar desse início",
    },
  ],

  // 6. Fotos do site
  photos: {
    hero: "/images/capa-casal.jpg",
    venue: "/images/fazenda-limoeiro.jpeg",
    gallery: [
      "/images/noivos-escadaria.jpeg",
      "/images/noivos-colunas.jpeg",
      "/images/noivos-detalhe-alianca.jpeg",
    ],
  },
};
