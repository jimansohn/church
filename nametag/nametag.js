let groups, groupKeys, churches, nameMap, printedMap;

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
    nameMap = JSON.parse(loadedNames);
    updateDisplay(nameList, nameMap);
  } else {
    nameMap = {};
  }
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

function submitNameTag(event) {
  event.preventDefault();

  const info = gatherFormInfo();
  nameMap[info.id] = info;
  updateDisplay(nameList, nameMap);
  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameMap));
  // updateListToLocalStorage(nameList, NAME_LS_KEY);
}

function gatherFormInfo() {
  let name, church, group;

  const form = document.forms[0];

  const nameInput = form.elements['name'];
  name = nameInput.value;

  const churchIndex = form.elements['church'].value;
  church = churches[churchIndex];

  const groupIndex = form.elements['group'].value;
  group = groupKeys[groupIndex];

  const info = { id: Date.now(), name: name, church: church, group: group };
  return info;
}

function createInfoListItem(info) {
  const listItem = document.createElement('li');
  listItem.id = info.id;

  const name = document.createElement('span');
  name.class = 'name';
  name.innerText = info.name;

  const church = document.createElement('span');
  church.class = 'church';
  church.innerText = info.church;

  const group = document.createElement('span');
  group.class = 'group';
  group.innerHTML = info.group;

  listItem.appendChild(name);
  listItem.appendChild(church);
  listItem.appendChild(group);

  return listItem;
}

function updateDisplay(parent, map) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  const keys = Object.keys(map);
  keys.forEach((key) => {
    parent.append(createInfoListItem(map[key]));
  });
}
