import React, { useEffect } from 'react';
import { Fade } from '@material-ui/core';
import { useWeb3 } from 'libs/web3';

const Template = (props) => {
    const { loadWeb3, loadBlockchainData, account, mint } = useWeb3();
    useEffect(() => {
        (async () => {
            await loadWeb3();
            await loadBlockchainData();
        })();
    }, []);

    return (
        <Fade in={true}>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <img
                            alt="ecommerce"
                            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                            src="https://dummyimage.com/400x400"
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h2 className="text-sm title-font text-gray-500 tracking-widest">
                                BRAND NAME
                            </h2>
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                The Catcher in the Rye
                            </h1>
                            <p className="leading-relaxed">
                                Fam locavore kickstarter distillery. Mixtape
                                chillwave tumeric sriracha taximy chia
                                microdosing tilde DIY. XOXO fam indxgo
                                juiceramps cornhole raw denim forage brooklyn.
                                Everyday carry +1 seitan poutine tumeric.
                                Gastropub blue bottle austin listicle pour-over,
                                neutra jean shorts keytar banjo tattooed umami
                                cardigan.
                            </p>
                            <div className="flex">
                                <button
                                    onClick={mint}
                                    className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                                    Button
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fade>
    );
};

export default Template;
