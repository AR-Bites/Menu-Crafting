export async function generateQRCode(text: string): Promise<string> {
  // Simple QR code generation using an online service
  // In a production app, you might want to use a library like qrcode
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  
  try {
    const response = await fetch(qrApiUrl);
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}
