import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Models } from "../helpers/models";

interface MyLinkProps {
  href: string;
  children: JSX.Element;
}

const MyLink = ({ href, children }: MyLinkProps) => {
  return (
    <Link href={href}>
      <a className="px-2 py-1 w-full h-9 bg-white border-white hover:border-solid border-2 hover:border-black hover:text-black m-1 rounded-sm text-blue-500">
        {children}
      </a>
    </Link>
  );
};

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Ising Model Sims & Exp. Suite</title>
        <meta
          name="description"
          content="Build with Love, Powered by Vercel and Cloudflare."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex flex-row items-center justify-start py-1.5 bg-black w-screen">
        <h1 className="text-xl mx-3 text-white">
          Ising Model Sims & Exp. Suite
        </h1>
        <h2 className="text-sm mr-3 text-white text-opacity-70">
          Choose Algorithim:
        </h2>
        <Menu as="div">
          <Menu.Button className="inline-flex justify-center w-52 items-center rounded-md text-white border-solid border-blue-500 border-2 p-2 hover:bg-blue-500 hover:text-white hover:border-none">
            {Models.find((model) => model.url == router.asPath)?.name}
            <ChevronDownIcon className="w-5 h-5" />
          </Menu.Button>
          <Menu.Items className="bg-blue-500 text-white w-52 rounded-md px-3 py-3 mt-1 flex items-center flex-col fixed">
            {Models.map((model, key) => {
              return (
                <MyLink href={model.url} key={key}>
                  <Menu.Item as="div">{model.name}</Menu.Item>
                </MyLink>
              );
            })}
          </Menu.Items>
        </Menu>
      </header>
    </>
  );
};

export default Header;
