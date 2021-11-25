const startingX = 24;
const startingY = 96;

async function generateNametagsPDF(infos) {
  console.log(infos);
  const pdf = html2pdf();
  const opt = {
    jsPDF: {
      unit: 'px',
      orientation: 'p',
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
    file.appendChild(generateFrontPage(infos.splice(0, 3)));
  }
  await pdf.set(opt).from(file).save('NameTags.pdf');
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
    grid.appendChild(card.cloneNode(true));
  });

  page.appendChild(grid);

  return page;
}

function generateSingleTag(info) {
  const div = document.createElement('div');
  div.className = 'card container';

  const img = document.createElement('img');
  img.className = 'card img';
  img.src = 'img/bg.png';

  const content = document.createElement('div');
  content.className = 'card content';

  const church = document.createElement('div');
  church.className = 'card church';
  const churcnName = info.church + ' Church';
  church.innerText = churcnName.toUpperCase();

  const lodge = document.createElement('div');
  lodge.className = 'card lodge box';

  const lodgeLogo = document.createElement('img');
  lodgeLogo.className = 'card lodge logo';
  lodgeLogo.src = 'img/lodge.png';

  lodge.append(lodgeLogo);

  if (info.lodgeEN != 'Hotel') {
    const lodgeEN = document.createElement('div');
    lodgeEN.className = 'card lodge en';
    lodgeEN.innerText = info.lodgeEN;

    const lodgeKR = document.createElement('div');
    lodgeKR.className = 'card lodge kr';
    lodgeKR.innerText = info.lodgeKR;

    lodge.append(lodgeEN, lodgeKR);
  }

  const name = document.createElement('div');
  name.className = 'card name';

  const nameEN = document.createElement('h2');
  nameEN.className =
    info.name1.length < 15 ? 'card name short' : 'card name long';
  nameEN.innerText = info.name1;

  const nameKR = document.createElement('h2');
  nameKR.innerText = info.name2;
  nameKR.className = 'card name short';

  const retreat = document.createElement('div');
  retreat.className = 'card retreat';
  retreat.innerText = '2021 WINTER RETREAT';

  name.append(nameEN, nameKR, lodge);

  content.append(church, name, retreat);

  div.append(img, content);

  return div;
}
