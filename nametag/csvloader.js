// info object have following fields: id,firstname,lastname,church,group,bgpath

// For Winter 2021, CSV has firstname,lastname, church, group, gender

function csvToArray(csvString, delimeter = ',') {
  const rows = csvString.split('\n');
  const array = rows.map((row) => {
    const values = row.split(delimeter);
    const object = {
      id: Date.now(),
      firstname: values[0],
      lastname: values[1],
      ...parseChurchFromCSV(values[2]),
      ...parseGroupFromCSV(values[3], values[4]),
    };
    return object;
  });
  return array;
}

function parseChurchFromCSV(csvString) {
  const lower = csvString.toLowerCase();
  if (lower.match('central')) {
    return { church: 'CENTRAL' };
  } else if (lower.match('corona')) {
    return { church: 'CORONA' };
  } else if (lower.match('vegas')) {
    return { church: 'LAS VEGAS' };
  } else if (lower.match('angeles')) {
    return { church: 'LOS ANGELES' };
  } else if (lower.match('sacramento')) {
    return { church: 'SACRAMENTO' };
  } else {
    return { church: csvString.toUpperCase() };
  }
}

function parseGroupFromCSV(group, gender) {
  const lower = group.toLowerCase();
  if (lower.match('father')) {
    return { group: 'FATHERS GROUP', bgpath: 'bg/fathers.png' };
  } else if (lower.match('mother')) {
    return { group: 'MOTHERS GROUP', bgpath: 'bg/mothers.png' };
  } else if (lower.match('elder')) {
    lowerGender = gender.toLowerCase();
    if (lowerGender.match('male')) {
      return { group: 'FATHERS GROUP', bgpath: 'bg/fathers.png' };
    } else {
      return { group: 'MOTHERS GROUP', bgpath: 'bg/mothers.png' };
    }
  } else if (lower.match('young')) {
    return { group: 'YOUNG ADULT', bgpath: 'bg/ya.png' };
  } else if (lower.match('youth|lower|upper')) {
    return { group: 'CHURCH SCHOOL', bgpath: 'bg/school.png' };
  } else if (lower.match('preschool')) {
    return { group: 'PRESCHOOL', bgpath: 'bg/school.png' };
  }
}
