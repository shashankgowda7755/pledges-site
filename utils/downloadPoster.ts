import html2canvas from 'html2canvas';

export const generateImageBlob = async (element: HTMLElement): Promise<Blob | null> => {
  if (!element) return null;
  
  try {
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Prevent Extension Crashes (React Minified Error 299)
    clone.removeAttribute('id');
    clone.setAttribute('data-gramm', 'false');
    const children = clone.querySelectorAll('*');
    children.forEach(child => child.removeAttribute('id'));

    clone.style.position = 'fixed';
    clone.style.top = '-10000px';
    clone.style.left = '-10000px';
    clone.style.width = '800px';
    clone.style.height = `${(800 * 2048) / 1448}px`; // Maintain aspect ratio
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    
    const nameElement = clone.querySelector('h2');
    if (nameElement) {
      nameElement.style.fontSize = '32px';
    }
    
    document.body.appendChild(clone);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    });
    
    document.body.removeChild(clone);
    return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  } catch (err) {
    console.error("Error generating image:", err);
    const clone = document.body.lastElementChild;
    if (clone && (clone as HTMLElement).style?.top === '-10000px') {
      document.body.removeChild(clone);
    }
    return null;
  }
};

export const downloadPoster = async (element: HTMLElement, userName: string, prefix = 'Pledge'): Promise<void> => {
  const blob = await generateImageBlob(element);
  
  if (blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prefix}_${userName.replace(/\s+/g, '_')}_PledgeMarks.png`;
    
    // Avoid appending link to DOM to prevent extension observers from crashing React
    link.click();
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

export const sharePoster = async (element: HTMLElement, userName: string, pledgeUrl: string): Promise<void> => {
  const blob = await generateImageBlob(element);
  if (!blob) return;
  
  const file = new File([blob], 'pledge_poster.png', { type: 'image/png' });
  
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My PledgeMarks Pledge',
        text: `I just took a pledge on PledgeMarks. Join me! ${pledgeUrl}`,
      });
    } catch { /* user cancelled */ }
  } else {
    // Fallback to download if sharing is not supported
    await downloadPoster(element, userName);
  }
};
