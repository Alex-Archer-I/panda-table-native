document.addEventListener('DOMContentLoaded', () => {

    class Row {
        constructor(name, login, email, age, id) {
            this.name = name;
            this.id = id;
            this.login = login;
            this.email = email;
            this.age = age;
        }

        render() {
            const element = document.createElement('tr');
            element.innerHTML = `
                <td>${this.name}</td>
                <td>${this.login}</td>
                <td>${this.email}</td>
                <td>${this.age}</td>
                <td>${this.id}</td>
            `;
            document.querySelector('.table').append(element);
        }
    }

    function createTable() {
        displayPandas = currentPandas.slice((page * pagination), (page * pagination) + pagination);
        displayPandas.forEach((panda) => {
            new Row(panda.name, panda.login, panda.email, panda.age, panda.id).render();
        });

        totalpage = Math.ceil(currentPandas.length / pagination);
        currentPage.textContent = `${page + 1}`;
        totalPages.textContent = `${totalpage}`;
    }

    function updateTable() {
        tbody.innerHTML = '';
        createTable();
    }

    function sortTable(item) {
        function compare(a, b) {
            if (a[item] > b[item]) {return 1;}
            if (a[item] == b[item]) {return 0;}
            if (a[item] < b[item]) {return -1;}
        }

        currentPandas.sort(compare);
    }

    // Создание таблицы

    const getData = async (url) => {
        const res = await fetch(url);
    
        if (!res.ok) {
            console.log("Error!");
        }

        return await res.json();
    };

    const getUser = async () => {
        const res = await getData('https://randomuser.me/api/?results=100&inc=name,email,id,login,dob&nat=gb&noinfo');

        pandas = res.results.map(user => {
            return {
                name: user.name.first,
                login: user.login.username,
                email: user.email,
                age: user.dob.age,
                id: user.id.value,
            };
        });

        currentPandas = pandas.slice();

        createTable();
    };

    let pandas;
    let currentPandas;
    getUser();

    // Переменные

    let hasSorted = {
        name: false,
        login: false,
        email: false,
        age: false,
        id: false
    };

    const table = document.querySelector('table');
    const tbody = document.querySelector('tbody');

    const area = document.querySelectorAll('input[name="area"]');
    const input = document.querySelector('input[name="clue"]');

    let searchArea = 'name';

    const pagination = 10;
    let page = 0;
    let totalpage = 0;
    let displayPandas = [];

    const currentPage = document.querySelector('.page');
    const totalPages = document.querySelector('.total-pages');
    const nextPage = document.querySelector('.next-page');
    const prevPage = document.querySelector('.prev-page');

    //Сортировка столбцов

    table.addEventListener('click', (event) => {
        if (event.target.classList.contains('header')) {
            const sortVal = event.target.getAttribute('data-column');

            if (hasSorted[sortVal] == true) {
                currentPandas.reverse();
                updateTable();
            } else {
                sortTable(sortVal);
                updateTable();
                
                for (let key in hasSorted) {
                    hasSorted[key] = false;
                }
                hasSorted[sortVal] = true;
            }
        }
    });

    // Поиск

    area.forEach(radio => {
        radio.addEventListener('change', (event) => {
            searchArea = event.target.value;
            input.value = '';
        });
    });

    input.addEventListener('input', () => {
        let regex = new RegExp(`${input.value}`, 'i');
        currentPandas = pandas.filter(panda => regex.test(panda[searchArea]));
        for (let key in hasSorted) {
            hasSorted[key] = false;
        }
        updateTable();
    });

    // Клиентская пагинация

    nextPage.addEventListener('click', () => {
        if ((page + 1) != totalpage) {
            page++;
            updateTable();
        }
    });

    prevPage.addEventListener('click', () => {
        if (page != 0) {
            page--;
            updateTable();
        }
    });

});