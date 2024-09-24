export function copyToClipboard(value: any) {
  if (!navigator.clipboard) {
    console.error("Clipboard API not supported");
    return;
  }

  navigator.clipboard
    .writeText(value)
    .then(() => {
      console.log("Text copied to clipboard:", value);
      alert(`Text copied to clipboard: ${value}`);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}
