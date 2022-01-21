// import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { serializePathIdentifier, pathIdentifierToName } from '../../utils';

const Index = () => {
  const router = useRouter();

  const pathIdentifier = serializePathIdentifier(router.query);
  
  if (!pathIdentifier) {
    // TODO: 404
    return <p>nope</p>;
  }
  
  // const { path, mile } = serialized;
  const name = pathIdentifierToName(pathIdentifier);

  return (
    <>
      <Head>
        <title>Every Mile - {name}</title>
      </Head>
      <section className="">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-700 sm:text-4xl md:text-5xl xl:text-6xl">
            {name}
          </h2>
        </div>
      </section>
    </>
  );
};

export default Index;
