import { AppProps } from "next/app";
import "@styles/global.css";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return <Component {...pageProps} />;
}
