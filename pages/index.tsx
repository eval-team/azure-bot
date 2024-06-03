import Link from "next/link";

const Home = () => {
  return (
    <div className="m-3">
      <Link
        href="/chat"
        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        Chat
      </Link>
      <Link
        href="/system-message"
        className="rounded bg-white ml-2 px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        System Message
      </Link>
    </div>
  );
};

export default Home;
