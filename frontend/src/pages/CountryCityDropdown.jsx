import React, { useState } from "react";

const countryCityData = {
  India: ["Mumbai", "Delhi", "Pune"],
  USA: ["New York", "Los Angeles", "Chicago"],
  Canada: ["Toronto", "Vancouver", "Montreal"]
};

const CountryCityDropdown = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setCities(countryCityData[country] || []);
    setSelectedCity(""); // Reset city
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="p-4">
      <label htmlFor="country" className="block font-semibold mb-1">Country:</label>
      <select
        id="country"
        value={selectedCountry}
        onChange={handleCountryChange}
        className="border px-2 py-1 rounded w-full mb-4"
      >
        <option value="">Select Country</option>
        {Object.keys(countryCityData).map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      <label htmlFor="city" className="block font-semibold mb-1">City:</label>
      <select
        id="city"
        value={selectedCity}
        onChange={handleCityChange}
        disabled={!cities.length}
        className="border px-2 py-1 rounded w-full"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  );
};

export default CountryCityDropdown;
