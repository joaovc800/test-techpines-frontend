'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';

export default function Albums() {

  interface Album {
    id: number;
    name: string;
    artist: string;
    release_year: number;
    created_at: string;
    updated_at: string;
  }

  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await fetch('http://localhost:8000/api/v1/album/search');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAlbums(data.data);
      } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
      }
    }

    fetchAlbums();
  }, []);

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <div className='flex flex-row flex-1 w-full'>
        <aside className='bg-slate-50 w-1/4 h-full'>
          123
        </aside>
        <div className='w-full p-4 flex flex-col gap-3'>
          <h1 className='text-2xl'>That of the country duo Tião Carreiro and Pardinho</h1>
          <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3'>
            {albums.map((album, index) => (
              <Card
                key={index}
                description={`${album.artist} - ${album.release_year}`}
                buttonText='View Album'
                title={album.name}
              />
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}