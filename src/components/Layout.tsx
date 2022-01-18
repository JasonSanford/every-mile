import Head from 'next/head';

import Navigation from './Navigation';
import styles from './layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Every Mile</title>
      </Head>
      <Navigation />
      <main className={`w-full ${styles.main}`}>{children}</main>
      {/* <main>{children}</main> */}
    </>
  )
};
