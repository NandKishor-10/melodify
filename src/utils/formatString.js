export default function formateString(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
