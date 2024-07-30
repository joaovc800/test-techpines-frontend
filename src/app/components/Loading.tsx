import React from 'react';
import ReactLoading from 'react-loading';

type LoadingProps = {
  isLoading: boolean;
}

const Loading = (props: LoadingProps) => {
  return (
    <div className={`${props.isLoading ? `fixed` : `hidden`} w-full h-screen backdrop-blur-sm`}>
      <div className='flex items-center justify-center h-full'>
        <ReactLoading type="spin" color="#3490dc" height={100} width={100} />
      </div>
    </div>
  );
};

export default Loading;
