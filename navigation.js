/* История переходов внутри сайта. Работает и при открытии HTML с диска. */
(() => {
  const pages = ['index.html', 'Info.html', 'History.html', 'Disc.html',
    'Film.html', 'Links.html', 'Shop.html', 'Contact.html'];
  const current = decodeURIComponent(location.pathname.split('/').pop()) || 'index.html';
  const key = 'ice-archive-navigation:' + location.pathname.slice(0, location.pathname.lastIndexOf('/'));
  let trail = [];
  const read = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || '[]');
      return Array.isArray(saved) ? saved.filter(name => pages.includes(name)) : [];
    } catch { return []; }
  };
  const save = () => {
    try { sessionStorage.setItem(key, JSON.stringify(trail.slice(-100))); } catch {}
  };
  const update = () => {
    trail = read();
    if (trail[trail.length - 1] !== current) trail.push(current);
    save();
    const previous = trail.length > 1 ? trail[trail.length - 2] : 'index.html';
    document.querySelectorAll('[data-back]').forEach(link => {
      link.href = previous;
      link.title = trail.length > 1 ? 'Вернуться в предыдущий раздел' : 'Вернуться на главную';
    });
  };
  update();
  window.addEventListener('pageshow', update);
  document.querySelectorAll('[data-back]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      // Ссылки-якоря не добавляются в историю разделов.
      trail = read();
      if (trail[trail.length - 1] === current) trail.pop();
      save();
    });
  });
})();
