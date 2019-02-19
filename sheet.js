document.addEventListener('DOMContentLoaded', () => {
  const data = document.getElementById('data');
  const changeValue = document.getElementById('changeValue');
  const pages = document.getElementById('pages');
  const heading = ['Имя', 'Фамилия', 'Номер телефона', 'Описание', 'Цвет глаз'];
  const statecolumn = [false, false, false, false, false];// Необходим для отрисовки колонок, true - колонка скрыта
  const headingCode = ['firstName', 'lastName', 'phone', 'about', 'eyeColor'];
  const amountOfRows = 10;
  const amountOfColumns = 5;
  let currentPage; // текущая страница

  const view = function (n) { // постраничный вывод данных;
    const thead = data.getElementsByTagName('thead')[0];
    data.removeChild(thead);
    const tbody = data.getElementsByTagName('tbody')[0];
    data.removeChild(tbody); //удаление предыдущей таблицы для добавления новой

    const theadOfData = document.createElement('thead');
    const trOfData = document.createElement('tr');
    for (let i = 0; i < amountOfColumns; i++) {
      if (!statecolumn[i]) {// проверка на необходимость отображения данного столбец
        const thOfData = document.createElement('th');
        thOfData.className = 'heading';
        thOfData.innerHTML= heading[i]; 
        trOfData.appendChild(thOfData); 
      }
    }
    theadOfData.appendChild(trOfData);
    data.appendChild(theadOfData);


    const tbodyOfData = document.createElement('tbody');

    for (let i = n * amountOfRows; i <= (n + 1) * amountOfRows - 1; i++) {//постраничный вывод данных
      const trOfTbody  = document.createElement('tr');
      trOfTbody.className = 'row';
      const currentRow = columns(i); //элемент JSON для заданной позиции
      for (let j = 0; j < amountOfColumns; j++) {//
        const tdOfData = document.createElement('td');
        if (!statecolumn[j]) {
          if (j === 3) {
            tdOfData.className = 'about';
          } else if (j === 4) {
            tdOfData.className = currentRow[j];
          } 
          tdOfData.innerHTML = currentRow[j];
          trOfTbody.appendChild(tdOfData);
        }
      }
      tbodyOfData.appendChild(trOfTbody);
    }
    data.appendChild(tbodyOfData);


    const tbody2 = pages.getElementsByTagName('tbody')[0];
    pages.removeChild(tbody2);
    const tbodyOfPage = document.createElement('tbody');
    const trOfPage = document.createElement('tr');
    for (let i = 0; i < amountOfColumns; i++) {//отрисовка номеров страниц и выделение текущей страницы
      const indexx = i + 1;
      thOfPage = document.createElement('th');
      if (i === n) {
        thOfPage.className = 'page currentPage';
      } else {
        thOfPage.className = 'page';
      }
      thOfPage.innerHTML = i+1;
      trOfPage.appendChild(thOfPage);
    }
    tbodyOfPage.appendChild(trOfPage);
    pages.appendChild(tbodyOfPage);
  };

  const columns = function (row) {// необходима для вывода данных через цикл
    const column = [info[row].name.firstName, info[row].name.lastName, info[row].phone, info[row].about, info[row].eyeColor];
    return column;
  };

  const changeRow = function (row) {//поля редактрования строки
    let t = '';
    const currentRow = columns(row);
    for (let i = 0; i < amountOfColumns; i++) {
      t += `<p>${heading[i]}<Br>`;//название колонки
      t += `<textarea name='comment' cols='40' rows='1'>${currentRow[i]}</textarea></p>`;//Значание, которое можно редактировать
    }
    changeValue.innerHTML += t;
  };

  const sorter1 = function (column, ret1, ret2) {//сортировка для номера телефона, описания и цвета глаз
    info.sort((a, b) => {
      if (a.name[column] < b.name[column]) return ret1;
      if (a.name[column] > b.name[column]) return ret2;
      return 0;
    });
  };

  const sorter2 = function (column, ret1, ret2) { // cортирка для имени и фамилии
    info.sort((a, b) => {
      if (a[column] < b[column]) return ret1;
      if (a[column] > b[column]) return ret2;
      return 0;
    });
  };

  const remove = function(){// удаление ранее отрисованных элементов окна редавтирования,  необходимо при переходе со странице на страницу или сортировке, так как изменяемая строка уже не актуальна
    while (changeValue.firstChild) {
      changeValue.removeChild(changeValue.firstChild);
    }
  }

  let state = true; //  true сортировка по возрастанию, false - по убыванию
  const sorter = function (index) { // функция сортировки JSON
    remove(); 
    switch (index) {//index номер  колонки, относительно которой необходимо прозвести сортировку
      case 0:
        if (state) {
          sorter1('firstName', -1, 1);
          state = false;
        } else {
          sorter1('firstName', 1, -1);
          state = true;
        }
        break;
      case 1:
        if (state) {
          sorter1('lastName', -1, 1);
          state = false;
        } else {
          sorter1('lastName', 1, -1);
          state = true;
        }
        break;
      case 2:
        if (state) {
          sorter2('phone', -1, 1);
          state = false;
        } else {
          sorter2('phone', 1, -1);
          state = true;
        }
        break;
      case 3:
        if (state) {
          sorter2('about', -1, 1);
          state = false;
        } else {
          sorter2('about', 1, -1);
          state = true;
        }
        break;
      case 4:
        if (state) {
          sorter2('eyeColor', -1, 1);
          state = false;
        } else {
          sorter2('eyeColor', 1, -1);
          state = true;
        }
        break;
      default:
        break;
    }
  };

  data.onclick = function (e) {
    if (e.target.tagName === 'TH') { // при нажатии на заголовок таблицы
      const cellIndex = event.target.cellIndex; // определяется какую именно колонку необходимо сотрировать
      sorter(cellIndex); 
      view(0); 
    } else if (e.target.tagName === 'TD') {// определение строки которую необходимо редавктировать
      const cellIndex2 = event.target.parentNode.rowIndex; // номер строки
      const choisenrow = currentPage * amountOfRows + cellIndex2;// определение позиции нужного элемента в JSON
      remove();
      changeRow(choisenrow - 1); //создание нового
    } 
  };

  //постраничный вывод данных 
  pages.onclick = function (e) {
    if (e.target.tagName != 'TH') {
      return;
    }
    currentPage = event.target.cellIndex; //определение текущей страницы, переменная currentPage определена глобально, чтобы при сортировке колонки или скрытия или показа, остаться на текущей странице
    view(currentPage); 
    remove();
  };

//проверка состояний chexbox для скрытия или показа колонок таблицы
  document.addEventListener('change', () => {
    const chk = event.target;
    if (chk.tagName === 'INPUT' && chk.type === 'checkbox') {
      for (let i = 0; i < amountOfColumns; i++) {
        if (chk.name === headingCode[i]) {
          statecolumn[i] = chk.checked;
        }
      }
      view(currentPage);
    }
  });
  view(0);//превая страница 
  currentPage = 0;
});
