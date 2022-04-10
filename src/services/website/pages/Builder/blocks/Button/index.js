import React from 'react';
import { useMintButton } from '../../hooks/useMintButton';

const Button = ({ isMint, text, link }) => {
    const { onMint, contract, size, setMintCount, mintCount } = useMintButton();

    return isMint ? (
        <div className="flex flex-col">
            <div className="flex">
                <button
                    onClick={onMint}
                    className="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    {`${text} $${
                        contract?.nftCollection?.price * mintCount
                    } ${contract?.nftCollection?.currency.toUpperCase()}`}
                </button>
                <input
                    className="mx-2 rounded-lg bg-white-500"
                    type="number"
                    min="1"
                    value={mintCount}
                    max={contract?.nftCollection?.size}
                    onChange={(e) => setMintCount(e.target.value)}></input>
            </div>
            {size !== -1 && <p>{`${size}/${contract?.nftCollection?.size}`}</p>}
        </div>
    ) : (
        <button
            onClick={() => (window.location.href = link)}
            className="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
            {text}
        </button>
    );
};

export default Button;
