import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Every Mile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={`text-green-600 text-center text-6xl ${styles.title}`}>
          Welcome to <span className="text-green-800">Every Mile</span>.
        </h1>

        <p className="md:container md:mx-auto text-center my-4 text-2xl">
          Every Mile is a collection of Twitter bots (plus this site) that travel popular trails one mile at a time.
        </p>

        <p className="md:container md:mx-auto text-center my-4 text-2xl">
          Created by <a href="https://jsanford.dev">Jason Sanford</a>.
        </p>

        <div className={styles.grid}>
          <Link href="/appalachian-trail">
            <a className={styles.card}>
              <h2>Appalachian Trail &rarr;</h2>
              <p>Explore all 2,120 miles of the Appalachian Trail.</p>
            </a>
          </Link>

          <Link href="/blue-ridge-parkway">
            <a className={styles.card}>
              <h2>Blue Ridge Parkway &rarr;</h2>
              <p>Virtually cruise through 469 meandering miles.</p>
            </a>
          </Link>
        </div>

        <div className={styles.grid}>
          <Link href="https://twitter.com/every_mile_at">
            <a title="Follow Every Mile Appalachian Trail on Twitter" className={styles.card}>
              <svg
                style={{display: 'inline'}}
                className="w-6 h-6 text-blue-300 fill-current mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
              every_mile_at
            </a>
          </Link>

          <Link href="https://twitter.com/every_mile_brp">
            <a title="Follow Every Mile Blue Ridge Parkway on Twitter" className={styles.card}>
              <svg
                style={{display: 'inline'}}
                className="w-6 h-6 text-blue-300 fill-current mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
              every_mile_brp
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
