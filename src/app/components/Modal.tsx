
import React, { useState, useEffect, ReactNode, ReactElement  } from 'react';
import Image from "next/image";
import * as Dialog from '@radix-ui/react-dialog';
import { X, Headphones, Play} from "@phosphor-icons/react";

type ModalProps = {
  image?: string
  title: string
  description: string
  idAlbum: number
  onButtonClickAlbum?: () => void;
  children?: ReactNode;
}

const Modal = (props: ModalProps) => {

  const childrenArray = React.Children.toArray(props.children);
  const trigger = childrenArray[0] as ReactElement | undefined;
  const modalContent = childrenArray.slice(1);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className='bg-black/25 fixed inset-0'
        />
        <Dialog.Content
          className='bg-white rounded-md shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] p-4 animate-scale-modal-in'
        >
          <header className='flex flex-1'>
            <Dialog.Description className='hidden'>
              {props.title}
            </Dialog.Description>
            <Dialog.Title className='mr-auto font-bold text-lg'>
              {props.title}
            </Dialog.Title>
            <Dialog.Close className='ml-auto'>
              <X className="w-6 h-6 hover:text-red-500"/>
            </Dialog.Close>
          </header>
          <div className='container flex flex-row mt-4'>
            {modalContent}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
