import { useMutation } from '@apollo/client';
import { LocationMarkerIcon, PhotographIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useForm } from 'react-hook-form';
import PlacesAutocomplete from 'react-places-autocomplete';
import Header from '../../../components/Header';
import { Register } from '../../../graphql/mutations/register.graphql';

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [signUp, { data, error, loading }] = useMutation(Register);
  const { register, handleSubmit } = useForm();
  const [address, setAddress] = useState('');
  const [features, setFeatures] = useState([]);
  const [image, setImage] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  });

  const handleSelect = async value => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  const featuresBox = event => {
    const isChecked = event.target.checked;
    const value = event.target.value;
    if (isChecked) {
      setFeatures([...features, value]);
    } else {
      setFeatures(features.filter(item => item !== value));
    }
  };

  const handleImageDrop = files => {
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async data => {
    console.log(data);
    signUp({ variables: data });
  };

  useEffect(() => {
    if (data?.register) {
      setMessage(data.register[0]);
    }
  }, [data, error]);

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-full max-w-sm bg-white px-16 m-4">
          <h1 className="text-2xl font-medium text-primary mb-12 ml-10 text-center">List your car</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex">
            <div>
              <div>
                <label htmlFor="make" className="text-sm">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 w-96`}
                  id="make"
                  placeholder="Make"
                  autoComplete="off"
                  {...register('make')}
                />
              </div>
              <div>
                <label htmlFor="model" className="text-sm">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 w-96`}
                  id="model"
                  placeholder="Model"
                  autoComplete="off"
                  {...register('model')}
                />
              </div>
              <div>
                <label htmlFor="year" className="text-sm">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 w-96`}
                  id="year"
                  placeholder="Year"
                  autoComplete="off"
                  {...register('year')}
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 h-64 w-96`}
                  id="description"
                  autoComplete="off"
                  {...register('description')}
                />
              </div>
            </div>
            <div className="ml-20 mt-4">
              <div className="flex items-center py-2">
                <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="w-full">
                      <input
                        {...getInputProps({ placeholder: 'Car Location address' })}
                        className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 w-96
                        "
                      />
                      <div className="absolute">
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
              </div>
              <div className="flex items-center py-2">
                <div className="w-full">
                  <label htmlFor="price" className="text-sm">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 w-96`}
                    id="price"
                    placeholder="Price"
                    autoComplete="off"
                    {...register('price')}
                  />
                </div>
              </div>
              <div className="flex items-center py-2">
                <div className="w-full">
                  <label htmlFor="features" className="text-sm">
                    Features
                  </label>
                  <div className="flex m-4 flex-col">
                    <div>
                      <input type="checkbox" name="features" value="Air Conditioner" onChange={featuresBox} />
                      <label htmlFor="feature1" className="mx-4">
                        Air Conditioner
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Bluetooth" onChange={featuresBox} />
                      <label htmlFor="feature2" className="mx-4">
                        Bluetooth
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Heated Seats" onChange={featuresBox} />
                      <label htmlFor="feature3" className="mx-4">
                        Heated Seats
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="ADAS" onChange={featuresBox} />
                      <label htmlFor="feature4" className="mx-4">
                        ADAS Technology
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Fastag" onChange={featuresBox} />
                      <label htmlFor="feature5" className="mx-4">
                        Fastag Enabled
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Bluetooth" onChange={featuresBox} />
                      <label htmlFor="feature6" className="mx-4">
                        Bluetooth
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Sunroof" onChange={featuresBox} />
                      <label htmlFor="feature7" className="mx-4">
                        Sunroof
                      </label>
                    </div>
                    <div>
                      <input type="checkbox" name="features" value="Power Windows" onChange={featuresBox} />
                      <label htmlFor="feature8" className="mx-4">
                        Power Windows
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ml-20 mt-4">
              <div className="w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4 h-52 w-96 flex justify-center items-center">
                <Dropzone accept="image/jpeg, image/png" multiple={false} onDrop={handleImageDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {image == null && (
                          <div>
                            <PhotographIcon width={80} height={80} color={'#5465FF'} />
                            <p className="size-md">Upload a car image</p>
                          </div>
                        )}
                        {image != null && <Image src={image} width={300} height={190} />}
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <div className="flex justify-center items-center mt-6">
                {loading ? (
                  <button
                    className={`bg-indigo-500 py-2 px-24 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`bg-indigo-500 py-2 px-24 text-sm text-white rounded border border-indigo-500 focus:outline-none focus:border-indigo-700`}
                  >
                    List you Car
                  </button>
                )}
              </div>
            </div>
            {message != null && message.path == 'Submit' && <p className="text-center text-green-500 text-sm mt-2">{message.message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
