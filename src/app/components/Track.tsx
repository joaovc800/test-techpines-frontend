
import { useState, useEffect  } from 'react';
import { Trash, Play, MagnifyingGlass} from "@phosphor-icons/react";
import { Toaster, toast } from 'sonner'

type TrackPropsValues = {
    id: number;
    name: string;
    duration: number;
    album_id: number;
    created_at: string;
    updated_at: string;
}

type TrackProps = {
  data: TrackPropsValues[];
  search: boolean
}

interface InputValue {
  type: "album" | "track";
  value: string;
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

const Track = (props: TrackProps) => {

  const [tracks, setTracks] = useState<TrackPropsValues[]>([]);

  const [inputValue, setInputValue] = useState<InputValue>({ type: "track", value: "" });
  const [debouncedValue, setDebouncedValue] = useState<InputValue>({ type: "track", value: "" });

  async function fetchData(type: "track", name?: string) {

    const config: { [key in "track"]: (data: any) => void } = {
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
    if (props.search) {
      const handler = setTimeout(() => {
          setDebouncedValue(inputValue);
      }, 500);

      return () => {
          clearTimeout(handler);
      };
    }
  }, [inputValue, props.search]);

  useEffect(() => {
      if (props.search) {
        fetchData("track", debouncedValue.value);
      }
  }, [debouncedValue, props.search]);

  /* useEffect(() => {
    setTracks(props.data);
  }, [props.data]) */

  async function deleteTrack(trackId: number){
    try {
      const response = await fetch('http://localhost:8000/api/v1/track/' + trackId, {
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
  
      setTracks(tracks => tracks.filter(track => track.id !== trackId));
  
      if (!data.message) return
      toast.success(data.message, {
          duration: 4000,
      });
    
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  }

  return (
    <>
      { 
        props.search ? (
          <div className='flex items-center py-2 px-3 bg-slate-200 w-1/3 rounded-md gap-3'>
            <MagnifyingGlass
              className='w-5 h-5'
            />
            <input 
              type="text"
              placeholder='Search tracks'
              className='bg-transparent w-full outline-none py-1'
              onChange={(e) => setInputValue({type: 'track', value: e.target.value})}
            />
        </div>
        ) : null
      }
      
      <ul className='overflow-auto'>
        {
          tracks.length > 0 ?
            tracks.map(track => (
              <li key={track.id} className="cursor-pointer flex flex-row items-center justify-between w-full p-2 hover:bg-slate-200">
                <div className='flex items-center gap-3'>
                  <Play/>
                  <span>{track.name}</span>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <span>{formatTime(track.duration)}</span>
                  <Trash
                    className='text-red-500'
                    onClick={() => deleteTrack(track.id)}
                  />
                </div>
              </li>
            ))
          :
          <li>No sound tracks yet</li>
        }
      </ul>
      <Toaster/>
    </>
  );
};

export default Track;
