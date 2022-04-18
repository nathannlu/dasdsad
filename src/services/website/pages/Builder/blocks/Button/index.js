import React from 'react';
import { useMintButton } from '../../hooks/useMintButton';

const Button = ({ isMint, text, link }) => {
    const { onMint, contract, size, setMintCount, mintCount, price } = useMintButton();

    return isMint ? (
        <div className="flex flex-col">
            <div className='flex'>
                {size !== -1 ? (
                    <>
                        <button onClick={onMint} class="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            {`${text} $${Web3.utils.fromWei((price * mintCount).toString())} ${contract?.nftCollection?.currency.toUpperCase()}`}
                        </button>
                        <input class="mx-2 rounded-lg bg-white-500 text-black" type="number" min={1} value={parseFloat(mintCount.toFixed(2))} max={contract?.nftCollection?.size} onChange={(e) => setMintCount(parseInt(e.target.value))}></input>
                    </>
                ) : (
                    <p>[Please switch to the right network to mint]</p>
                )}
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
