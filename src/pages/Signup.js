import { Link } from 'react-router-dom';

export default function Signup(){
  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-b from-amber-50/60 to-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Create Your Account</h1>
          <div className="mt-3">
            <Link to="/consultant-register" className="inline-block text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200">Become Consultant</Link>
          </div>
          <p className="text-gray-600 mt-3">Choose the option that best describes you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* User Card */}
          <div className="rounded-2xl border border-gray-300 bg-blue-50 shadow-sm p-6 hover:bg-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 text-gray-700 rounded-xl p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center">User (Client)</h3>
            <p className="text-center text-gray-600">Looking for expert consultants for your business needs</p>
            <div className="mt-6">
              <Link to="/user-signup" className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-500">
                Continue as User
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </Link>
            </div>
          </div>

          {/* Consultant Card */}
          <div className="rounded-2xl border border-gray-300 bg-blue-50 shadow-sm p-6 hover:bg-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 text-gray-700 rounded-xl p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-6 4h20"/></svg>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center">Consultant</h3>
            <p className="text-center text-gray-600">For professionals offering consultancy services</p>
            <div className="mt-6">
              <Link to="/consultant-register" className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white hover:border-blue-500">
                Continue as Consultant
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
