import { useMutation, useQuery } from '@apollo/client';
import { GlobeAltIcon, MenuIcon, SearchIcon, UserCircleIcon } from '@heroicons/react/solid';
import { useMediaQuery } from '@react-hook/media-query';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Logout } from '../graphql/mutations/logout.graphql';
import { Me } from '../graphql/queries/me.graphql';
import {LocationMarkerIcon} from '@heroicons/react/solid'

function Header({ placeholder }) {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });
  const [showloginOptions, setshowloginOptions] = useState(false);
  const router = useRouter();
  const [logout] = useMutation(Logout);
  const { loading, data } = useQuery(Me);
  let body = null;

  const signOut = async () => {
    await logout();
    router.reload();
  };

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const toggleLoginOptions = () => {
    setshowloginOptions(!showloginOptions);
  };

  const search = () => {
    router.push({
      pathname: '/search',
      query: {
        lat: coordinates.lat,
        lng: coordinates.lng
      }
    });
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
    <div>
      <Head>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB6Q90sn5X-YQ6yZo5WlSSDuD8xfMMazuE&libraries=places"></script>
      </Head>
      <header className="sticky top-0 z-50 grid grid-cols-3 bg-white shadow-md py-2 px-5 md:px-10">
        {/* Left */}
        <div onClick={() => router.push('/')} className="relative flex items-center h-10 cursor-pointer my-auto -ml-10">
          <Image src={require('../assets/adaptive-icon.png')} width={200} height={200} />
        </div>

        {/* Middle */}
        <div className="flex items-center md:border-2 rounded-full py-2 md:shadow-sm">
          <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="w-full">
                <input
                  {...getInputProps({ placeholder: 'Type address' })}
                  className="flex-grow pl-5 pr-100 w-full bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400"
                />
                <div className="absolute mt-5">
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map(suggestion => {
                    const style = {
                      backgroundColor: suggestion.active ? '#5465FF' : '#fff'
                    };

                    return (
                      <button {...getSuggestionItemProps(suggestion, { style })} onClick={search}>
                        <div>
                          <LocationMarkerIcon size={30} color={'#5465FF'} />
                        </div>
                        <p>{suggestion.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <SearchIcon className="hidden md:inline-flex h-8 bg-indigo-500 text-white rounded-full p-2 cursor-pointer md:mx-2" />
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
      </header>
    </div>
  );
}

export default Header;
