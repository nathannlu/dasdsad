import bs58 from 'bs58';

import { toBuffer } from  '../accounts';
import { useSolana } from  '../../index';
test('toBuffer Function', () => {
    const address = "127xW67HTbXXzYvwzU4aZaz6vkY7cyPyycmsrLz5Q4cz";
    console.log(address.toBuffer());    
    const addressDecoded = bs58.decode(address);
    console.log(addressDecoded);
    expect(addressDecoded).toHaveLength(32);
});

test('toBuffer Function2', () => {
    const address = "127xW67HTbXXzYvwzU4aZaz6vkY7cyPyycmsrLz5Q4cz";
    const addressDecoded = address.toBuffer();
    console.log(addressDecoded);
    expect(addressDecoded).toHaveLength(32);
});