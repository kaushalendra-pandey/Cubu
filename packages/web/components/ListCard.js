import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import Image from 'next/image';

function ListCard({ make, model, description, year, price, pictureUrl }) {
  return (
    <div className="flex py-7 px-2 pr-4 border-b cursor-pointer hover:opacity-80 hover:shadow-lg treansition duration-200 ease-out first: border-t">
      {pictureUrl != null && (
        <div className="relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0">
          <Image className="rounded-2xl" layout="fill" objectFit="cover" src={pictureUrl} />
        </div>
      )}
      <div className="flex flex-col flex-grow pl-5">
        <div className="flex justify-end">
          <button>
            <PencilIcon className="h-7 cursor-pointer text-blue-600" />
          </button>
          <button>
            <TrashIcon className="h-7 cursor-pointer text-red-600" />
          </button>
        </div>
        <h4 className="text-xl">
          {make} {model}
        </h4>
        <h2 className="text-md">{year}</h2>
        <div className="border-b w-10 pt-2" />
        <p className="pt-2 text-sm text-gray-500 flex-grow">{description}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-lg lg:text-2xl font-semibold pb-2">₹{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
