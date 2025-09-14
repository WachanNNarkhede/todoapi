import React, { useState, useEffect, type FormEvent } from 'react';

interface Book {
  key: string;         
  title: string;
  author_name?: string[];  
  first_publish_year?: number;
}

interface SearchResponse {
  numFound: number;
  docs: Book[];
}

export const BookSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('harry potter');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async (q: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data: SearchResponse = await resp.json();
      setBooks(data.docs);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect: fetch on initial mount
  useEffect(() => {
    fetchBooks(query);
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim() !== '') {
      fetchBooks(query);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Book Search</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          style={{ width: '300px', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      {loading && <p>Loading books...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {books.length === 0 && <li>No books found.</li>}
          {books.map((book) => (
            <li key={book.key}>
              <strong>{book.title}</strong>
              {book.author_name && book.author_name.length > 0 && (
                <span> — {book.author_name.join(', ')}</span>
              )}
              {book.first_publish_year && (
                <span> ({book.first_publish_year})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ()()                           `                                                      