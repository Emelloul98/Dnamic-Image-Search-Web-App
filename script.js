var counter = 1;
var all_results = [];
var container;
var num_of_pages = 0;
var query;
var clientId = "Qzn79ipgxgy-OEdZ6g27J7Sjl80wp2ejhdbVdyDTbaY";

// Function that creates the HTML tags
function init() {
    const header = document.createElement('header');
    const h1 = document.createElement('h1');
    h1.innerText = 'Emanuel Malloul';
    header.appendChild(h1);
    document.body.appendChild(header);

    const search = document.createElement('div');
    search.className = 'search';
    const input = document.createElement('input');
    input.id = 'searchInput';
    input.type = 'text';
    input.placeholder = 'Search for images...';
    input.addEventListener('input', updateValue);
    search.appendChild(input);
    document.body.appendChild(search);

    const main = document.createElement('div');
    main.className = 'main';

    const images = document.createElement('div');
    images.className = 'images';
    main.appendChild(images);

    const info = document.createElement('div');
    info.className = 'info';
    main.appendChild(info);

    document.body.appendChild(main);
}
// Event listener for the input box
function updateValue() {
    var inputElement = document.getElementById('searchInput');
    var value = inputElement.value;
    if (value.length >= 3) {
        clearScreen();
        query = value;
        all_results = [];  // Clear previous results
        counter = 1;  // Reset counter
        showImage();
    } else {
        counter = 1;
        clearScreen();
    }
}

// Function to show images
function showImage() {
    let url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${clientId}&per_page=20&page=${counter}`;

    $.ajax({
        url: url,
        type: 'GET',
        success: function(response) {
            if (counter == 1) {
                createContainer();
            }
            num_of_pages = response.total_pages;
            all_results = all_results.concat(response.results);  // Append new results to global array
            createDiv();
            if (num_of_pages > counter) {
                createButton();
            } else {
                // Remove the "Load More" button if there are no more pages
                var toDelete = document.getElementById('myButton');
                if (toDelete) {
                    container.removeChild(toDelete);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}

// Function to create container for images
function createContainer() {
    container = document.createElement('div');
    container.setAttribute('id', 'myDiv');
    const mainElement = document.querySelector(".images");
    mainElement.appendChild(container);
}

// Function to create divs for images
function createDiv() {
    const numGroups = 5;
    const imagesPerGroup = 4;
    for (let i = 0; i < numGroups; i++) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add(`group${i + 1}`);

        for (let j = 0; j < imagesPerGroup; j++) {
            const index = (counter - 1) * 20 + i * imagesPerGroup + j;
            if (index < all_results.length) {
                const newImg = document.createElement('img');
                newImg.setAttribute('id', `img${index + 1}`);
                newImg.src = all_results[index].urls.thumb;
                newImg.addEventListener('click', function() {
                    updateInfo(all_results[index]);
                });
                groupDiv.appendChild(newImg);
            }
        }
        container.appendChild(groupDiv);
    }
}

// Function to create Load More button
function createButton() {
    var toDelete = document.getElementById('myButton');
    if (toDelete) {
        container.removeChild(toDelete);
    }
    var button = document.createElement("button");
    button.id = "myButton";
    button.innerText = "Load More";
    container.appendChild(button);
    button.addEventListener("click", buttonClicked);
}

function buttonClicked() {
    if (counter < num_of_pages) {
        counter++;
        showImage();
    }
}

// Function to clear the screen
function clearScreen() {
    var imagesElement = document.querySelector(".images");
    var info = document.querySelector(".info");
    var toDelete = document.getElementById('myDiv');
    if (imagesElement && toDelete) {
        imagesElement.removeChild(toDelete);
    }
    var toDelete = document.getElementById("myInfo");
    if (toDelete) {
        info.removeChild(toDelete);
    }
    var toDelete = document.getElementById('myButton');
    if (toDelete) {
        container.removeChild(toDelete);
    }
}

// Function to update the info area with image details
function updateInfo(element) {
    var info = document.querySelector(".info");
    var toDelete = document.getElementById("myInfo");
    if (toDelete) {
        info.removeChild(toDelete);
    }
    var paragraph = document.createElement("p");
    paragraph.setAttribute("id", "myInfo");

    var title = element.description || 'No Description';
    var description = element.alt_description || 'No alternative description';
    var likes = element.likes;

    paragraph.innerHTML = `
        <img src="${element.urls.thumb}" alt="Image" style="max-width: 100px; display: block; margin-bottom: 10px;">
        <strong>Title:</strong> ${title} <br>
        <strong>Description:</strong> ${description} <br>
        <strong>Likes:</strong> ${likes}
    `;
    info.appendChild(paragraph);
}
