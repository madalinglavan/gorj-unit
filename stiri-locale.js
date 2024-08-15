document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('stiri-locale');
    const loadingSpinner = document.getElementById('loading-spinner');

    const rssUrls = [
        // Surse de știri
        'https://igj.ro/feed/',
        'https://gorjeanul.ro/feed/',
        'https://www.gorjonline.ro/feed/',
        'https://www.pandurul.ro/feed.rss',
        'https://www.gorjexpress.ro/feed/',
        'https://www.ziaruldegorj.ro/feed/',
        'https://www.gorjeanul.ro/feed/category/actualitate/feed/',
        'https://www.stirigorj.ro/feed/',
        'https://www.gorjmedia.ro/feed/',
        
        // Radiouri
        'https://www.radiocampus.ro/feed/',
        'https://www.radioinfinit.ro/feed/',
        'https://www.radiogorjeanul.ro/feed/'
    ];

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
            // Surse de știri
            'https://igj.ro/feed/': 'Impact in Gorj',
            'https://gorjeanul.ro/feed/': 'Gorjeanul',
            'https://www.gorjonline.ro/feed/': 'Gorj Online',
            'https://www.pandurul.ro/feed.rss': 'Pandurul',
            'https://www.gorjexpress.ro/feed/': 'Gorj Express',
            'https://www.ziaruldegorj.ro/feed/': 'Ziarul de Gorj',
            'https://www.gorjeanul.ro/feed/category/actualitate/feed/': 'Gorjeanul - Actualitate',
            'https://www.stirigorj.ro/feed/': 'Stiri Gorj',
            'https://www.gorjmedia.ro/feed/': 'Gorj Media',

            // Radiouri
            'https://www.radiocampus.ro/feed/': 'Radio Campus',
            'https://www.radioinfinit.ro/feed/': 'Radio Infinit',
            'https://www.radiogorjeanul.ro/feed/': 'Radio Gorjeanul'
        };
        return urlMap[rssUrl] || 'Sursă necunoscută';
    }

    function createNewsItem(item) {
        const newsItem = document.createElement('div');
        newsItem.classList.add('news-item');
    
        const title = document.createElement('h2');
        title.textContent = item.title;
    
        const source = document.createElement('p');
        source.classList.add('news-source');
        source.innerHTML = `Acceseaza sursa: <a href="${item.link}" target="_blank">${item.source}</a>`;
    
        // Verifică dacă există conținut complet sau doar descriere
        const content = item.content || item.description || 'Conținut indisponibil';
        
        const description = document.createElement('p');
        description.innerHTML = content;
    
        // Adaugă butonul "Citește mai mult" doar dacă conținutul este trunchiat
        if (!item.content) {
            const readMore = document.createElement('a');
            readMore.href = item.link;
            readMore.target = '_blank';
            readMore.classList.add('read-more-button');
            readMore.textContent = 'Citește mai mult';
            description.appendChild(readMore);
        }
    
       // Butonul de distribuire pe Facebook
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
        newsItems.forEach(item => {
            const newsItem = createNewsItem(item);
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
