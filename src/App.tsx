import React, { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteData } from './components/autocomplete/autocomplete';
import './app.css';

interface SWCharacter {
  name: string;
  height: string;
  films: string[];
  // And many other unrelated properties
}

const requestCache = new Map();

function App() {
  const [characters, setCharacters] = useState<AutocompleteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCharacters = (value: string) => {
    // A super naive cache to ensure that we don't fetch the same data all the time.
    // If the autocomplete was supposed to work with static data, it would have been inside of it instead and could be used to memoize the data filtering.
    if (requestCache.has(value)) {
      setCharacters(requestCache.get(value));
      return;
    }

    setIsLoading(true);
    fetch(`https://swapi.dev/api/people/?search=${value}`)
      .then(res => res.json())
      .then(res => {
        const mappedResult = res.results.map((result: SWCharacter) => ({ id: `${result.name}-${result.height}`, label: result.name }))
        setCharacters(mappedResult)
        requestCache.set(value, mappedResult);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchCharacters('');
  }, []);

  const handleChange = (value: string) => {
    fetchCharacters(value);
  };

  return (
    <div className='container'>
      <div className='container__inner'>
        <Autocomplete label='Start typing a Star Wars character name' data={characters} isLoading={isLoading} onChange={handleChange}/>
      </div>
    </div>

  );
}

export default App;
