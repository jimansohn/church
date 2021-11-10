let groups, groupKeys, churches, nameArray;

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const churchRadios = document.getElementById('church-radios');
const groupRadios = document.getElementById('group-radios');
const nameList = document.getElementById('name-list');
const printedList = document.getElementById('printed-list');

const NAME_LS_KEY = 'namelist';
const PRINTED_LS_KEY = 'printedlist';

async function initialize() {
  const configFile = await fetch('./config.json');
  const config = await configFile.json();
  groups = config.groups;
  groupKeys = Object.keys(groups);
  churches = config.churches;

  initializeRadios(churchRadios, churches, 'church');
  initializeRadios(groupRadios, Object.keys(groups), 'group');

  const loadedNames = localStorage.getItem(NAME_LS_KEY);
  if (loadedNames != null) {
    nameArray = JSON.parse(loadedNames);
    updateNameListDisplay();
  } else {
    nameArray = [];
  }

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
    group: groupKeys[groupIndex],
    bgpath: groups[groupKeys[groupIndex]],
  };

  return info;
}

function onSubmitNameTag(event) {
  event.preventDefault();

  console.log(groups);

  nameArray.push(gatherFormInfo());

  updateNameListDisplay();

  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));
  firstname.value = '';
  lastname.value = '';
  firstname.focus();
}

function onDeleteAll() {
  nameArray = [];
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));
  updateNameListDisplay();
}

function onPrintAll() {
  generateNametagsPDF(nameArray);
}

function updateNameListDisplay() {
  while (nameList.firstChild) {
    nameList.removeChild(nameList.firstChild);
  }
  nameArray.forEach((element) => {
    nameList.append(createInfoListItem(element));
  });
}

function createInfoListItem(info) {
  const listItem = document.createElement('ul');
  listItem.id = info.id;

  const check = document.createElement('input');
  check.type = 'checkbox';

  const name = document.createElement('li');
  name.class = 'name';
  name.innerText = `${info.firstname} ${info.lastname}`;

  const church = document.createElement('li');
  church.class = 'church';
  church.innerText = info.church;

  const group = document.createElement('li');
  group.class = 'group';
  group.innerHTML = info.group;

  listItem.appendChild(check);
  listItem.appendChild(name);
  listItem.appendChild(church);
  listItem.appendChild(group);

  return listItem;
}
