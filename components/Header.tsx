import { useState } from "react";
import { Menu, Switch } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";

interface MyLinkProps {
  href: string;
  children: JSX.Element;
}

interface Models {
  url: string;
  name: string;
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

const ModelsList: Array<Models> = [
  { url: "/metropolis", name: "Metropolis" },
  { url: "/kawasaki-non-local", name: "Kawasaki (non-local)" },
  { url: "/kawasaki-local", name: "Kawasaki (local)" },
  { url: "/blume-capel", name: "Blume-Capel" },
  { url: "/wolff", name: "Wolff" },
  { url: "/xy", name: "XY" },
  { url: "/transverse-field-ising", name: "Transverse-field Ising" },
  { url: "/q-potts", name: "Q-Potts" },
];

const Header = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <header className="flex flex-row items-center justify-start py-1.5 bg-gray-100 w-screen">
      <h1 className="text-xl mx-3">Ising Model Sims & Exp. Suite</h1>
      <h2 className="text-sm mr-3 text-black text-opacity-50">
        Choose Algorithim:
      </h2>
      <Menu as="div">
        <Menu.Button className="inline-flex justify-center w-52 items-center rounded-md text-blue-500 border-solid border-blue-500 border-2 p-2 hover:bg-blue-500 hover:text-white hover:border-none">
          Transverse-field Ising <ChevronDownIcon className="w-5 h-5" />
        </Menu.Button>
        <Menu.Items className="bg-blue-500 text-white w-52 rounded-md px-3 py-3 mt-1 flex items-center flex-col fixed">
          {ModelsList.map((model, key) => (
            <MyLink href={model.url} key={key}>
              <Menu.Item as="div">{model.name}</Menu.Item>
            </MyLink>
          ))}
        </Menu.Items>
      </Menu>
      <h2 className="text-sm mx-3 text-black text-opacity-50">
        Set Freeplay Mode:{" "}
      </h2>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex items-center h-6 rounded-full w-11`}
      >
        <span className="sr-only">Set Freeplay</span>
        <span
          className={`${
            enabled ? "translate-x-6" : "translate-x-1"
          } inline-block w-4 h-4 transform bg-white rounded-full`}
        ></span>
      </Switch>
    </header>
  );
};

export default Header;
