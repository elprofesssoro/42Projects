import { API_BASE } from "../../api/api";

export  function resolveImageUrl(img) {
  if (!img)
      return "/img/player_default.png";
  if (/^https?:\/\//i.test(img))
      return img;
  if (img.startsWith("/uploads/"))
      return `${API_BASE}${img}`;
  return img;
}
