export function copyToClipboard(value: any) {
  if (!navigator.clipboard) {
    console.error("Clipboard API not supported");
    return;
  }

  const textToCopy = String(value);

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      console.log("Text copied to clipboard:", textToCopy);
      alert(`Text copied to clipboard: ${textToCopy}`);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}
