export function download(blob, filename) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  try {
    document.body.appendChild(a);
    a.style = `display: none`;
    a.href = url;
    a.download = filename;
    a.click();
  } finally {
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
