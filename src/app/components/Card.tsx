
import React from 'react';
import Image from "next/image";

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
        <p className="mt-2 text-gray-700">{props.description}</p>
        <button
          onClick={props.onButtonClick}
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
