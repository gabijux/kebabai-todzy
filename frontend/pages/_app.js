import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Kebabai Todzy</title>
        <meta name="description" content="Kebabai Todzy - kebabų valdymo sistema" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}