function importHead() {
  const head = document.querySelector('head');
  const headHTML = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>쫀쫀단</title>
    <!-- 아이콘 -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <!-- bulma css 관련 -->
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"
    />
  `;
  head.insertAdjacentHTML('beforeend', headHTML);
}

console.time('import');
importHead();
console.timeEnd('import');
