const startingX = 83;
const startingY = 47;

function generateNametagsPDF(infos) {
  const pdf = html2pdf();
  const opt = {
    jsPDF: {
      unit: 'px',
      orientation: 'l',
      format: 'letter',
      hotfixes: ['px_scaling'],
    },
    html2canvas: {
      scale: 6,
    },
  };

  const file = document.createElement('div');
  file.className = 'pdf file';

  while (infos.length > 0) {
    file.appendChild(generateFrontPage(infos.splice(0, 8)));
    file.appendChild(generateBackPage());
  }
  pdf.set(opt).from(file).save('NameTags.pdf');
}

function generateFrontPage(infos) {
  const page = document.createElement('div');
  page.className = 'page';

  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.style.position = 'absolute';
  grid.style.left = `${startingX}px`;
  grid.style.top = `${startingY}px`;

  infos.forEach((info) => {
    const card = generateSingleTag(info);
    grid.appendChild(card);
  });

  page.appendChild(grid);

  return page;
}

function generateBackPage(offsetX = 0, offsetY = 0) {
  const page = document.createElement('div');
  page.className = 'page';

  const grid = document.createElement('div');
  grid.className = 'grid';
  grid.style.position = 'absolute';
  grid.style.left = `${startingX + offsetX}px`;
  grid.style.top = `${startingY + offsetY}px`;

  for (let i = 0; i < 8; i++) {
    grid.appendChild(generateBackCard());
  }

  page.appendChild(grid);

  return page;
}

function generateBackCard() {
  const div = document.createElement('div');
  div.className = 'card container back';

  const en = document.createElement('div');
  en.className = 'card back message';
  en.innerText =
    'This name tag will be reused for future retreat. Please return it before leaving.';

  const kr = document.createElement('div');
  kr.className = 'card back message';
  kr.innerText = '다음 수련회에서 명찰을 재사용 하오니 꼭 반납 부탁드립니다.';

  const sp = document.createElement('div');
  sp.className = 'card back message';
  sp.innerText = 'Por favor DEVUELVA el gafete para futuro uso.';

  const ch = document.createElement('div');
  ch.className = 'card back message';
  ch.innerText =
    '名牌标签套皮将会在每次培灵会反 复使用，请大家离开前退还名牌标 签套皮。多谢配合!';

  div.appendChild(en);
  div.appendChild(kr);
  div.appendChild(sp);
  div.appendChild(ch);

  return div;
}

function generateSingleTag(info) {
  const div = document.createElement('div');
  div.className = 'card container';

  const img = document.createElement('img');
  img.className = 'card img';
  img.src = info.bgpath;

  const content = document.createElement('div');
  content.className = 'card content';

  const church = document.createElement('div');
  church.className = 'card church';
  church.innerText = info.church;

  const name = document.createElement('div');
  if (info.firstname.length > 10 || info.lastname.length > 10) {
    name.className = 'card name long';
  } else {
    name.className = 'card name';
  }
  name.innerHTML = `<div>${info.firstname}</div><div>${info.lastname}</div>`;

  const group = document.createElement('div');
  group.className = 'card group';
  group.innerText = info.group;

  content.appendChild(church);
  content.appendChild(name);
  content.appendChild(group);

  div.appendChild(img);
  div.appendChild(content);

  return div;
}
