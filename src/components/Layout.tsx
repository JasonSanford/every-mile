import type { NextPage } from 'next'
import Head from 'next/head';

import Navigation from './Navigation';
import styles from './layout.module.css';

const Layout: NextPage = ({ children }) => {
  return (
    <>
      <Head>
        <title>Every Mile</title>
      </Head>
      <Navigation />
      <main className={`w-full ${styles.main}`}>
        {children}
      </main>
    </>
  )
};

export default Layout;
