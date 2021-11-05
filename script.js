async function initialize() {
  const configFile = await fetch('./config.json');
  const config = await configFile.json();

  main = document.getElementsByTagName('main')[0];
  config.forEach((project) => {
    const link = document.createElement('a');
    link.href = `/${project.path}`;

    const card = document.createElement('div');
    card.classname = 'card';

    const title = document.createElement('h2');
    title.innerText = project.name;

    const desc = document.createElement('h5');
    desc.innerText = project.description;

    card.appendChild(title);
    card.appendChild(desc);
    link.appendChild(card);
    main.appendChild(link);
  });
}
