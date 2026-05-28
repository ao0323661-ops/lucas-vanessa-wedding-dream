/**
 * ============================================================================
 * CONFIGURAÇÃO DO CASAMENTO - LUCAS & VANESSA
 * ============================================================================
 *
 * Este é o único arquivo que você precisa editar para personalizar o site.
 * Altere os valores abaixo com as informações reais do seu grande dia.
 */

import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
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
  dateLabel: "2 de Agosto de 2026",
  timeLabel: "16:00h",

  // 3. Frase de destaque (hero)
  heroPhrase: "E entre todos os olhares do mundo, encontrei o seu.",

  // 4. Financeiro / presentes
  pix: {
    key: "sua-chave-pix-aqui@exemplo.com",
    name: "Lucas & Vanessa",
    bank: "Nome do Banco",
  },

  // 5. Nossa história (linha do tempo)
  timeline: [
    {
      year: "2018",
      title: "O primeiro capítulo",
      text: "Lucas e Vanessa começaram a escrever uma história feita de encontros, cuidado e parceria.",
    },
    {
      year: "2020",
      title: "Planos compartilhados",
      text: "Entre conversas, sonhos e pequenas escolhas, o futuro dos dois foi ganhando forma.",
    },
    {
      year: "2022",
      title: "A vida a dois",
      text: "A rotina mostrou que o amor também mora nos detalhes simples de todos os dias.",
    },
    {
      year: "2024",
      title: "O pedido",
      text: "Veio o sim que confirmou o que o coração dos dois já sabia.",
    },
    {
      year: "2026",
      title: "O grande dia",
      text: "Lucas e Vanessa celebram essa nova etapa com as pessoas que fazem parte da história.",
    },
  ],

  // 6. Lista de cotas de presentes (lua de mel)
  gifts: [
    {
      id: "jantar-paris",
      name: "Jantar Romântico em Paris",
      amount: 200,
      description: "Um brinde aos primeiros dias de casados",
    },
    {
      id: "gondola-veneza",
      name: "Passeio em Gôndola em Veneza",
      amount: 350,
      description: "Uma lembrança especial da lua de mel",
    },
    {
      id: "hotel-boutique",
      name: "Diária em Hotel Boutique",
      amount: 800,
      description: "Uma noite de descanso para o casal",
    },
    {
      id: "cafe-da-manha",
      name: "Cota Café da Manhã",
      amount: 80,
      description: "Para Lucas e Vanessa começarem o dia com carinho",
    },
    {
      id: "brinde-espumante",
      name: "Brinde com Espumante",
      amount: 50,
      description: "Um brinde à nossa união",
    },
    {
      id: "contribuicao-livre",
      name: "Contribuição Livre",
      amount: 0,
      description: "Um carinho livre para a nova etapa do casal",
    },
  ],

  // 7. Fotos do site
  photos: {
    hero: "/images/capa-casal.jpg",
    gallery: [gallery1, gallery2, gallery3, gallery4, gallery1, gallery3],
  },
};
