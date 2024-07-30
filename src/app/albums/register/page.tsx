'use client';

import { useEffect, useState, FormEvent  } from 'react';
import Header from '../../components/Header';


export default function Albums() {

  const [name, setName] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState(0);

  async function postAlbums(event: FormEvent<HTMLFormElement>) {
    
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/v1/album/', {
        method: "POST",
        body: JSON.stringify({
          "artist": artist,
          "name": name,
          "release_year": year
        }),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if(data.data){
        window.location.href = "/albums";
      }
      
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  }

  return (
    <div className='flex flex-col h-screen'> 
      <Header />
      <div className='flex flex-col flex-1 w-full p-4 gap-3'>
        <form className='flex flex-col gap-3' onSubmit={postAlbums}>
          <label htmlFor='album-name' className='cursor-pointer flex flex-col gap-1'>
              Album Name
              <input
                id='album-name'
                type="text"
                placeholder='Input Album name'
                className='p-2 border border-slate-400 w-1/4 outline-none'
                onChange={(e) => setName(e.target.value)}
              />
          </label>

          <label htmlFor='album-artist' className='cursor-pointer flex flex-col gap-1'>
              Album Artist
              <input
                id='album-artist'
                type="text"
                placeholder='Input Album Artist'
                className='p-2 border border-slate-400 w-1/4 outline-none'
                onChange={(e) => setArtist(e.target.value)}
              />
          </label>

          <label htmlFor='album-release-year' className='cursor-pointer flex flex-col gap-1'>
              Album Release Year
              <input
                id='album-release-year'
                type="number"
                placeholder='Input Release Year'
                className='p-2 border border-slate-400 w-1/4 outline-none'
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
          </label>
          <div>
            <button
              className='bg-black p-3 text-white font-bold'
              type='submit'
            >
              Submit
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}