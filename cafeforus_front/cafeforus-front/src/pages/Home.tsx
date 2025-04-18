// pages/Home.tsx
import useAuth from '../context/useAuth';


const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-3xl font-semibold text-indigo-600">
      Welcome to CafeUs, {user}!
    </div>
  );
};

export default Home;