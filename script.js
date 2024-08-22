document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('stiri-locale');
    const loadingSpinner = document.getElementById('loading-spinner');
    const searchInput = document.getElementById('search-input');

    const rssUrls = [
        // Surse de știri
        'https://igj.ro/feed/',
        'https://igj.ro/cultura/feed',
        'https://gorjeanul.ro/feed/',
        'https://gorjeanul.ro/category/sport-2/feed/',
        'https://www.gorjonline.ro/category/ultima-ora/',
        'https://www.pandurul.ro/feed.rss',
        'https://www.gorjexpress.ro/feed/',
        'https://www.ziaruldegorj.ro/feed/',
        'https://www.stirigorj.ro/feed/',
        'https://www.gorjmedia.ro/feed/',
        'https://www.sgorj.ro/feed/',
        
        // Radiouri
        'https://www.radiocampus.ro/feed/',
        'https://www.radioinfinit.ro/feed/',
        'https://www.radiogorjeanul.ro/feed/'
    ];

    let allNewsItems = [];

    function fetchNews(rssUrl) {
        console.log(`Fetching news from: ${rssUrl}`);
        return fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
            .then(response => {
                console.log(`Response status for ${rssUrl}: ${response.status}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Data fetched for ${rssUrl}:`, data);
                if (!data.items) {
                    throw new Error('Invalid RSS data');
                }
                return data.items.map(item => ({ ...item, source: getSource(rssUrl) }));
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                return [];
            });
    }

    function getSource(rssUrl) {
        const urlMap = {
            // Surse de știri
            'https://igj.ro/feed/': 'Impact in Gorj',
            'https://igj.ro/cultura/feed' : 'Impact in Gorj - cultura',
            'https://gorjeanul.ro/feed/': 'Gorjeanul',
            'https://gorjeanul.ro/category/sport-2/feed/' : 'Gorjeanul - stiri din sport',
            'https://www.gorjonline.ro/category/ultima-ora/': 'Gorj Online',
            'https://www.pandurul.ro/feed.rss': 'Pandurul',
            'https://www.gorjexpress.ro/feed/': 'Gorj Express',
            'https://www.ziaruldegorj.ro/feed/': 'Ziarul de Gorj',
            'https://www.stirigorj.ro/feed/': 'Stiri Gorj',
            'https://www.gorjmedia.ro/feed/': 'Gorj Media',
            'https://www.sgorj.ro/feed/': 'Știrile Gorjului',

            // Radiouri
            'https://www.radiocampus.ro/feed/': 'Radio Campus',
            'https://www.radioinfinit.ro/feed/': 'Radio Infinit',
            'https://www.radiogorjeanul.ro/feed/': 'Radio Gorjeanul'
        };
        return urlMap[rssUrl] || 'Sursă necunoscută';
    }

    function highlightText(text, query) {
        if (!query.trim()) return text; // Returnează textul original dacă căutarea este goală

        const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escapează caracterele speciale
        const regex = new RegExp(`(${escapedQuery})`, 'gi'); // Creează regex pentru căutare insensibilă la caz

        return text.replace(regex, '<mark>$1</mark>'); // Înlocuiește cuvintele căutate cu <mark>
    }

    function createNewsItem(item) {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.dataset.title = item.title.toLowerCase(); // Adăugăm titlul în lowercase pentru căutare

        const title = document.createElement('h2');
        title.innerHTML = highlightText(item.title, searchInput.value);

        const source = document.createElement('p');
        source.classList.add('news-source');
        source.innerHTML = `Acceseaza sursa: <a href="${item.link}" target="_blank">${item.source}</a>`;

        const content = item.content || item.description || 'Conținut indisponibil';
        
        const description = document.createElement('p');
        description.innerHTML = highlightText(content, searchInput.value);

        if (item.author) {
            const author = document.createElement('p');
            author.classList.add('news-author');
            author.textContent = `Autor: ${item.author}`;
            newsItem.appendChild(author);
        }

        if (item.pubDate) {
            const pubDate = document.createElement('p');
            pubDate.classList.add('news-date');
            pubDate.textContent = `Publicat pe: ${new Date(item.pubDate).toLocaleDateString()}`;
            newsItem.appendChild(pubDate);
        }

        if (!item.content) {
            const readMore = document.createElement('a');
            readMore.href = item.link;
            readMore.target = '_blank';
            readMore.classList.add('read-more-button');
            readMore.textContent = 'Citește mai mult';
            description.appendChild(readMore);
        }

        const shareButton = document.createElement('button');
        shareButton.classList.add('share-button');
        shareButton.innerHTML = '<i class="fa-brands fa-facebook"></i> Distribuie pe Facebook';
        shareButton.addEventListener('click', function() {
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(item.link + '?utm_source=gorj-unit.com&utm_medium=social&utm_campaign=share')}&quote=${encodeURIComponent('Distribuit de pe www.gorj-unit.com')}`;
            window.open(shareUrl, '_blank');
        });

        newsItem.appendChild(title);
        newsItem.appendChild(description);
        newsItem.appendChild(source);
        newsItem.appendChild(shareButton);

        if (item.enclosure && item.enclosure.link) {
            const image = document.createElement('img');
            image.src = item.enclosure.link;
            image.alt = item.title;
            image.classList.add('news-image');
            image.loading = 'lazy';
            image.onerror = function() {
                image.src = 'img/Stema_Gorj.svg'; // Calea către imaginea de rezervă
            };
            newsItem.appendChild(image);
        }

        return newsItem;
    }

    function displayNews(newsItems) {
        loadingSpinner.style.display = 'none'; // Ascunde spinnerul după ce datele sunt încărcate
        newsContainer.innerHTML = ''; // Curăță conținutul existent
        if (newsItems.length === 0) {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Nu am reușit să încarcăm știrile. Te rugăm să încerci din nou mai târziu.';
            newsContainer.appendChild(errorMessage);
        } else {
            newsItems.forEach(item => {
                const newsItem = createNewsItem(item);
                newsContainer.appendChild(newsItem);
            });
        }
    }

    function filterNews(query) {
        const lowerCaseQuery = query.toLowerCase();
        const newsItems = newsContainer.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            const title = item.dataset.title;
            const titleElement = item.querySelector('h2');
            const descriptionElement = item.querySelector('p:not(.news-source)'); // Exclude elementul cu clasa .news-source
            
            if (title.includes(lowerCaseQuery) || (descriptionElement && descriptionElement.textContent.toLowerCase().includes(lowerCaseQuery))) {
                item.style.display = ''; // Afișează elementul
                if (titleElement) {
                    titleElement.innerHTML = highlightText(titleElement.textContent, query);
                }
                if (descriptionElement) {
                    descriptionElement.innerHTML = highlightText(descriptionElement.textContent, query);
                }
            } else {
                item.style.display = 'none'; // Ascunde elementul
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value;
            const filteredItems = allNewsItems.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(query.toLowerCase());
                const descriptionMatch = (item.content || item.description || '').toLowerCase().includes(query.toLowerCase());
                return titleMatch || descriptionMatch;
            });
            displayNews(filteredItems);
        });
    }

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target)) {
            searchInput.value = '';
            filterNews('');
        }
    });

    async function loadAllNews() {
        try {
            const newsPromises = rssUrls.map(url => fetchNews(url));
            allNewsItems = (await Promise.all(newsPromises)).flat();

            allNewsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(allNewsItems);
        } catch (error) {
            console.error('Error loading news:', error);
            loadingSpinner.style.display = 'none'; // Ascunde spinnerul în caz de eroare
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Nu am reușit să încarcăm știrile. Te rugăm să încerci din nou mai târziu.';
            newsContainer.appendChild(errorMessage);
        }
    }

    loadAllNews();
});

// Gestionarea click-ului pe butonul de meniu (hamburger)
document.querySelector(".hamburger").addEventListener("click", function() {
    this.classList.toggle("active");
    document.querySelector(".nav-links").classList.toggle("active");
});

// Închiderea meniului după selectarea unui link din meniul nav
document.querySelectorAll(".nav-links li a").forEach(link => {
    link.addEventListener("click", function() {
        // Închide meniul hamburger după ce se face click pe un link
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector(".nav-links").classList.remove("active");
    });
});

// Închiderea meniului când se face click în afara acestuia
document.addEventListener("click", function(event) {
    const isClickInsideMenu = document.querySelector(".nav-links").contains(event.target);
    const isClickOnHamburger = document.querySelector(".hamburger").contains(event.target);

    // Dacă click-ul nu este pe meniu sau pe hamburger, închide meniul
    if (!isClickInsideMenu && !isClickOnHamburger) {
        document.querySelector(".hamburger").classList.remove("active");
        document.querySelector(".nav-links").classList.remove("active");
    }
});


//anunta-ti prietenii 
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('share-button');
    
    shareButton.addEventListener('click', function() {
        // Obține URL-ul paginii curente
        const currentUrl = window.location.href;

        // Creează URL-ul de share pe Facebook
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

        // Deschide dialogul de share într-o fereastră nouă
        window.open(facebookShareUrl, '_blank', 'width=600,height=400');
    });
});