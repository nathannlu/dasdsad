import { useState } from 'react';

export const useArray = () => {
	const [list, setList] = useState([])
	const [selected, setSelected] = useState(null)

	const addToArray = (obj) => {
		setList(prevState => {
			let newState = [...prevState, obj]
			return newState;
		})
	}

	const onChange = e => {

		const { name, value } = e.target;

		setList(prevState => {
			prevState[selected][name] = value
			return [...prevState]
		})
	}
	
	return {
		list,
		setList,
		addToArray,
		selected,
		setSelected,
		onChange
	}
}
