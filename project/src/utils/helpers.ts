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

// Utility to generate the type of the data dynamically
export const generateType = <T>(data: T): T => data;
// type ApiResponseType = ReturnType<typeof generateType<typeof data>>;