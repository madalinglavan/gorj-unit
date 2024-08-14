document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('stiri-politica');
    const rssUrls = [
        'https://www.g4media.ro/feed',
        'https://www.hotnews.ro/rss/politic',
        'https://www.digi24.ro/rss/politica',
        'https://www.agerpres.ro/rss/politica',
        'https://evz.ro/rss/politic.xml'
    ];

    function fetchNews(rssUrl) {
        return fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)
            .then(response => response.json())
            .then(data => data.items.map(item => ({ ...item, source: getSource(rssUrl) })))
            .catch(error => {
                console.error('Error fetching news:', error);
                return [];
            });
    }

    function getSource(rssUrl) {
        const urlMap = {
            'https://www.g4media.ro/feed': 'G4Media',
            'https://www.hotnews.ro/rss/politic': 'HotNews Politic',
            'https://www.digi24.ro/rss/politica': 'Digi24 Politică',
            'https://www.agerpres.ro/rss/politica': 'Agerpres Politică',
            'https://evz.ro/rss/politic.xml': 'Evenimentul Zilei Politic'
        };
        return urlMap[rssUrl] || 'Sursă necunoscută';
    }

    // Modificăm funcția displayNews pentru a include linkul sursei
function displayNews(newsItems) {
    newsItems.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');

        const title = document.createElement('h2');
        title.textContent = item.title;

        const source = document.createElement('p');
        source.classList.add('news-source');
        source.innerHTML = `Sursa: <a href="${item.link}" target="_blank">${item.source}</a>`;

        const description = document.createElement('p');
        description.innerHTML = item.content ? item.content : item.description;

        if (item.enclosure && item.enclosure.link) {
            const image = document.createElement('img');
            image.src = item.enclosure.link;
            image.alt = item.title;
            image.classList.add('news-image');
            newsItem.appendChild(image);
        }

        newsItem.appendChild(title);
        newsItem.appendChild(source);
        newsItem.appendChild(description);
        newsContainer.appendChild(newsItem);
    });
}


    async function loadAllNews() {
        let allNewsItems = [];

        for (const rssUrl of rssUrls) {
            const newsItems = await fetchNews(rssUrl);
            allNewsItems = allNewsItems.concat(newsItems);
        }

        allNewsItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        displayNews(allNewsItems);
    }

    loadAllNews();
});
