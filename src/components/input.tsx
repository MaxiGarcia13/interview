import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';
import './input.css';

interface User {
  id: string;
  name: string;
  email: string;
}

export function Input() {
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<Array<User>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    setShowSuggestions(false);
  };

  const debouncedGetUser = debounce((value: string) => {
    return fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data: Array<User>) => {
        const query = value.toLowerCase();
        setData(data.filter((user: User) => {
          return user.name.toLowerCase().includes(query)
            || user.email.toLowerCase().includes(query);
        }));
      });
  }, 800);

  useEffect(() => {
    if (!value)
      return;

    debouncedGetUser(value);
  }, [value]);

  const suggestionsOpen = showSuggestions && value.length > 0 && data.length > 0;

  return (
    <div className="input-combobox">
      <input
        className="input-field"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(setShowSuggestions, 150, false)}
        role="combobox"
        aria-expanded={suggestionsOpen}
        aria-controls="user-suggestions"
        aria-autocomplete="list"
        autoComplete="off"
      />
      {suggestionsOpen && (
        <ul id="user-suggestions" className="input-datalist" role="listbox">
          {data.map((user) => (
            <li
              key={user.id}
              className="input-datalist-option"
              role="option"
              tabIndex={-1}
              onMouseDown={(event) => {
                event.preventDefault();
                handleSelect(user.name);
              }}
            >
              <span className="input-datalist-name">{user.name}</span>
              <span className="input-datalist-email">{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
