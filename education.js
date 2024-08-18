document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('education');
    const loadingSpinner = document.getElementById('loading-spinner'); // Adăugăm un spinner de încărcare, dacă există
    const searchInput = document.getElementById('search-input'); // Input pentru căutare

    const rssUrls = [
        // Surse de știri
        'https://www.utgjiu.ro/feed/',
        'https://cntv-edu.ro/feed/',
    ];

    let allNewsItems = [];

    function fetchNews(rssUrl) {
        return fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
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
            'https://www.utgjiu.ro/feed/': 'UNIV. CONSTANTIN BRANCUSI',
            'https://cntv-edu.ro/feed/': 'COLEGIUL NATIONAL TUDOR VLADIMIRESCU',
        };
        return urlMap[rssUrl] || 'Sursă necunoscută';
    }

    function highlightText(text, query) {
        if (!query.trim()) return text;
        const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function createNewsItem(item) {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
        newsItem.dataset.title = item.title.toLowerCase();

        const title = document.createElement('h2');
        title.innerHTML = highlightText(item.title, searchInput ? searchInput.value : '');

        const source = document.createElement('p');
        source.classList.add('news-source');
        source.innerHTML = `Accesează sursa: <a href="${item.link}" target="_blank">${item.source}</a>`;

        const content = item.content || item.description || 'Conținut indisponibil';
        const description = document.createElement('p');
        description.innerHTML = highlightText(content, searchInput ? searchInput.value : '');

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
                image.src = 'img/Stema_Gorj.svg';
            };
            newsItem.appendChild(image);
        }

        return newsItem;
    }

    function displayNews(newsItems) {
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
        newsContainer.innerHTML = '';
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

    async function loadAllNews() {
        try {
            const newsPromises = rssUrls.map(url => fetchNews(url));
            allNewsItems = (await Promise.all(newsPromises)).flat();

            allNewsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            displayNews(allNewsItems);
        } catch (error) {
            console.error('Error loading news:', error);
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Nu am reușit să încarcăm știrile. Te rugăm să încerci din nou mai târziu.';
            newsContainer.appendChild(errorMessage);
        }
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

    loadAllNews();
});
