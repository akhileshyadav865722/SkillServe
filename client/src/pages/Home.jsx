import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero section with glassmorphism & gradients */}
      <div className="relative isolate pt-14 pb-20 lg:pt-20 lg:pb-28">
        {/* Animated Background Mesh */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16 sm:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="hidden sm:mb-10 sm:flex sm:justify-center">
              <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-primary-700 bg-primary-50 ring-1 ring-inset ring-primary-600/20 hover:ring-primary-600/30 transition-all font-medium">
                The leading platform for verified freelancers. <Link to="/register" className="font-semibold text-primary-600 ml-1"><span className="absolute inset-0" aria-hidden="true"></span>Join today <span aria-hidden="true">&rarr;</span></Link>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl mb-6">
              Hire the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">professionals</span> for any project
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 max-w-2xl mx-auto font-medium">
              From web development to home renovation, SkillServe connects you directly with top-rated talent. Secure, fast, and transparent.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
              {!user ? (
                <>
                  <Link to="/register" className="btn-primary px-8 py-3.5 text-lg shadow-lg shadow-primary-500/30">
                    Get Started Free
                  </Link>
                  <Link to="/requests" className="btn-outline px-8 py-3.5 text-lg hover:bg-gray-100 flex items-center">
                    Browse services
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn-primary px-8 py-3.5 text-lg shadow-lg shadow-primary-500/30">
                    Go to Dashboard
                  </Link>
                  {user.role === 'client' && (
                    <Link to="/post-request" className="btn-outline px-8 py-3.5 text-lg hover:bg-gray-100 flex items-center gap-1">
                       Post new request <span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lower mesh */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>

      {/* Feature section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Work faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to get the job done
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform bridges the gap between client expectations and professional delivery with tools designed for seamless collaboration.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                  </div>
                  Verified Professionals
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Every professional on SkillServe is vetted using our comprehensive review system built by clients like you.</dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  Secure Hiring
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">You remain in total control of your budget and timeline. Review applicants anonymously before making your decision.</dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
