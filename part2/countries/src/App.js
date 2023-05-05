import { useState, useEffect } from 'react';
import axios from 'axios';

const countryAPI = "https://restcountries.com/v3.1/all";

const CountryData = ({ name, show }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (show) {
      axios
        .get(`https://restcountries.com/v3.1/name/${name}`)
        .then((resp) => setData(resp.data[0]));
    } else {
      setData(null);
    }
  }, [name, show]);

  if (data) {
    return (
      <>
        <h2>{name}</h2>
        <p>capital {data.capital}</p>
        <p>area {data.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.keys(data.languages).map((key) => <li key={key}>{data.languages[key]}</li>)}
        </ul>
        <img src={data.flags.png} alt="flag" />
      </>
    );
  }
  return null;
}

const Country = ({ name }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      {name}
      <button onClick={() => setShow(!show)}>show</button>
      <CountryData name={name} show={show} />
    </div>
  )
}

const Filter = ({ countries, name }) => {
  const dispCountry = countries.filter((country) =>
    country.name.common.toLowerCase().includes(name.toLowerCase())
  );

  if (dispCountry.length > 10) {
    return (
      <>Too many matches, specify another filter</>
    );
  } else if (dispCountry.length === 1) {
    return <CountryData name={dispCountry[0].name.common} show={true} />
  } else {
    return dispCountry.map((country, index) => <Country key={index} name={country.name.common} />)
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
