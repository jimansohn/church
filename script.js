const config = [
  {
    name: 'Before After',
    path: 'before_after',
    description:
      'Simple Bible quiz testing on if one memorizes the order of the books in the Bible by asking several books before/after a certain book.',
  },
  {
    name: 'Retreat Nametag Maker',
    path: 'nametag',
    description:
      'A tool that automatically generate the nametag with given informations and creats PDF file to download for printing.',
  },
];

function createCard(project) {}

function populate() {
  config.forEach((project) => {
    const link = document.createElement('a');
    link.href = `/${project.path}`;

    const card = document.createElement('div');
    card.classname = 'card';

    const title = document.createElement('h2');
    title.innerText = project.name;

    const desc = document.createElement('p');
    desc.innerText = project.description;

    card.appendChild(title);
    card.appendChild(desc);
    link.appendChild(card);
    document.body.appendChild(link);
  });
}
