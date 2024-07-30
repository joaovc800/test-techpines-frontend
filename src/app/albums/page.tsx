'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Loading from '../components/Loading';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from "@phosphor-icons/react";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchAlbums(name?: string) {
    setLoading(true)
    try {
      const params = name && name.length > 0 ? `?name=${name}` : ``
      const response = await fetch('http://localhost:8000/api/v1/album/search' + params);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAlbums(data.data);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
      setAlbums([]);
    } finally{
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAlbums();
  }, []);



  return (
    <div className='flex flex-col h-screen'> 
      <Loading isLoading={loading}/>
      <Header />
      <div className='flex flex-col flex-1 w-full p-4 gap-3'>
        <div className='flex gap-2 justify-between'>
          <div className='flex gap-2 w-full'>
            <input 
              type="search" 
              placeholder='Search this favorite album'
              className='p-2 border border-slate-400 w-1/4 outline-none'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <button 
              className='bg-black px-4 text-white font-bold'
              onClick={() => fetchAlbums(search)}
            >
              Apply
            </button>
          </div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className='bg-black px-4 text-white font-bold flex justify-center items-center w-48 cursor-pointer'
              >
                New Album
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay
                className='bg-black/25 fixed inset-0'
              />
              <Dialog.Content
                className='bg-white rounded-md shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] p-4'
              >
                <header className='flex flex-1'>
                  <Dialog.Close className='ml-auto'>
                    <X className="w-6 h-6"/>
                  </Dialog.Close>
                </header>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
        
        <div className='w-full flex flex-col gap-3'>
          <h1 className='text-2xl'>That of the country duo Tião Carreiro and Pardinho</h1>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3'>
            {
              albums.length > 0 ?
              albums.map((album, index) => (
                <Card
                  key={index}
                  description={`${album.artist} - ${album.release_year}`}
                  buttonText='View Album'
                  title={album.name}
                  idAlbum={album.id}
                />
              )):
              (<p className='text-red-400'>Album not found</p>)
            }
            
          </div>
        </div>
      </div>
    </div>
  );
}