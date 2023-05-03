import { useState, useEffect } from 'react';
import axios from 'axios';

const countryAPI = "https://restcountries.com/v3.1/all";

const Filter = ({ countries, name }) => {
  const [capital, setCapital] = useState('');
  const [area, setArea] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [flagUrl, setFlagUrl] = useState('');
  const dispCountry = countries.filter((country) =>
    country.name.common.toLowerCase().includes(name.toLowerCase())
  );

  useEffect(() => {
    if (dispCountry.length === 1) {
      axios
        .get(`https://restcountries.com/v3.1/name/${dispCountry[0].name.common}`)
        .then((resp) => {
          setCapital(resp.data[0].capital);
          setArea(resp.data[0].area);
          setLanguages(resp.data[0].languages);
          setFlagUrl(resp.data[0].flags.png);
        });
    }
  }, [dispCountry, name]);

  if (dispCountry.length > 10) {
    return (
      <>Too many matches, specify another filter</>
    );
  } else if (dispCountry.length === 1) {
    return (
      <>
        <h2>{dispCountry[0].name.common}</h2>
        <p>capital {capital}</p>
        <p>area {area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.keys(languages).map((key) => <li key={key}>{languages[key]}</li>)}
        </ul>
        <img src={flagUrl} alt="flag" />
      </>
    );
  } else {
    return dispCountry.map((country, index) => <p key={index}>{country.name.common}</p>);
  };
};

const App = () => {
  const [name, setName] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get(countryAPI).then((resp) => {
      setCountries(resp.data);
    });
  }, []);

  return (
    <div>
      <div>
        find countries
        <input value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <Filter countries={countries} name={name} />
    </div>
  );
};

export default App;
