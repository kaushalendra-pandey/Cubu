import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import InfoCard from '../../../components/InfoCard';
import { searchListings } from '../../../graphql/queries/searchListings.graphql';

function Search() {
  const router = useRouter();
  const { lat, lng } = router.query;

  const { loading, data, error } = useQuery(searchListings, {
    variables: {}
  });

  const listings = data?.searchListings;

  console.log(listings);

  return (
    <div className="h-screen">
      <Header />

      <main className="flex">
        {/* left side of listings */}
        <section className="flex-grow pt-14 px-6">
          <div className="flex flex-col overflow-auto h-screen">
            {loading ? (
              <p>Loading...</p>
            ) : (
              listings?.map(({ make, model, description, year, price, pictureUrl }) => (
                <InfoCard make={make} model={model} description={description} year={year} price={price} pictureUrl={pictureUrl} />
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Search;
