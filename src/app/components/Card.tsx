
import React from 'react';
import Image from "next/image";
import * as Dialog from '@radix-ui/react-dialog';
import { X } from "@phosphor-icons/react";

type CardProps = {
  image?: string
  title: string
  description: string
  buttonText: string
  onButtonClick?: () => void;
}

const Card = (props: CardProps) => {
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
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {props.buttonText}
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
    </div>
  );
};

export default Card;
