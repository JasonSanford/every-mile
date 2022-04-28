import type { NextPage } from 'next'
import Head from 'next/head';
import Script from 'next/script';

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
      <Script src='https://analytics.jsanford.dev/umami.js' />
    </>
  )
};

export default Layout;
