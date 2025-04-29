const cards = import.meta.glob("../assets/cards/*.svg", { eager: true, as: "url" });

const getCardImage = (filename: string): string => {
  return cards[`../assets/cards/${filename}.svg`] as string;
};

export default getCardImage;