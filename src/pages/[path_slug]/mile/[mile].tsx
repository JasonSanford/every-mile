import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import { serializePathIdentifierAndMile, pathIdentifierToName } from '../../../utils';

const Mile = () => {
  const router = useRouter();

  const serialized = serializePathIdentifierAndMile(router.query);
  
  if (!serialized) {
    return <p>nope</p>;
  }
  
  const { path, mile } = serialized;
  const name = pathIdentifierToName(path);

  return (
    <section className="py-20 bg-white">
      <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-700 sm:text-4xl md:text-5xl xl:text-6xl">
          {name}
        </h2>
        <h2 className="text-3xl font-extrabold tracking-tight text-green-600 sm:text-4xl md:text-5xl xl:text-6xl">
          Mile {mile}
        </h2>
      </div>
    </section>
  );
};

export default Mile;
