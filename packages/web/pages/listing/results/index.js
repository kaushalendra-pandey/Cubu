import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import InfoCard from '../../../components/InfoCard';
import Map from '../../../components/Map';
import { searchListings } from '../../../graphql/queries/searchListings.graphql';

function Search() {
  const router = useRouter();
  const { lat, lng } = router.query;

  const { loading, data, error } = useQuery(searchListings, {
    variables: {
      // latitude: lat,
      // longitude: lng,
      offset: 0,
      limit: 10
    }
  });

  const listings = data?.searchListings;

  return (
    <div className="h-screen overflow-hidden">
      <Header />

      <main className="flex">
        {/* left side of listings */}
        <section className="flex-grow pt-14 px-6">
          <p className="text-xs">300+ Cars available for rent in</p>

          <h1 className="text-3xl font-semibold mt-2 mb-6">Cars in </h1>

          <div className="hidden lg:inline-flex mb-5 space-x-3 text-gray-800 whitespace-nowrap">
            <p className="button">Cancellation Flexibility</p>
            <p className="button">Features</p>
            <p className="button">Price</p>
          </div>

          <div className="flex flex-col overflow-auto h-96">
            {loading ? (
              <p>Loading...</p>
            ) : (
              listings?.map(({ make, model, description, year, price, pictureUrl }) => (
                <InfoCard make={make} model={model} description={description} year={year} price={price} pictureUrl={pictureUrl} />
              ))
            )}
          </div>
        </section>

        <section className="hidden xl:inline-flex xl:min-w-[600px] h-screen">{!loading && <Map searchResults={listings} />}</section>
      </main>

      <Footer />
    </div>
  );
}

export default Search;
