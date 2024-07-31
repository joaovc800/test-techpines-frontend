
import { useState } from 'react';
import Image from "next/image";
import * as Form from '@radix-ui/react-form';
import { Headphones, Plus, Trash} from "@phosphor-icons/react";
import Modal from '../components/Modal'
import Track from '../components/Track'
import { toast } from 'sonner'
import * as Dialog from '@radix-ui/react-dialog';

type CardProps = {
  image?: string
  title: string
  description: string
  buttonAlbum: string
  idAlbum: number
  onDelete?: () => void;
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
    image: string;
    duration: number;
    album_id: number;
    created_at: string;
    updated_at: string;
  }
  
  interface Album {
    id: number;
    name: string;
    artist: string;
    image: string;
    release_year: number;
    created_at: string;
    updated_at: string;
    tracks: Track[];
  }

  const [album, setAlbum] = useState<Album>({
    id: 0,
    name: 'Default Album',
    artist: 'Unknown Artist',
    image: "",
    release_year: 1900,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tracks: []
  });

  const [formTrackName, setFormTrackName] = useState("")
  const [formDuration, setFormDuration] = useState(0)
  const [formImage, setFormImage] = useState("")
  
  const [modalTrack, setModalTrack] = useState(false)

  

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
    }
  }

  async function postTrack() {
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/track/', {
        method: "POST",
        body: JSON.stringify({
          "name": formTrackName,
          "duration": formDuration,
          "album_id": props.idAlbum,
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
      
      toast.success(data.message)

      setModalTrack(false)

    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border border-gray-200 shadow-md overflow-hidden">
      <div className='w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-purple-500'>
        <Headphones
          className='w-36 h-36 text-white'
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <Modal
          description={props.title}
          idAlbum={props.idAlbum}
          title={props.title}
        >
          <div 
            className='flex flex-col gap-2 cursor-pointer hover:underline'
            onClick={() => fetchAlbumsById(props.idAlbum)}
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {props.title}
            </h2>
            {props.description}
          </div>

          <div className='flex flex-col gap-5 w-full'>
            <div className='flex flex-col lg:flex-row items-center gap-10'>
              <div className='flex items-center'>
                <Image
                  className="rounded-sm"
                  src="/disco.jpg"
                  alt="Dupla Caipira Tião Carreiro e  Pardinho"
                  width={200}
                  height={200}
                  priority
                />
              </div>
              <div className='flex flex-col gap-3'>
                <h1 className='font-extrabold text-4xl'>
                  {props.title}
                </h1>
                <p>{props.description}</p>
                <p className='text-slate-500'>
                  {
                    album ? `
                      ${album.tracks.length} tracks | ${album.release_year} | ${formatTime(album.tracks.reduce((sum, track) => sum + track.duration, 0))} | 324.408 fãs
                    ` : ""
                  }
                </p>
              </div>
            </div>
            <div className='p-4 w-full'>
              <h1 className='font-bold text-2xl border-b py-1'>Tracks</h1>
              <div className='w-full mt-3'>
                <Track
                  data={album.tracks}
                  search={false}
                />
              </div>
            </div>
          </div>
        </Modal>
        
        <div className='flex gap-2 mt-3'>
          <Dialog.Root open={modalTrack} onOpenChange={setModalTrack}>
            <Dialog.Trigger asChild>
              <button className='rounded-full bg-purple-400 p-3'>
                <Plus
                  className='text-white'
                />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/25 fixed inset-0" />
              <Dialog.Content className="bg-white rounded-md shadow-sm overflow-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] p-4 animate-scale-modal-in">
                <Dialog.Title className="font-bold text-2xl">New track</Dialog.Title>
                <Dialog.Description className="DialogDescription">
                  Add a new track in album { props.title }
                </Dialog.Description>
                <div className='mt-4 flex flex-col gap-4'>
                  <label className='cursor-pointer text-sm px-1'>
                    Track name
                    <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                      <input
                        id='name'
                        type="text"
                        placeholder='Track name'
                        className='bg-transparent w-full outline-none py-1'
                        onChange={(e) => setFormTrackName(e.target.value)}
                      />
                    </div>
                  </label>
                  <label className='cursor-pointer text-sm px-1'>
                    Duration in minutes
                    <div className='flex items-center py-2 px-3 bg-slate-200 rounded-md gap-3 mt-1 w-full'>
                      <input
                        id='duration'
                        type="number"
                        placeholder='Duration track'
                        className='bg-transparent w-full outline-none py-1'
                        onChange={(e) => setFormDuration(parseInt(e.target.value))}
                      />
                    </div>
                  </label>
                  <label className='cursor-pointer text-sm px-1'>
                      URL image track (optional)
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
                    onClick={postTrack}
                  >
                    Save track
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <button 
            className='rounded-full bg-red-400 p-3'
            onClick={props.onDelete}
          >
            <Trash
              className='text-white'
            />
        </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
