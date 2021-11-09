let groups, groupKeys, churches, nameArray;

const nameField = document.getElementById('name');
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
    updateNameList();
  } else {
    nameArray = [];
  }

  const deleteAll = document.getElementById('delete-all');
  deleteAll.addEventListener('click', function () {
    nameArray = [];
    updateNameList();
  });

  const clearAll = document.getElementById('clear-all');
  deleteAll.addEventListener('click', function () {
    removeAllList(printedList, printedMap, PRINTED_LS_KEY);
  });

  nameField.focus();
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

function onSubmitNameTag(event) {
  event.preventDefault();

  nameArray.push(gatherFormInfo());
  updateNameList();

  localStorage.setItem(NAME_LS_KEY, JSON.stringify(nameArray));
  // updateListToLocalStorage(nameList, NAME_LS_KEY);
  nameField.value = '';
  nameField.focus();
}

function onDeleteAll() {
  removeAllList(nameList, nameArray, NAME_LS_KEY);
}

function onClear() {
  removeAllList(printedList, printedMap, PRINTED_LS_KEY);
}

function updateNameList() {
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
  name.innerText = info.name;

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
