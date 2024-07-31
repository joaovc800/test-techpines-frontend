
import { useState } from 'react';
import Image from "next/image";
import * as Form from '@radix-ui/react-form';
import { Headphones, Play} from "@phosphor-icons/react";
import Modal from '../components/Modal'
import { Toaster, toast } from 'sonner'

type CardProps = {
  image?: string
  title: string
  description: string
  buttonAlbum: string
  idAlbum: number
  onButtonClick?: () => void;
}

function formatTime(minutesprop: number) {
  const totalSeconds = minutesprop * 60;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

const Card = (props: CardProps) => {

  interface Track {
    id: number;
    name: string;
    duration: number;
    album_id: number;
    created_at: string;
    updated_at: string;
  }
  
  interface Album {
    id: number;
    name: string;
    artist: string;
    release_year: number;
    created_at: string;
    updated_at: string;
    tracks: Track[];
  }

  const [album, setAlbum] = useState<Album>({
    id: 0,
    name: 'Default Album',
    artist: 'Unknown Artist',
    release_year: 1900,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tracks: []
  });

  async function fetchAlbumsById(id: number) {
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/album/' + id);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAlbum(data.data)
      
    } catch (error) {
      console.error('Error', error);
      
    } finally{
      console.log(album)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));

    try {
        const response = await fetch('http://localhost:8000/api/v1/track/', {
        method: "POST",
        body: JSON.stringify({
          "album_id": parseInt(form.album_id as string, 10),
          "duration": parseInt(form.duration as string, 10),
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

      toast.success(data.message, {
        duration: 3000,
      })
      
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
    
  };

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      {
        props.image ? (
          <Image
              src={props.image}
              alt={props.title}
              width={150}
              height={24}
              priority
          />
        ) : null
      }
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-900">{props.title}</h2>
        <p className="mt-2 text-gray-700">
          {props.description}
        </p>
        <div className='flex flex-row items-center justify-between'>
          <Modal
            description={props.title}
            idAlbum={props.idAlbum}
            title={props.title}
          >
            <button
                onClick={() => fetchAlbumsById(props.idAlbum)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow"
            >
              View Album
            </button>

            <div className='flex flex-col items-center gap-2'>
              <div className='w-44 h-44 bg-slate-300 flex items-center justify-center'>
                <Headphones
                  className='w-14 h-14 text-white'
                />
              </div>
              <p>{props.title}</p>
              <p>{props.description}</p>
            </div>
            <div className='w-full px-4'>
              <ul className='overflow-auto h-72'>
                {
                  album.tracks.length > 0 ?
                    album.tracks.map(track => (
                      <li key={track.id} className="cursor-pointer flex flex-row items-center justify-between w-full bg-slate-50 p-2 hover:bg-slate-200">
                        <div className='flex items-center gap-3'>
                          <Play/>
                          <span>{track.name}</span>
                        </div>
                        <span>{formatTime(track.duration)}</span>
                      </li>
                    ))
                  :
                  <li>No sound tracks yet</li>
                }
              </ul>
            </div>
          </Modal>
          <Modal
            title={`New Track in ${props.title}`}
            description={`New Track in ${props.title}`}
            idAlbum={props.idAlbum}
          >
            <button
                className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow"
            >
              New Track
            </button>

            <Form.Root className="w-full" onSubmit={handleSubmit}>
              <Form.Field className="mb-4" name="name">
                <div className='flex align-baseline justify-between'>
                  <Form.Label className="FormLabel">Name Track</Form.Label>
                  <Form.Message className="text-red-500" match="valueMissing">
                    Please enter a name
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input className="p-2 border border-slate-400 outline-none w-full" type="text" required />
                </Form.Control>
              </Form.Field>
              <Form.Field className="mb-4" name="duration">
                <div className='flex align-baseline justify-between'>
                  <Form.Label className="FormLabel">Duration track in minutes</Form.Label>
                  <Form.Message className="text-red-500" match="valueMissing">
                    Please enter a duration track
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input className="p-2 border border-slate-400 outline-none w-full" type="number" required />
                </Form.Control>
              </Form.Field>
              <Form.Field className="hidden" name="album_id">
                <Form.Control asChild>
                  <input type="number" value={props.idAlbum} required />
                </Form.Control>
              </Form.Field>
              <Form.Submit asChild>
                <button 
                  className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow"
                  type='submit'
                >
                  Post new track
                </button>
              </Form.Submit>
            </Form.Root>
          </Modal>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Card;
