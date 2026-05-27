/**
 * ============================================================================
 * CONFIGURAÇÃO DO CASAMENTO — LUCAS & VANESSA
 * ============================================================================
 * 
 * Este é o único arquivo que você precisa editar para personalizar o site.
 * Altere os valores abaixo com as informações reais do seu grande dia.
 */

import heroImg from "@/assets/hero.jpg";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";

export const WEDDING = {
  // 1. Nomes do Casal
  names: {
    bride: "Vanessa",
    groom: "Lucas",
    full: "Lucas & Vanessa"
  },
  
  // 2. Data e Hora
  // Formato: YYYY-MM-DDTHH:mm:ss-03:00 (Brasília)
  date: new Date("2026-08-02T16:00:00-03:00"),
  dateLabel: "2 de Agosto de 2026",
  timeLabel: "16:00h",
  
  // 3. Frase de Destaque (Hero)
  heroPhrase: "E entre todos os olhares do mundo, encontrei o seu.",
  
  // 4. Locais (Cerimônia e Festa)
  ceremony: {
    name: "Igreja Matriz", // Substitua pelo nome real
    address: "Rua Exemplo, 123 — Centro, Cidade, Estado",
    time: "16h00",
    mapsUrl: "https://www.google.com/maps", // Link do Google Maps
  },
  
  reception: {
    name: "Espaço de Eventos", // Substitua pelo nome real
    address: "Av. Exemplo, 456 — Bairro, Cidade, Estado",
    time: "19h00",
    mapsUrl: "https://www.google.com/maps",
  },
  
  // 5. Financeiro / Presentes
  pix: {
    key: "sua-chave-pix-aqui@exemplo.com", // CHAVE PIX REAL
    name: "Lucas & Vanessa",
    bank: "Nome do Banco",
  },
  
  // 6. Nossa História (Linha do Tempo)
  timeline: [
    { 
      year: "2018", 
      title: "Onde tudo começou", 
      text: "Um olhar despretensioso numa noite de inverno mudou tudo." 
    },
    { 
      year: "2020", 
      title: "Primeira viagem", 
      text: "Lisboa nos ensinou que casa é a pessoa, não o lugar." 
    },
    { 
      year: "2022", 
      title: "Nossa primeira casa", 
      text: "Um apartamento pequeno, um amor enorme." 
    },
    { 
      year: "2024", 
      title: "O pedido", 
      text: "Ele se ajoelhou. Ela chorou. Ambos disseram sim." 
    },
    { 
      year: "2026", 
      title: "O grande dia", 
      text: "Agora celebramos com você, ao nosso lado." 
    },
  ],
  
  // 7. Lista de Cotas de Presentes (Lua de Mel)
  gifts: [
    { name: "Jantar Romântico em Paris", amount: 200, description: "Uma noite especial na cidade luz" },
    { name: "Passeio em Gôndola em Veneza", amount: 350, description: "Um momento clássico na Itália" },
    { name: "Diária em Hotel Boutique", amount: 800, description: "Uma noite de descanso e luxo" },
    { name: "Cota Café da Manhã", amount: 80, description: "Para começarmos o dia bem" },
    { name: "Brinde com Espumante", amount: 50, description: "Um brinde à nossa união" },
    { name: "Contribuição Livre", amount: 0, description: "Contribua com o valor que desejar" },
  ],
  
  // 8. Fotos do Site
  photos: {
    hero: heroImg,
    gallery: [
      gallery1, 
      gallery2, 
      gallery3, 
      gallery4, 
      gallery1, 
      gallery3
    ]
  }
};
