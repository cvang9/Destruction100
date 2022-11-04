import React, { useEffect, useState } from 'react';
import './selectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/Epic.json';
/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {

    const [characters, setCharacters] = useState([]);
    const [gameContract, setGameContract] = useState(null);

    // UseEffect
    useEffect(() => {
    const { ethereum } = window;
  
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
  
      /*
       * This is the big difference. Set our gameContract in state.
       */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
  
        /*
         * Call contract to get all mint-able characters
         */
        const charactersTxn = await gameContract.getAllMemeLords();
        console.log('charactersTxn:', charactersTxn);
  
        /*
         * Go through all of our characters and transform the data
         */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );
  
        /*
         * Set all mint-able characters in state
         */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    const memeMinted = async (sender, tokenId, characterIndex) => {
        console.log(
          `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
        );
    
        /*
         * Once our character NFT is minted we can fetch the metadata from our contract
         * and set it in state to move onto the Arena
         */
        if (gameContract) {
          const characterNFT = await gameContract.isUserMemer();
          console.log('CharacterNFT: ', characterNFT);
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      };

   
    /*
     * If our gameContract is ready, let's get characters!
     */
    if (gameContract) {
      getCharacters();

      gameContract.on('memeMinted', memeMinted);
          /*
     * Setup NFT Minted Listener
     */

    }

    return () => {
        /*
         * When your component unmounts, let;s make sure to clean up this listener
         */
        if (gameContract) {
          gameContract.off('memeMinted', memeMinted);
        }
      };

    }, [gameContract]);

  const renderCharacters = () =>
  characters.map((character, index) => (
    <div class="flex-row-reverse">
    <div class="flex ml-96">
        <div class="max-w-xs rounded-md shadow-md dark:bg-gray-900 dark:text-gray-100 mb-36 ml-48">
            <img src={character.imageURI} alt={character.name} class="object-cover object-center w-full rounded-t-md h-72 dark:bg-gray-500"/>
            <div class="flex flex-col justify-between p-6 space-y-8">
                <div class="space-y-1">
                    <h2 class="text-xl font-semibold tracking-wide">NFT NAME : {character.name}</h2>
                    <h2 class="text-xl font-semibold tracking-wide">DESTROY POWER  : {character.dp}</h2>
                    <h2 class="text-lg font-semibold tracking-wide">DESTROY POWER PER SEC : {character.dps}</h2>
                    <p class="dark:text-gray-100">Curabitur luctus erat nunc, sed ullamcorper erat vestibulum eget.</p>
                </div>
                <button type="button" class="flex items-center justify-center w-full p-3 font-semibold tracking-wide rounded-md dark:bg-rose-400 dark:text-gray-900" onClick={()=> mintCharacterNFTAction(index) }>{`Mint ${character.name}`}</button>
            </div>
        </div>
        </div>
        </div>
  ));

  const mintCharacterNFTAction = async (characterId) => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintMeme(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.warn('MintCharacterAction Error:', error);
    }
  };
  
  return (
  <div className="text-white setbg">
    <h2 className="mb-10 text-center font-serif text-2xl">Mint Your Hero. Choose wisely.</h2>
    {/* Only show this when there are characters in state */}
    { (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
     );

};

export default SelectCharacter;