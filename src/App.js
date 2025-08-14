import React, { useState, useEffect } from 'react';

const NewsFeedReader = () => {
  const [sources, setSources] = useState(() => JSON.parse(localStorage.getItem('newsSources')) || []);
  const [articles, setArticles] = useState([]);
  const [selectedSource, setSelectedSource] = useState('');
  const [newSource, setNewSource] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample sources for demo
  const availableSources = [
    { id: 'bbc-news', name: 'BBC News' },
    { id: 'cnn', name: 'CNN' },
    { id: 'the-guardian-uk', name: 'The Guardian' },
    { id: 'techcrunch', name: 'TechCrunch' },
  ];

  // Save sources to localStorage
  useEffect(() => {
    localStorage.setItem('newsSources', JSON.stringify(sources));
  }, [sources]);

  // Fetch articles when a source is selected
  useEffect(() => {
    if (selectedSource) {
      setLoading(true);
      setError('');
      // Note: NewsAPI requires an API key.
      const apiKey = 'a5894802147f49df8efb02f808bd4278'; 
      fetch(`https://newsapi.org/v2/top-headlines?sources=${selectedSource}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            setArticles(data.articles);
          } else {
            setError('Failed to fetch articles. Please check your API key or try again later.');
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Error fetching articles. Please try again.');
          setLoading(false);
        });
    }
  }, [selectedSource]);

  // Add a new source
  const addSource = () => {
    if (newSource && !sources.includes(newSource)) {
      setSources([...sources, newSource]);
      setNewSource('');
    }
  };

  // Remove a source
  const removeSource = (sourceId) => {
    setSources(sources.filter(id => id !== sourceId));
    if (selectedSource === sourceId) {
      setSelectedSource('');
      setArticles([]);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl emerald-100 text-slate-800 bg-red-50">
      <h1 className="text-3xl font-bold mb-6 text-center">News Feed Reader</h1>
      <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Subscribe to News Sources</h2>
        <div className="flex space-x-2 mb-4">
          <select
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a source</option>
            {availableSources.map(source => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
          <button
            onClick={addSource}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map(sourceId => {
            const source = availableSources.find(s => s.id === sourceId);
            return (
              <div
                key={sourceId}
                className="flex items-center bg-white p-2 rounded shadow"
              >
                <span className="mr-2">{source ? source.name : sourceId}</span>
                <button
                  onClick={() => removeSource(sourceId)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a Source</h2>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a source to view articles</option>
          {sources.map(sourceId => {
            const source = availableSources.find(s => s.id === sourceId);
            return (
              <option key={sourceId} value={sourceId}>
                {source ? source.name : sourceId}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Articles</h2>
        {loading && <p className="text-center">Loading articles...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && articles.length === 0 && selectedSource && (
          <p className="text-center">No articles found.</p>
        )}
        <div className="grid gap-6">
          {articles.map((article, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <p className="text-gray-600 mb-2">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeedReader;