let lodges, lodgesMap, churches, nameArray, churchOther;

const name1 = document.getElementById('name1');
const name2 = document.getElementById('name2');
const churchRadios = document.getElementById('church-radios');
const lodgeRadios = document.getElementById('lodge-radios');
const infoList = document.getElementById('name-list');

const fileSelector = document.getElementById('file-selector');
const processing = document.getElementById('loading');

const NAME_LS_KEY = 'infolist';

async function initialize() {
  const configFile = await fetch('./config.json');
  const config = await configFile.json();

  churches = Object.values(config.churches);

  lodges = Object.keys(config.lodges);
  lodgesMap = config.lodges;
  initializeRadios(churchRadios, churches, 'church');
  initializeRadios(lodgeRadios, lodges, 'lodge');
  appendOtherChurchRadio();

  const loadedNames = localStorage.getItem(NAME_LS_KEY);
  if (loadedNames != null) {
    nameArray = JSON.parse(loadedNames);
    updateInfoListDisplay();
  } else {
    nameArray = [];
  }

  fileSelector.addEventListener('change', (event) => {
    whenUploaded(event);
  });

  name1.focus();
}

function appendOtherChurchRadio() {
  const listItem = document.createElement('li');

  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.id = 'others';
  radio.name = 'church';
  radio.value = churches.length;
  radio.required = 'required';

  const label = document.createElement('label');
  label.htmlFor = radio.id;
  label.innerText = 'Other:';

  const otherInput = document.createElement('input');
  otherInput.id = 'church-other';
  otherInput.type = 'text';
  otherInput.disabled = true;

  radio.addEventListener('change', (event) => {
    otherInput.disabled = false;
    otherInput.focus();
  });

  churches.forEach((church) => {
    const churchID = church.replace(' ', '');
    const element = document.getElementById(churchID);
    element.addEventListener('change', (event) => {
      otherInput.disabled = true;
    });
  });

  listItem.appendChild(radio);
  listItem.appendChild(label);
  listItem.appendChild(otherInput);
  churchRadios.append(listItem);

  churchOther = document.getElementById('church-other');
}

function initializeRadios(parent, list, name) {
  list.forEach((element, index) => {
    const listItem = document.createElement('li');

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = element.replaceAll(' ', '');
    radio.name = name;
    radio.value = index;
    radio.required = 'required';

    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.innerText = element;

    listItem.appendChild(radio);
    listItem.appendChild(label);

    parent.appendChild(listItem);
  });
}

function gatherFormInfo() {
  const form = document.forms[0];
  const lodgeIndex = form.elements['lodge'].value;
  const churchIndex = form.elements['church'].value;
  const info = {
    id: Date.now(),
    name1: name1.value,
    name2: name2.value,
    lodgeEN: lodges[lodgeIndex],
    lodgeKR: lodgesMap[lodges[lodgeIndex]],
    church: churches[churchIndex],
  };

  if (churchIndex == churches.length) {
    info['church'] = churchOther.value();
  }
  console.log(info);

  return info;
}

function onSubmitNameTag(event) {
  event.preventDefault();

  nameArray.push(gatherFormInfo());

  updateInfoListDisplay();

  name1.value = '';
  name2.value = '';
  name1.focus();
}

function onUpload() {
  fileSelector.click();
}

function whenUploaded(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const uploadedArray = csvToArray(event.target.result);
      nameArray = nameArray.concat(uploadedArray);
      updateInfoListDisplay();
    };
    reader.readAsText(file);
  }
  event.target.value = null;
}

function onDelete(event) {
  const button = event.target;
  const ul = button.parentElement;
  const index = parseInt(ul.id.slice(3));
  nameArray.splice(index, 1);
  updateInfoListDisplay();
}

function onDeleteAll() {
  nameArray = [];
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));
  updateInfoListDisplay();
}

async function onPrintMax() {
  processing.style.display = 'flex';
  await generateNametagsPDF(nameArray);

  // await generateNametagsPDF(nameArray.splice(0, 32));
  processing.style.display = 'none';
  updateInfoListDisplay();
}

function updateInfoListDisplay() {
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));

  while (infoList.firstChild) {
    infoList.removeChild(infoList.firstChild);
  }
  nameArray.forEach((element, index) => {
    infoList.append(createInfoListItem(index, element));
  });
}

function createInfoListItem(index, info) {
  const listItem = document.createElement('ul');
  listItem.id = `row${index}`;

  const number = document.createElement('li');
  number.innerText = index + 1;

  const name = document.createElement('li');
  name.class = 'name';
  name.innerText = `${info.name1} ${info.name2}`;

  const church = document.createElement('li');
  church.class = 'church';
  church.innerText = info.church;

  const lodge = document.createElement('li');
  lodge.class = 'lodge';
  lodge.innerHTML = info.lodgeEN;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', (event) => {
    onDelete(event);
  });

  listItem.appendChild(number);
  listItem.appendChild(name);
  listItem.appendChild(church);
  listItem.appendChild(lodge);
  listItem.appendChild(deleteButton);

  return listItem;
}
