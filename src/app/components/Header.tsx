
import React from 'react';
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className='bg-black flex flex-col md:flex-row lg:flex-row items-center justify-between px-2'>
      <a href='/'>
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/logo.svg"
          alt="Dupla Caipira Tião Carreiro e  Pardinho"
          width={100}
          height={100}
          priority
        />
      </a>
      <p className='text-white font-bold'>Discos Tião Carreiro e Pardinho</p>
    </header>
  );
};

export default Header;
