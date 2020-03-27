// import '~bootstrap';
import './style.scss';

const english = require('./sets/english');

function getSetSlice(set) {
    const setWords = set.words;
    shuffle(setWords);

    return {
        name: set.name,
        words: setWords.slice(0, 25)
    }
}

const sets = [
    getSetSlice(english)
];

let answers = [
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "red",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "blue",
    "black",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
    "white"
];

let reviewed = [];

const ddSets = document.getElementById('sets');
const txtWords = document.getElementById('words');
const grid = document.getElementById('grid');
const btnRandomWords = document.getElementById('btnRandomWords');
const btnRandomAnswers = document.getElementById('btnRandomAnswers');
const btnShowAnswers = document.getElementById('btnShowAnswers');

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function selectSet() {
    const set = sets.find(s => s.name === ddSets.value);
    txtWords.innerHTML = set.words.join("\n");
}

function randomizeWords() {
    let w = txtWords.innerHTML.split("\n");
    shuffle(w);
    txtWords.innerHTML = w.join("\n");
}

function loadAnswers() {
    const localAnswers = localStorage.getItem('answers');
    if (localAnswers) {
        answers = JSON.parse(localAnswers);
    } else {
        saveAnswers();
    }
}

function saveAnswers() {
    localStorage.setItem('answers', JSON.stringify(answers));
}

function loadReviewed() {
    const localReviewed = localStorage.getItem('reviewed');
    if (localReviewed) {
        reviewed = JSON.parse(localReviewed);
    } else {
        saveReviewed();
    }
}

function saveReviewed() {
    localStorage.setItem('reviewed', JSON.stringify(reviewed));
}

function loadWords() {
    const localWords = localStorage.getItem('words');
    if (localWords) {
        txtWords.innerHTML = localWords;
    }
}

function saveWords() {
    localStorage.setItem('words', txtWords.innerHTML);
}

function randomizeAnswers() {
    shuffle(answers);
}

txtWords.onchange = function() {
    saveWords();
    populateGrid();
};

btnRandomWords.onclick = function () {
    randomizeWords();
    saveWords();
    populateGrid();
    return false;
};

btnRandomAnswers.onclick = function () {
    randomizeAnswers();
    saveAnswers();
    populateGrid();
    return false;
};

btnShowAnswers.onclick = function () {
    if (document.body.classList.contains('show-answers')) {
        document.body.classList.remove('show-answers');
    } else {
        document.body.classList.add('show-answers');
    }
    return false;
};

ddSets.onchange = function () {
    selectSet();
    randomizeWords();
    saveWords();
    populateGrid();
};

function populateSets() {
    ddSets.innerHTML = '<option value="">Select a set</option>';
    sets.forEach(set => {
        const option = document.createElement('option');
        option.innerText = set.name;
        ddSets.appendChild(option);
    });
}

function toggleGridItem() {
    const item = this.getAttribute('data-item');
    if (reviewed.includes(item)) {
        reviewed.splice(reviewed.indexOf(item));
        this.classList.remove('show');
    } else {
        reviewed.push(item);
        this.classList.add('show');
    }
    saveReviewed();
}

function populateGrid() {
    grid.innerHTML = '';
    const wordsForGrid = txtWords.innerHTML.split("\n");
    for (let i = 0; i < 25; i++) {
        const color = answers[i];
        const item = document.createElement('div');
        const shouldReview = reviewed.includes(i.toString());
        item.setAttribute('class', `grid-item ${color} ${shouldReview ? 'show' : ''}`);
        item.setAttribute('data-color', color);
        item.setAttribute('data-item', i.toString());
        item.onclick = toggleGridItem;
        const text = wordsForGrid.length > i ? wordsForGrid[i] : i.toString();
        item.innerHTML = `<span>${text}</span>`;
        grid.appendChild(item);
    }
}

(function () {
    randomizeAnswers();
    loadAnswers();
    loadReviewed();
    loadWords();

    populateSets();
    populateGrid();
})();
