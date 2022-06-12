import React from 'react'


const BAYCc = () => {
	return (
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
	)
}

export default BAYCc
