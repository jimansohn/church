let groups,
  groupKeys,
  groupLabels,
  groupPaths,
  groupMatches,
  churches,
  churchKeys,
  churchLabels,
  churchMatches,
  nameArray;

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const churchRadios = document.getElementById('church-radios');
const groupRadios = document.getElementById('group-radios');
const nameList = document.getElementById('name-list');
const fileSelector = document.getElementById('file-selector');
const processing = document.getElementById('loading');

const NAME_LS_KEY = 'namelist';
const PRINTED_LS_KEY = 'printedlist';

async function initialize() {
  const configFile = await fetch('./config.json');
  const config = await configFile.json();

  churches = Object.values(config.churches);

  groups = config.groups;
  groupKeys = Object.keys(groups);
  groupLabels = groupKeys.map((key) => {
    return groups[key].label;
  });
  groupPaths = groupKeys.map((key) => {
    return groups[key].path;
  });

  initializeRadios(churchRadios, churches, 'church');
  initializeRadios(groupRadios, groupLabels, 'group');

  const loadedNames = localStorage.getItem(NAME_LS_KEY);
  if (loadedNames != null) {
    nameArray = JSON.parse(loadedNames);
    updateNameListDisplay();
  } else {
    nameArray = [];
  }

  fileSelector.addEventListener('change', (event) => {
    whenUploaded(event);
  });

  firstname.focus();
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

  const groupIndex = form.elements['group'].value;
  const info = {
    id: Date.now(),
    firstname: firstname.value,
    lastname: lastname.value,
    church: churches[form.elements['church'].value],
    group: groupLabels[groupIndex],
    bgpath: groupPaths[groupIndex],
  };

  return info;
}

function onSubmitNameTag(event) {
  event.preventDefault();

  nameArray.push(gatherFormInfo());

  updateNameListDisplay();

  firstname.value = '';
  lastname.value = '';
  firstname.focus();
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
      updateNameListDisplay();
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
  updateNameListDisplay();
}

function onDeleteAll() {
  nameArray = [];
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));
  updateNameListDisplay();
}

async function onPrintMax() {
  processing.style.display = 'flex';
  await generateNametagsPDF(nameArray.splice(0, 32));
  processing.style.display = 'none';
  updateNameListDisplay();
}

function updateNameListDisplay() {
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));

  while (nameList.firstChild) {
    nameList.removeChild(nameList.firstChild);
  }
  nameArray.forEach((element, index) => {
    nameList.append(createInfoListItem(index, element));
  });
}

function createInfoListItem(index, info) {
  const listItem = document.createElement('ul');
  listItem.id = `row${index}`;

  const number = document.createElement('li');
  number.innerText = index + 1;

  const name = document.createElement('li');
  name.class = 'name';
  name.innerText = `${info.firstname} ${info.lastname}`;

  const church = document.createElement('li');
  church.class = 'church';
  church.innerText = info.church;

  const group = document.createElement('li');
  group.class = 'group';
  group.innerHTML = info.group;

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Delete';
  deleteButton.classList.add('delete');
  deleteButton.addEventListener('click', (event) => {
    onDelete(event);
  });

  listItem.appendChild(number);
  listItem.appendChild(name);
  listItem.appendChild(church);
  listItem.appendChild(group);
  listItem.appendChild(deleteButton);

  return listItem;
}
