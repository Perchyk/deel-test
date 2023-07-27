import { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import './autocomplete.css';
import { debounce } from '../../utils';

export interface AutocompleteData {
  id: string;
  label: string;
}

interface AutocompleteProps {
  data: AutocompleteData[];
  onChange: (value: string) => void;
  isLoading?: boolean;
  label?: string;
  numberOfResults?: number;
  minRequestLength?: number;
  onInput?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  inputProps?: HTMLAttributes<HTMLInputElement>;
  // Could also be MenuProps, PaperProps etc like in MaterialUI select - but let's not bother for now
}

export const Autocomplete = (props: AutocompleteProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const { data, label, isLoading, onChange, onInput, onFocus, onBlur, inputProps, numberOfResults = 10, minRequestLength = 3 } = props;

    useEffect(() => {
      if (data.length) {
        setDropdownVisible(true);
      }
    }, [data]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setInputValue(e.target.value);
      onInput && onInput();
    };

    const handleChange = useMemo(
      () =>
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.value.length === 0) {
            onChange('');
          }
          if (event.target.value.length < minRequestLength) {
            return;
          }
          onChange(event.target.value);
        }),
      []
     );

    const handleBlur = () => {
      // This is a bit of a hack. 
      // I want to hide the dropdown on blur, but when it's blurred because of dropdown item click, this one triggers faster so the click event never happens.
      // Blur is actually not the best thing to do it - usually there is an overlay around everything else that catches the click outside.
      setTimeout(() => {
        setDropdownVisible(false);
        onBlur && onBlur();
      }, 100);
    };

    const handleFocus = () => {
      if (data.length) {
        setDropdownVisible(true);
      }

      onFocus && onFocus();
    };

    const handleItemClick = (label: string) => {
      setInputValue(label);
      setDropdownVisible(false);
    };

    return (
      <div className="autocomplete">
        <label className="autocomplete__label">{label}</label>
        {
          isLoading ? (
            // Yes, of course this is the spinner from the web with some adjustments for the case. I just wanted a nice loading indicator.
            <div className="spinner"><div className="loader"></div></div>
          ) : null
        }
        <input type="text" role="combobox" className={`autocomplete__input ${isDropdownVisible ? 'autocomplete__input--with-results' : ''}`}
          autoCapitalize='off' autoComplete='off' spellCheck="false"
          onInput={handleInput} onBlur={handleBlur} onFocus={handleFocus} onChange={debounce(handleChange)} value={inputValue} {...inputProps}></input>
        {
          // Hardcoded maxHeight is intentional here to showcase that overflow is handled.
          // In real world, this would be handled through a styling prop or the class name.
          isDropdownVisible ? (
            <div className="autocomplete__suggestions" style={{maxHeight: '150px'}}>
              { data.map((item) => {
                // I genuinely hate this. Also, there is a bug where a part of the name gets lowercased. 
                // If I was implementing such a functionality as a real task, I would probably use some library for highlighting.
                const notHighlightedParts = item.label.toLowerCase().split(inputValue.toLowerCase());
                return (
                  <div key={item.id} className="autocomplete__suggestion" onClick={() => handleItemClick(item.label)} role="listbox">
                    <p role="option" className="autocomplete__suggestion-text">
                      {
                        inputValue && inputValue !== item.label && item.label.toLowerCase().includes(inputValue.toLowerCase()) ? (
                          <>
                          <span>{notHighlightedParts[0]}</span>
                          <span className='autocomplete__suggestion-match'>{inputValue}</span>
                          <span>{notHighlightedParts[1]}</span>
                          </>
                        ) : item.label 
                      }

                      </p>
                  </div>
                )
              })}
            </div>
          ) : null
        }
      </div>
    );
  }