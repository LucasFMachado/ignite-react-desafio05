import { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/Header';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </Head>
      <Header />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
