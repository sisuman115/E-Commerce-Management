import iphone14Pro from "./iphone-14-pro.jpg";
import poloTshirt from "./polo-tshirt.jpg";
import samsungGalaxyS24 from "./samsung-galaxy-s24.jpg";
import sonyWh1000xm5 from "./sony-wh-1000xm5.jpg";
import nikeAirMax270 from "./nike-air-max-270.jpg";
import adidasUltraboost from "./adidas-ultraboost.jpg";
import dellInspiron15 from "./dell-inspiron-15.jpg";
import casioGShock from "./casio-g-shock.jpg";
import levis511Jeans from "./levis-511-jeans.jpg";
import jblFlip6 from "./jbl-flip-6.jpg";

const productImages = {
  "iphone 14 pro": iphone14Pro,
  "polo t-shirt": poloTshirt,
  "samsung galaxy s24": samsungGalaxyS24,
  "sony wh-1000xm5 headphones": sonyWh1000xm5,
  "nike air max 270": nikeAirMax270,
  "adidas ultraboost shoes": adidasUltraboost,
  "dell inspiron 15 laptop": dellInspiron15,
  "casio g-shock watch": casioGShock,
  "levi's 511 jeans": levis511Jeans,
  "jbl flip 6 speaker": jblFlip6,
};

export function getProductImage(productName) {
  if (!productName) {
    return null;
  }

  return productImages[productName.trim().toLowerCase()] || null;
}

export default productImages;