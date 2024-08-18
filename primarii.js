document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('primarii');
    const loadingSpinner = document.getElementById('loading-spinner'); // Optional: spinner element
    const searchInput = document.getElementById('search-input'); // Optional: search input element

    const rssUrls = [
        'https://primaria-bustuchin.ro/feed/',      // Bustuchin
        'https://www.targujiu.ro/feed/',            // Târgu Jiu
        'https://www.primariamotru.ro/feed',        // Motru
        'https://www.bumbesti-jiu.ro/feed',         // Bumbești-Jiu
        'https://www.primariarovinari.ro/feed',     // Rovinari
        'https://www.primariacarbunesti.ro/feed',   // Târgu Cărbunești
        'https://www.primariaturceni.ro/rss',       // Turceni
        'https://www.primarianovaci.ro/rss',        // Novaci
        'https://www.primarieticleni.ro/rss',       // Țicleni
        'https://www.primariaalbeni.ro/feed/',      // Albeni
        'https://www.primariaalimpesti.ro/feed/',   // Alimpești
        'https://www.primariaaninoasa.ro/feed/',    // Aninoasa
        'https://www.primariaarcani.ro/feed/',      // Arcani
        'https://www.pbf.ro/feed/',                 // Baia de Fier
        'https://www.primariabalanesti.ro/feed/',   // Bălănești
        'https://www.primariabalesti.ro/feed/',     // Bălești
        'https://www.primariabarbatesti.ro/feed/',  // Bărbătești
        'https://www.primariabengesticiocadia.ro/feed/', // Bengești-Ciocadia
        'https://www.primariaberlesti.ro/feed/',    // Berlești
        'https://www.primariabalteni.ro/feed/',     // Bâlteni
        'https://www.primariabolbosi.ro/feed/',     // Bolboși
        'https://www.primariaborascu.ro/feed/',     // Borăscu
        'https://www.primariabranesti.ro/feed/',    // Brănești
        'https://comunabumbestipitic.ro/feed/',     // Bumbești-Pițic
        'https://www.primaria-calnic.ro/feed/',     // Câlnic
        'https://www.primariacapreni.ro/feed/',     // Căpreni
        'https://www.primariacatunele.ro/feed/',    // Cătunele
        'https://www.primariaciuperceni.ro/feed/',  // Ciuperceni
        'https://www.primariacrasna.ro/feed/',      // Crasna
        'https://www.comunacruset.ro/feed/',        // Crușeț
        'https://www.primariadanciulesti.ro/feed/', // Dănciulești
        'https://www.comunadanesti.ro/feed/',       // Dănești
        'https://www.primariadragotesti.ro/feed/',  // Drăgotești
        'https://www.primaria-dragutesti.ro/feed/', // Drăguțești
        'https://primariafarcasesti-gj.ro/feed/',   // Fărcășești
        'https://www.primariaglogova.ro/feed/',     // Glogova
        'https://www.comunagodinesti.ro/feed/',     // Godinești
        'https://hurezani.eccompany.ro/feed/',      // Hurezani
        'https://www.primariaionesti.ro/feed/',     // Ionești
        'https://www.primariajupinesti.ro/feed/',   // Jupânești
        'https://www.primarialelesti.ro/feed/',     // Lelești
        'https://www.primarialicurici.ro/feed/',    // Licurici
        'https://www.primaria-logresti.ro/feed/',   // Logrești
        'https://www.primariamatasari.ro/feed/',    // Mătăsari
        'https://www.primariamusetesti.ro/feed/',   // Mușetești
        'https://www.comunanegomir.ro/feed/',       // Negomir
        'https://www.primariapades.ro/feed/',       // Padeș
        'https://www.pestisani.ro/feed/',           // Peștișani
        'https://www.primariaplopsoru.ro/feed/',    // Plopșoru
        'https://www.comunapolovragi.ro/feed/',     // Polovragi
        'https://www.primariaprigoria.ro/feed/',    // Prigoria
        'http://www.rosiadeamaradia.ro/feed/',      // Roșia de Amaradia
        'https://www.runcugorj.ro/feed/',           // Runcu
        'https://www.primariasacelu.ro/feed/',      // Săcelu
        'https://www.primariasamarinesti.ro/feed/', // Samarinești
        'https://www.primariasaulesti.ro/feed/',    // Săulești
        'https://www.primaria-schela.ro/feed/',     // Schela
        'https://www.primariascoarta.ro/feed/',     // Scoarța
        'https://www.primariaslivilestigorj.ro/feed/', // Slivilești
        'https://www.primaria-stanesti.ro/feed/',   // Stănești
        'http://primariastejari.ro/feed/',          // Stejari
        'https://www.comunastoina.ro/feed/',        // Stoina
        'https://www.primariatantareni.ro/feed/',   // Țânțăreni
        'https://www.primariatelesti-gorj.ro/feed/',// Telești
        'https://www.primaria-turburea.ro/feed/',   // Turburea
        'https://turcinesti.ro/feed/',              // Turcinești
        'https://www.primariaurdari.ro/feed/',      // Urdari
        'https://www.primariavagiulesti.ro/feed/',  // Văgiulești
        'http://www.comunavladimir.ro/feed/',       // Vladimir
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
            'https://www.primaria-bustuchin.ro/feed': 'Primaria Bustuchin',
            'https://www.targujiu.ro/feed': 'Primaria Târgu Jiu',
            'https://www.primariamotru.ro/feed': 'Primaria Motru',
            'https://www.bumbesti-jiu.ro/feed': 'Primaria Bumbești-Jiu',
            'https://www.primariarovinari.ro/feed': 'Primaria Rovinari',
            'https://www.primariacarbunesti.ro/feed': 'Primaria Târgu Cărbunești',
            'https://www.primariaturceni.ro/feed': 'Primaria Turceni',
            'https://www.primarianovaci.ro/feed': 'Primaria Novaci',
            'https://www.primarieticleni.ro/feed': 'Primaria Țicleni',
            'https://www.primariaalbeni.ro/feed': 'Primaria Albeni',
            'https://www.primariaalimpesti.ro/feed': 'Primaria Alimpești',
            'https://www.primariaaninoasa.ro/feed': 'Primaria Aninoasa',
            'https://www.primariaarcani.ro/feed': 'Primaria Arcani',
            'https://www.pbf.ro/feed': 'Primaria Baia de Fier',
            'https://www.primariabalanesti.ro/feed': 'Primaria Bălănești',
            'https://www.primariabalesti.ro/feed': 'Primaria Bălești',
            'https://www.primariabarbatesti.ro/feed': 'Primaria Bărbătești',
            'https://www.primariabengesticiocadia.ro/feed': 'Primaria Bengești-Ciocadia',
            'https://www.primariaberlesti.ro/feed': 'Primaria Berlești',
            'https://www.primariabalteni.ro/feed': 'Primaria Bâlteni',
            'https://www.primariabolbosi.ro/feed': 'Primaria Bolboși',
            'https://www.primariaborascu.ro/feed': 'Primaria Borăscu',
            'https://www.primariabranesti.ro/feed': 'Primaria Brănești',
            'https://comunabumbestipitic.ro/feed': 'Primaria Bumbești-Pițic',
            'https://www.primaria-calnic.ro/feed': 'Primaria Câlnic',
            'https://www.primariacapreni.ro/feed': 'Primaria Căpreni',
            'https://www.primariacatunele.ro/feed': 'Primaria Cătunele',
            'https://www.primariaciuperceni.ro/feed': 'Primaria Ciuperceni',
            'https://www.primariacrasna.ro/feed': 'Primaria Crasna',
            'https://www.comunacruset.ro/feed': 'Primaria Crușeț',
            'https://www.primariadanciulesti.ro/feed': 'Primaria Dănciulești',
            'https://www.comunadanesti.ro/feed': 'Primaria Dănești',
            'https://www.primariadragotesti.ro/feed': 'Primaria Drăgotești',
            'https://www.primaria-dragutesti.ro/feed': 'Primaria Drăguțești',
            'https://primariafarcasesti-gj.ro/feed': 'Primaria Fărcășești',
            'https://www.primariaglogova.ro/feed': 'Primaria Glogova',
            'https://www.comunagodinesti.ro/feed': 'Primaria Godinești',
            'https://hurezani.eccompany.ro/feed': 'Primaria Hurezani',
            'https://www.primariaionesti.ro/feed': 'Primaria Ionești',
            'https://www.primariajupinesti.ro/feed': 'Primaria Jupânești',
            'https://www.primarialelesti.ro/feed': 'Primaria Lelești',
            'https://www.primarialicurici.ro/feed': 'Primaria Licurici',
            'https://www.primaria-logresti.ro/feed': 'Primaria Logrești',
            'https://www.primariamatasari.ro/feed': 'Primaria Mătăsari',
            'https://www.primariamusetesti.ro/feed': 'Primaria Mușetești',
            'https://www.comunanegomir.ro/feed': 'Primaria Negomir',
            'https://www.primariapades.ro/feed': 'Primaria Padeș',
            'https://www.pestisani.ro/feed': 'Primaria Peștișani',
            'https://www.primariaplopsoru.ro/feed': 'Primaria Plopșoru',
            'https://www.comunapolovragi.ro/feed': 'Primaria Polovragi',
            'https://www.primariaprigoria.ro/feed': 'Primaria Prigoria',
            'http://www.rosiadeamaradia.ro/feed': 'Primaria Roșia de Amaradia',
            'https://www.runcugorj.ro/feed': 'Primaria Runcu',
            'https://www.primariasacelu.ro/feed': 'Primaria Săcelu',
            'https://www.primariasamarinesti.ro/feed': 'Primaria Samarinești',
            'https://www.primariasaulesti.ro/feed': 'Primaria Săulești',
            'https://www.primaria-schela.ro/feed': 'Primaria Schela',
            'https://www.primariascoarta.ro/feed': 'Primaria Scoarța',
            'https://www.primariaslivilestigorj.ro/feed': 'Primaria Slivilești',
            'https://www.primaria-stanesti.ro/feed': 'Primaria Stănești',
            'http://primariastejari.ro/feed': 'Primaria Stejari',
            'https://www.comunastoina.ro/feed': 'Primaria Stoina',
            'https://www.primariatantareni.ro/feed': 'Primaria Țânțăreni',
            'https://www.primariatelesti-gorj.ro/feed': 'Primaria Telești',
            'https://www.primaria-turburea.ro/feed': 'Primaria Turburea',
            'https://turcinesti.ro/feed': 'Primaria Turcinești',
            'https://www.primariaurdari.ro/feed': 'Primaria Urdari',
            'https://www.primariavagiulesti.ro/feed': 'Primaria Văgiulești',
            'http://www.comunavladimir.ro/feed': 'Primaria Vladimir',
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
