'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import Loading from '../components/Loading';
import * as Form from '@radix-ui/react-form';
import Modal from "../components/Modal";
import { Toaster, toast } from 'sonner'

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));

    try {
        const response = await fetch('http://localhost:8000/api/v1/album/', {
        method: "POST",
        body: JSON.stringify({
          "release_year": parseInt(form.release_year as string, 10),
          "artist": form.artist,
          "name": form.name
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
        toast.success(data.message, {
          duration: 3000,
        })
  
        setAlbums(prevAlbums => [...prevAlbums, data.data]);
      }else{
        toast.custom((t) => (
          <div className='bg-red-400 text-white p-4 rounded-md'>
            <ul>
              {
                Object.values(data).map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))
              }
            </ul>
          </div>
        ))
      }
      
      
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
    
  };

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
  
  useEffect(() => { fetchAlbums() }, []);

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
          <Modal
            description='New Album'
            idAlbum={0}
            title='New Album'
          >
            <button
              className='bg-black px-4 text-white font-bold flex justify-center items-center w-48 cursor-pointer'
            >
              New Album
            </button>

            <Form.Root className="w-full" onSubmit={handleSubmit}>
              <Form.Field className="mb-4" name="name">
                <div className='flex align-baseline justify-between'>
                  <Form.Label className="FormLabel">Name Album</Form.Label>
                  <Form.Message className="text-red-500" match="valueMissing">
                    Please enter a name album
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input className="p-2 border border-slate-400 outline-none w-full" type="text" required />
                </Form.Control>
              </Form.Field>
              <Form.Field className="mb-4" name="artist">
                <div className='flex align-baseline justify-between'>
                  <Form.Label className="FormLabel">Name artist</Form.Label>
                  <Form.Message className="text-red-500" match="valueMissing">
                    Please enter a name artist
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input className="p-2 border border-slate-400 outline-none w-full" type="text" required />
                </Form.Control>
              </Form.Field>
              <Form.Field className="mb-4" name="release_year">
                <div className='flex align-baseline justify-between'>
                  <Form.Label className="FormLabel">Release Year</Form.Label>
                  <Form.Message className="text-red-500" match="valueMissing">
                    Please enter a release year
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input className="p-2 border border-slate-400 outline-none w-full" type="number" maxLength={4} required />
                </Form.Control>
              </Form.Field>
              
              
              <Form.Submit asChild>
                <button 
                  className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow"
                  type='submit'
                >
                  Post new album
                </button>
              </Form.Submit>
            </Form.Root>
          </Modal>
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
                  buttonAlbum='View Album'
                  title={album.name}
                  idAlbum={album.id}
                />
              )):
              (<p className='text-red-400'>Album not found</p>)
            }
            
          </div>
        </div>
      </div>
      <Toaster/>
    </div>
  );
}