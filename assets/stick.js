const collections = [
  { id: 'sticker/business', name: '學霸', folder: '學霸', prefix: 'e', count: 7, color: '#806b9b' },
  { id: 'sticker/maruko', name: '小丸子', folder: '小丸子', prefix: 'b', count: 11, extras: ['sticker-sticker_thinking-transparent.png'], color: '#e66f55' },
  { id: 'sticker/milk', name: '牛奶妹', folder: '牛奶妹', prefix: 'm', count: 11, extras: ['sticker-sticker_thinking-transparent.png'], color: '#d19b43' },
  { id: 'sticker/shin', name: '蠟筆小新', folder: '蠟筆小新', prefix: 'p', count: 12, color: '#517ea7' },
  { id: 'sticker/chef', name: '廚師', folder: '廚師', count: 8, files: ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png'], color: '#b8664c' }
];

const gallery = document.querySelector('#gallery');
const totalCount = collections.reduce((sum, collection) => sum + (collection.count || 0) + (collection.extras?.length || 0) + (collection.files?.length || 0), 0);
document.querySelector('#total-count').textContent = `${totalCount} stickers · 5 characters`;

const downloadIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>';

const buildStickerList = (collection) => {
  if (Array.isArray(collection.files) && collection.files.length > 0) {
    return [...collection.files, ...(collection.extras || [])];
  }

  const generated = Array.from({ length: collection.count || 0 }, (_, index) => `${collection.prefix}${index + 1}.png`);
  return [...generated, ...(collection.extras || [])];
};

const candidatePaths = (collection, fileName) => {
  const folderName = collection.folder ? String(collection.folder).trim() : '';
  const candidates = [];

  if (folderName) {
    candidates.push(`./sticker/${folderName}/${fileName}`);
    candidates.push(`./${folderName}/${fileName}`);
  }

  candidates.push(`./sticker/${fileName}`);
  candidates.push(`./${fileName}`);

  return [...new Set(candidates.map((candidate) => encodeURI(candidate)))];
};

collections.forEach((collection) => {
  const section = document.createElement('section');
  section.className = 'character-section';
  section.id = collection.id;
  section.style.setProperty('--accent', collection.color);

  const stickerFiles = buildStickerList(collection);
  section.innerHTML = `<div class="section-heading"><h3>${collection.name}</h3><p>${String(stickerFiles.length).padStart(2, '0')} PIECES</p></div><div class="sticker-grid"></div>`;

  const grid = section.querySelector('.sticker-grid');

  stickerFiles.forEach((fileName, index) => {
    const stickerNumber = index + 1;
    const card = document.createElement('article');
    card.className = 'sticker-card';
    card.style.animationDelay = `${Math.min(stickerNumber * 35, 450)}ms`;

    const imageCandidates = candidatePaths(collection, fileName);
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = `${collection.name} 貼圖 ${stickerNumber}`;
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';

    let candidateIndex = 0;
    const tryNextImage = () => {
      const nextPath = imageCandidates[candidateIndex];
      if (!nextPath) {
        img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#f4f4f6"/><text x="150" y="150" text-anchor="middle" fill="#a1a1aa" font-size="24" font-family="sans-serif">Sticker</text></svg>');
        return;
      }

      img.src = nextPath;
      candidateIndex += 1;
    };

    img.onerror = tryNextImage;
    tryNextImage();

    const downloadLink = document.createElement('a');
    downloadLink.className = 'download-button';
    downloadLink.href = imageCandidates[0];
    downloadLink.download = `${collection.name}-${stickerNumber}.png`;
    downloadLink.innerHTML = `${downloadIcon}<span>下載</span>`;

    const art = document.createElement('div');
    art.className = 'sticker-art';
    art.appendChild(img);

    const footer = document.createElement('div');
    footer.className = 'card-footer';
    footer.innerHTML = `<span class="sticker-number">${String(stickerNumber).padStart(2, '0')}</span>`;
    footer.appendChild(downloadLink);

    card.appendChild(art);
    card.appendChild(footer);
    grid.appendChild(card);
  });

  gallery.appendChild(section);
});
