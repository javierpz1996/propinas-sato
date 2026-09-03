export async function downloadOriginalFile(url: string, filename: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo descargar el archivo");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename || "imagen";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
