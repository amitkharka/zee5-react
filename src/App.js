import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

const CARDS_URL = 'https://jsonplaceholder.typicode.com/albums/1/photos/';

const debounce = (callback, delay) => {
  let timeout;
  return (...args) => {
    const later = () => {
      timeout = null;
      callback(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

function App() {
  const [searchText, setSearchText] = useState('');
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  const fetchCards = async () => {
    const result = await fetch(CARDS_URL);
    const response = await result.json();
    setCards(response);
    setFilteredCards(response);
  };

  const handleSearchOnChange = (event) => {
    const { value } = event?.currentTarget;
    debounce(() => {
      console.log('inside');
      setSearchText(value);
    }, 500)();
  };

  useEffect(() => {
    if (searchText) {
      const lowerCaseSearchText = searchText?.toLowerCase();
      const searchedCards = cards?.filter((card) => card.title?.toLowerCase().includes(lowerCaseSearchText));
      setFilteredCards(searchedCards);
    } else {
      setFilteredCards(cards);
    }
  }, [searchText]);

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <input className="app-search__input-field" type="search" autoFocus={true} onChange={handleSearchOnChange} />
      </header>
      <div className="app-container">
        {filteredCards?.length ? (
          <ul className="card-list">
            {
              filteredCards?.map((card) => (
                <li className="card-item" key={card.id}>
                  <a className="card-item__container" href={card.url} target="blank">
                    <div className="card-thumbnail__container">
                      <img className="card-thumbnail" src={card.thumbnailUrl} alt={card?.title} />
                    </div>
                    <div className="card-title">
                      {card.title}
                    </div>
                  </a>
                </li>
              ))
            }
          </ul>
        ) : (
          <div className="no-records">
            NO RECORDS
          </div>
        )}
      </div>

    </main>
  );
}

export default App;
