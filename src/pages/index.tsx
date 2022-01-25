import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Every Mile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={`text-green-600 ${styles.title}`}>
          Welcome to <span className="text-green-800">Every Mile</span>.
        </h1>

        <div className={styles.grid}>
          <a href="/appalachian-trail" className={styles.card}>
            <h2>Appalachian Trail &rarr;</h2>
            <p>Explore all 2,120 miles of the Appalachian Trail.</p>
          </a>

          <a href="/blue-ridge-parkway" className={styles.card}>
            <h2>Blue Ridge Parkway &rarr;</h2>
            <p>Virtually cruise through 469 meandering miles.</p>
          </a>
        </div>
      </main>
    </div>
  );
}

export default Home;
