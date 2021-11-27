import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/models/metropolis");
  }, []);
  return <div>Redirect</div>;
}
