import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(key)) || initialValue
	);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue]; // when importing it we can use it by any name
};

export default useLocalStorage;
