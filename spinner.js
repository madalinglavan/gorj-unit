document.addEventListener('DOMContentLoaded', function() {
    const newsContainer = document.getElementById('stiri-locale');
    const loadingSpinner = document.getElementById('loading-spinner');

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
