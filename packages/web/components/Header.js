import { useMutation, useQuery } from '@apollo/client';
import { GlobeAltIcon, MenuIcon, SearchIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/solid';
import { useMediaQuery } from '@react-hook/media-query';
import { useRouter } from 'next/dist/client/router';
import Image from 'next/image';
import { useState } from 'react';
import { DateRange, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Logout } from '../graphql/mutations/logout.graphql';
import { Me } from '../graphql/queries/me.graphql';

function Header({ placeholder }) {
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); //need to fix to tomorrow's date
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [showloginOptions, setshowloginOptions] = useState(false);
  const router = useRouter();
  const [logout] = useMutation(Logout);
  const { loading, data } = useQuery(Me);
  let body = null;

  const signOut = async () => {
    await logout();
    router.reload();
  };

  const handleSelect = ranges => {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  };

  const resetInput = () => {
    setSearchInput('');
  };

  const toggleLoginOptions = () => {
    setshowloginOptions(!showloginOptions);
  };

  const search = () => {
    router.push({
      pathname: '/search',
      query: {
        location: searchInput,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        numberOfGuests
      }
    });
  };

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: 'selection',
    minDate: new Date()
  };

  if (data?.me) {
    body = (
      <div className="flex flex-col drop-shadow-lg border-2 border-gray-200 items-center space-x-2 fixed bg-white mt-4 rounded p-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Loading...</p>
            </div>
          </div>
        ) : (
          <button className="flex items-center space-x-2" onClick={signOut}>
            <p className="text-m">Log out</p>
          </button>
        )}
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col drop-shadow-lg border-2 border-gray-200 items-center space-x-2 fixed bg-white mt-4 rounded p-2">
        <button className="flex items-center space-x-2" onClick={() => router.push('/signin')}>
          <p className="text-m">Sign in</p>
        </button>
        <button className="flex items-center space-x-2 mt-3" onClick={() => router.push('/signup')}>
          <p className="text-m">Sign up</p>
        </button>
      </div>
    );
  }

  //listen to small screen change for date picker
  const isSmallScreen = useMediaQuery('(max-width: 36rem)');

  return (
    <header className="sticky top-0 z-50 grid grid-cols-3 bg-white shadow-md py-2 px-5 md:px-10">
      {/* Left */}
      <div onClick={() => router.push('/')} className="relative flex items-center h-10 cursor-pointer my-auto -ml-10">
        <Image src={require('../assets/adaptive-icon.png')} width={200} height={200} />
      </div>

      {/* Middle */}
      <div className="flex items-center md:border-2 rounded-full py-2 md:shadow-sm">
        <input
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
          className="flex-grow pl-5 bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
          type="text"
          placeholder={placeholder || 'Start your search'}
        />
        <SearchIcon
          className="hidden md:inline-flex h-8 bg-indigo-500 text-white rounded-full p-2 cursor-pointer md:mx-2"
          onClick={search}
        />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4 justify-end text-gray-500">
        <p className="hidden md:inline cursor-pointer">Host your car</p>
        <GlobeAltIcon className="h-6" />
        <div>
          <button onClick={toggleLoginOptions} className="flex items-center space-x-2 border-2 p-2 rounded-full">
            <MenuIcon className="h-6" />
            <UserCircleIcon className="h-6" />
          </button>
          {showloginOptions && body}
        </div>
      </div>

      {/* Date picker range */}
      {searchInput && (
        <div className="flex flex-col col-span-3 mx-auto mt-5">
          {isSmallScreen ? (
            <DateRange ranges={[selectionRange]} minDate={new Date()} rangeColors={['#FD5B61']} onChange={handleSelect} />
          ) : (
            <DateRangePicker ranges={[selectionRange]} minDate={new Date()} rangeColors={['#FD5B61']} onChange={handleSelect} />
          )}
          <div className="flex items-center border-b mb-4">
            <h2 className="text-2xl flex-grow font-semibold">Number of Guests</h2>
            <UsersIcon className="h-5" />
            <input
              value={numberOfGuests}
              onChange={event => setNumberOfGuests(event.target.value)}
              className="w-12 pl-2 text-lg outline-none text-indigo-500"
              type="number"
              min={1}
            />
          </div>
          <div className="flex">
            <button onClick={resetInput} className="flex-grow text-gray-500">
              Cancel
            </button>
            <button onClick={search} className="flex-grow text-indigo-500">
              Search
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
