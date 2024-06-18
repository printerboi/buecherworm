import "@/app/globals.css";
import Head from "next/head";
import { AppProps } from "next/app";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

interface CustomPageProps {

}

const MyApp = ({ Component, pageProps }: AppProps<CustomPageProps>) => {

    return(
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Buecherworm | Diy lib</title>
            </Head>
            <Component {...pageProps}/>
        </>
    );
}

export default MyApp
