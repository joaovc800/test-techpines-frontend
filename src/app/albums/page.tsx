'use client';

import { useEffect, useState } from 'react';
import Card from '../components/Card';
import * as Dialog from '@radix-ui/react-dialog';
import { Toaster, toast } from 'sonner'
import Image from "next/image";
import * as Tabs from '@radix-ui/react-tabs';
import Track from '../components/Track';
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";


export default function Albums() {

  interface Album {
    id: number;
    name: string;
    image: string;
    artist: string;
    release_year: number;
    created_at: string;
    updated_at: string;
  }

  interface Track {
    id: number;
    name: string;
    duration: number;
    image: string;
    album_id: number;
    created_at: string;
    updated_at: string;
  }

  interface InputValue {
    type: "album" | "track";
    value: string;
  }

  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [tabState, setTabState] = useState("discography")

  const [formAlbum, setFormAlbum] = useState("")
  const [formArtist, setFormArtist] = useState("")
  const [formImage, setFormImage] = useState("")
  const [formYear, setFormYear] = useState(0)

  const [inputValue, setInputValue] = useState<InputValue>({ type: "track", value: "" });
  const [debouncedValue, setDebouncedValue] = useState<InputValue>({ type: "track", value: "" });

  const [modalAlbum, setModalAlbum] = useState(false)

  async function fetchData(type: "album" | "track", name?: string) {

    const config: { [key in "album" | "track"]: (data: any) => void } = {
      "album": setAlbums,
      "track": setTracks 
    };

    try {
      const params = name && name.length > 0 ? `?name=${encodeURIComponent(name)}` : ``
      const response = await fetch(`http://localhost:8000/api/v1/${type}/search` + params);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      config[type](data.data);
    } catch (error) {
      config[type]([]);
      console.error('Error: ', error);
    }
  }
  
  useEffect(() => {
    fetchData("album")
    fetchData("track")
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
  }, 500);

  return () => {
      clearTimeout(handler);
  };
  }, [inputValue]);

  useEffect(() => {
    fetchData("album", debouncedValue.value);
  }, [debouncedValue]);

  async function deleteAlbum(id: number) {
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/album/' + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if(data.message){
        setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== id));
        toast.success(data.message);
      }
      
    } catch (error) {
      console.error('Error', error);
    }
  }

  async function postAlbums() {
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/album/', {
        method: "POST",
        body: JSON.stringify({
          "artist": formArtist,
          "name": formAlbum,
          "release_year": formYear,
          "image": formImage
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

      if(!data.data){
        const messages = Object.values(data).flat().join(", ");
        toast.custom((t) => (
          <div className={`bg-red-500 text-white p-4 rounded`}>
            {messages || 'An unknown error occurred'}
          </div>
        ))
        return
      }

      toast.success(data.message);

      setAlbums((prevAlbums) => [...prevAlbums, data.data]);

      setModalAlbum(false)
      
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  }

  return (
    <div className='flex flex-1 flex-col gap-10 w-full p-6'>
      <Toaster/>
      <div className='flex flex-col lg:flex-row items-center gap-10 w-full'>
        <div className='rounded-full flex items-center'>
          <Image
            className="rounded-full"
            src="/disco.jpg"
            alt="Dupla Caipira Tião Carreiro e  Pardinho"
            width={200}
            height={200}
            priority
          />
        </div>
        <div className='flex flex-col gap-3'>
          <h1 className='font-extrabold text-4xl'>
            Tião Carreiro and Pardinho
          </h1>
          <p className='text-slate-500'>324.408 fãs</p>
        </div>
      </div>
      <Tabs.Root className="TabsRoot" defaultValue={tabState} value={tabState} onValueChange={setTabState}>
        <Tabs.List className="flex gap-5 mb-3" aria-label="discography">
          <Tabs.Trigger
            value="discography"
            className={["text-lg py-1 hover:border-b-2", tabState == "discography" ? "border-b-purple-400 border-b-2 font-bold" : ""].join(" ")}
          >
            Discography
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="topmusics"
            className={["text-lg py-1 hover:border-b-2", tabState == "topmusics" ? "border-b-purple-400 border-b-2 font-bold" : ""].join(" ")}
          >
            Top musics
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="p-2 flex flex-col gap-3" value="discography">
          <div className='flex flex-row items-center justify-between border-b py-1'>
            <h1 className='font-bold text-2xl'>Discography</h1>
            <Dialog.Root open={modalAlbum} onOpenChange={setModalAlbum}>
              <Dialog.Trigger asChild>
                <button
                  className='bg-purple-400 text-white font-bold p-2 rounded-md flex items-center gap-2'
                >
                  New album
                  <Plus
                    className='w-5 h-5'
                  />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="bg-black/25 fixed inset-0" />
                <Dialog.Content className="bg-white rounded-md shadow-sm overflow-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] p-4 animate-scale-modal-in">
                  <Dialog.Title className="font-bold text-2xl">New Album</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    Add a new album for duo
                  </Dialog.Description>
                  <div className='mt-4 flex flex-col gap-4'>
                    <label className='cursor-pointer text-sm px-1'>
                      Album name
                      <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                        <input
                          id='name'
                          type="text"
                          placeholder='Album name'
                          className='bg-transparent w-full outline-none py-1'
                          onChange={(e) => setFormAlbum(e.target.value)}
                        />
                      </div>
                    </label>
                    <label className='cursor-pointer text-sm px-1'>
                      Artist
                      <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                        <input
                          id='artist'
                          type="text"
                          placeholder='Artist'
                          className='bg-transparent w-full outline-none py-1'
                          onChange={(e) => setFormArtist(e.target.value)}
                        />
                      </div>
                    </label>
                    <label className='cursor-pointer text-sm px-1'>
                      Release Year
                      <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                        <input
                          id='release_year'
                          type="number"
                          placeholder='Release Year'
                          className='bg-transparent w-full outline-none py-1'
                          onChange={(e) => setFormYear(parseInt(e.target.value))}
                        />
                      </div>
                    </label>
                    <label className='cursor-pointer text-sm px-1'>
                      URL image album (optional)
                      <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                        <input
                          id='image_album'
                          type="url"
                          placeholder='URL image album'
                          className='bg-transparent w-full outline-none py-1'
                          onChange={(e) => setFormImage(e.target.value)}
                        />
                      </div>
                    </label>
                  </div>
                    
                  <div className="flex justify-end mt-5">
                    <button 
                      className="bg-purple-400 p-2 text-white rounded-md"
                      onClick={postAlbums}
                    >
                      Save album
                    </button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          

          <div className='flex items-center py-2 px-3 bg-slate-200 w-1/3 rounded-md gap-3'>
            <MagnifyingGlass
              className='w-5 h-5'
            />
            <input 
              type="text"
              placeholder='Search albums'
              className='bg-transparent w-full outline-none py-1'
              onChange={(e) => setInputValue({type: 'album', value: e.target.value})}
            />
          </div>
          <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
            {
              albums.length > 0 ?
                albums.map((album) => (
                  <Card
                    key={album.id}
                    description={`${album.artist} - ${album.release_year}`}
                    buttonAlbum='View Album'
                    title={album.name}
                    idAlbum={album.id}
                    onDelete={() => deleteAlbum(album.id)}
                  />
                ))
              : <p>Album not found</p>
            }
          </div>
        </Tabs.Content>
        <Tabs.Content className="p-2 flex flex-col gap-3" value="topmusics">
          <h1 className='font-bold text-2xl border-b py-1'>Top musics</h1>
          <div className='flex flex-col gap-3'>
            <Track
              data={tracks}
              search={true}
            />
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}