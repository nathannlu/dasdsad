import React from 'react';
import { useContractActions } from './hooks/useContractActions';

const ContractV2 = () => {
	const { mint, updateSale, getPublicVariables } = useContractActions();
	
	return (
		<div>
			<button onClick={()=>mint()}>
				Mint
			</button>
			<button onClick={()=>updateSale()}>
				Open
			</button>
			<button onClick={()=>getPublicVariables()}>
				getPublicVarables
			</button>
		</div>
	)
};

export default ContractV2;
