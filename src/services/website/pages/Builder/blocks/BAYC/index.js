import React from 'react';
import { Fade } from '@material-ui/core';
import Button from '../Button';

const Template = (props) => {
    return (
        <Fade in={true}>
            <section
                className="text-gray-600 body-font"
                style={{
                    background: 'black',
                    color: 'white',
									fontFamily: "Montserrat"
                }}>

							<nav className="w-full">
								<div>
									<img style={{height: '75px'}} src="https://ik.imagekit.io/bayc/assets/bayc-logo-z.png" />
								</div>
							</nav>

							<header className="container mx-auto">
								<img src="https://ik.imagekit.io/bayc/assets/bayc-mutant-hero.jpg" />
							</header>

							<main>
								<section className="container mx-auto flex flex-wrap py-12 px-8">
									<div className="w-2/3 pr-32">
										<h2 style={{fontStyle: 'italic', fontWeight: 900, fontSize: '28px'}} className="mb-4">
											WELCOME TO <br />
											THE BORED APE YACHT CLUB
										</h2>
										<p>
											BAYC is a collection of 10,000 Bored Ape NFTs—unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation.
										</p>
									</div>
									<div className="w-1/3 flex flex-wrap">
										<div className="w-1/2 p-2">
											<img src="https://ik.imagekit.io/bayc/assets/ape1.png" />
										</div>
										<div className="w-1/2 p-2">
											<img src="https://ik.imagekit.io/bayc/assets/ape2.png" />
										</div>
										<div className="w-1/2 p-2">
											<img src="https://ik.imagekit.io/bayc/assets/ape3.png" />
										</div>
										<div className="w-1/2 p-2">
											<img src="https://ik.imagekit.io/bayc/assets/ape4.png" />
										</div>
									</div>
								</section>

								
								<section className="container mx-auto py-12 px-8 flex flex-wrap">
									<div className="mb-4 w-full">
										<h2 style={{color: '#bfc500', fontWeight: 500, fontStyle: 'italic', fontSize: '24px'}}>
											FAIR DISTRIBUTION
										</h2>
										<h3>
											(BONDING CURVES ARE A PONZI)
										</h3>
									</div>
									<div className="w-1/2">
										<p>
											There are no bonding curves here. Buying a Bored Ape costs 0.08 ETH. There are no price tiers; BAYC membership costs the same for everyone.
										</p>
									</div>
									<div className="w-1/2 pl-4">
										<p>
											Note: Thirty apes are being withheld from the sale. These will be used for giveaways, puzzle rewards—and for the creators' BAYC memberships.
										</p>
									</div>
								</section>

								<div className="container mx-auto flex flex-wrap">
									<section style={{backgroundColor: '#bfc500', color: 'black'}} className="w-full flex flex-wrap py-8 items-center">
										<div className="w-1/3 text-center">
											<h3 style={{fontSize: '28px', fontWeight: 900, fontStyle: 'italic'}}>
												BUY AN APE
											</h3>
										</div>
										<div className="w-1/3">
											<p>
												The initial sale has sold out. To get your Bored Ape, check out the collection on OpenSea.
											</p>
										</div>
										<div className="w-1/3 text-center">
											<button style={{
												padding: '16px',
												borderRadius: '8px',
												backgroundColor: '#000',
										    color: '#bfc500',
												fontWeight: 600,
												textTransform: 'uppercase',
											}}>
												Buy an ape on opensea
											</button>
										</div>
									</section>
								</div>

								<section className="container mx-auto flex flex-wrap py-12 py-12 px-8">
									<div className="w-2/3">
										<h2 style={{fontSize: '28px', fontWeight: 900, fontStyle: 'italic'}}>
											ROADMAP ACTIVATIONS
										</h2>
										<p>
											We’re in this for the long haul.
										</p>
										<p>
											We’ve set up some goalposts for ourselves. Once we hit a target sell through percentage, we will begin to work on realizing the stated goal.
										</p>
										
										<div className="flex my-4">
											<div style={{width: '10%'}}>
												10%
											</div>
											<div>
												We pay back our moms.
											</div>
										</div>
										<div className="flex my-4">
											<div style={{width: '10%'}}>
												10%
											</div>
											<div>
												We pay back our moms.
											</div>
										</div>

									</div>
									<div className="w-1/3 p-16">
										<img className="mx-auto" style={{backgroundColor: '#bfc500'}} src="https://ik.imagekit.io/bayc/assets/shirt.png" />
									</div>
								</section>
							</main>

							<footer className="px-8 py-8">
								<hr style={{background: 'white'}} />
								<div className="flex flex-wrap items-center">
									<div className="text-left" style={{width: '180px'}}>
										<img src="https://ik.imagekit.io/bayc/assets/bayc-footer.png" />
									</div>

									<div className="ml-auto text-right">
										<small>
											© 2021 Yuga Labs LLC
										</small>
									</div>
								</div>
							</footer>

            </section>
        </Fade>
    );
};

export default Template;


