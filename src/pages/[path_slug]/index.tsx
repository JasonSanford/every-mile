// import { GetStaticProps, GetServerSideProps, GetStaticPaths } from 'next';
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";

import {
  serializePathIdentifier,
  pathIdentifierToName,
  pathIdentifierToSlug,
  chunkify,
} from "../../utils";
import { DISTANCES } from "../../constants";

const Index = () => {
  const router = useRouter();

  const pathIdentifier = serializePathIdentifier(router.query);

  if (!pathIdentifier) {
    // TODO: 404
    return <p>nope</p>;
  }

  const name = pathIdentifierToName(pathIdentifier);
  const slug = pathIdentifierToSlug(pathIdentifier);
  const mileCount = DISTANCES[pathIdentifier];

  const miles = Array(mileCount)
    .fill(1)
    .map((_, index) => index + 1);
  const chunksOfMiles = chunkify(miles, 20);
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
      <div className="md:container md:mx-auto mt-10">
        {chunksOfMiles.map((chunkOfMiles) => (
          <ul
            key={`chunk-of-miles-${chunkOfMiles[0]}`}
            className="mb-10 columns-2 md:columns-4"
          >
            {chunkOfMiles.map((mile) => (
              <li key={`mile-${mile}`} className="text-center">
                <Link href={`/${slug}/mile/${mile}`}>
                  <a className="hover:underline text-green-800">Mile {mile}</a>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return new Promise((resolve) => {
    const paths = [
      { params: { path_slug: "appalachian-trail" } },
      { params: { path_slug: "blue-ridge-parkway" } },
      { params: { path_slug: "continental-divide-trail" } },
    ];

    resolve({
      paths,
      fallback: false,
    });
  });
};

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};

export default Index;
