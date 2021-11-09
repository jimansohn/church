async function generateNametagsPDF(infoMap) {
  const testElement = document.createElement('img');
  testElement.id = 'test';
  testElement.src = '/nametag/bg/fathers.png';
  const pdf = html2pdf();
  const opt = {
    margin: 100,
    jsPDF: {
      unit: 'px',
      orientation: 'l',
      format: 'letter',
      hotfixes: ['px_scaling'],
    },
    html2canvas: {
      scale: 8,
    },
  };

  const element = await generateSingleTag({
    group: 'FATHERS GROUP',
    name: 'Simon',
    church: 'SACRAMENTO',
  });
  console.log(element);
  document.body.appendChild(element);
  pdf.set(opt).from(element).save();
}

async function generateSingleTag(info) {
  const configFile = await fetch('./config.json');
  const config = await configFile.json();

  const div = document.createElement('div');
  div.className = 'card';

  const img = document.createElement('img');
  img.src = config.groups[info.group];

  const content = document.createElement('div');

  const church = document.createElement('div');
  church.innerText = 'SACRAMENTO';

  const name = document.createElement('div');
  name.innerHTML = '<h2>Christina<h2><h2>Sohn<h2>';

  const group = document.createElement('div');
  group.innerText = 'FATHERS GROUP';

  content.appendChild(church);
  content.appendChild(name);
  content.appendChild(group);

  div.appendChild(img);
  div.appendChild(content);
  return div;
}
