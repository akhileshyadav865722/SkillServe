import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-blob-gradient overflow-hidden">
      {/* Hero section with glassmorphism & gradients */}
      <div className="relative isolate pt-10 pb-20 lg:pt-16 lg:pb-28">
        {/* Animated Background Mesh */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-primary)] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-10 sm:mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="hidden sm:mb-10 sm:flex sm:justify-center">
              <div className="relative glass rounded-full px-5 py-1.5 text-sm leading-6 text-[var(--color-primary)] hover:ring-[var(--color-primary)]/30 transition-all font-medium inline-flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
                The leading platform for verified freelancers. 
                <Link to="?auth=register" className="font-semibold text-[var(--color-secondary)] ml-1 hover:text-[var(--color-primary)] transition-colors">
                  <span className="absolute inset-0" aria-hidden="true"></span>Join today <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl mb-6 leading-tight">
              Hire the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)]">professionals</span> for any project
            </h1>
            <p className="mt-6 text-lg sm:text-xl leading-8 text-gray-600 max-w-2xl mx-auto font-medium">
              From web development to home renovation, SkillServe connects you directly with top-rated talent. Secure, fast, and transparent.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4 sm:gap-x-6">
              {!user ? (
                <>
                  <Link to="?auth=register" className="btn-primary text-lg px-8 py-3.5 shadow-xl">
                    Get Started Free
                  </Link>
                  <Link to="/requests" className="btn-outline text-lg px-8 py-3.5 glass flex items-center justify-center">
                    Browse services
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="btn-primary text-lg px-8 py-3.5 shadow-xl">
                    Go to Dashboard
                  </Link>
                  {user.role === 'client' && (
                    <Link to="/post-request" className="btn-outline text-lg px-8 py-3.5 glass flex items-center gap-2">
                       Post new request <span aria-hidden="true" className="text-[var(--color-primary)]">&rarr;</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Lower mesh */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[var(--color-secondary)] to-[var(--color-accent)] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
      </div>

      {/* Feature section */}
      <div className="min-h-screen flex flex-col justify-center relative py-12 lg:py-0 w-full bg-white/40 backdrop-blur-[2px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-3xl lg:text-center glass p-6 sm:p-10 rounded-[32px] mb-12 lg:mb-16">
            <h2 className="text-sm sm:text-base font-bold leading-7 text-[var(--color-secondary)] tracking-wide uppercase">Work faster</h2>
            <p className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              Everything you need to get the job done
            </p>
            <p className="mt-5 text-lg leading-8 text-gray-600 font-medium max-w-2xl mx-auto">
              Our platform bridges the gap between client expectations and professional delivery with tools designed for seamless collaboration.
            </p>
          </div>
          
          <div className="mx-auto w-full max-w-[64rem]">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              
              <div className="relative pl-16 card p-5 group h-full flex flex-col justify-center border border-gray-100 hover:border-[var(--color-primary)]/40 transition-colors shadow-sm hover:shadow-md">
                <dt className="text-base font-extrabold leading-6 text-gray-900 mb-1.5">
                  <div className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[#9979F2] shadow-sm shadow-[var(--color-primary)]/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                    </svg>
                  </div>
                  Verified Professionals
                </dt>
                <dd className="text-sm leading-relaxed text-gray-600 font-medium">Every professional on SkillServe is vetted using our comprehensive review system built by clients like you.</dd>
              </div>

              <div className="relative pl-16 card p-5 group h-full flex flex-col justify-center border border-gray-100 hover:border-[var(--color-secondary)]/40 transition-colors shadow-sm hover:shadow-md">
                <dt className="text-base font-extrabold leading-6 text-gray-900 mb-1.5">
                  <div className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[#FFC4DA] shadow-sm shadow-[var(--color-secondary)]/40 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  Secure Hiring
                </dt>
                <dd className="text-sm leading-relaxed text-gray-600 font-medium">You remain in total control of your budget and timeline. Review applicants anonymously before making a decision.</dd>
              </div>

              <div className="relative pl-16 card p-5 group h-full flex flex-col justify-center border border-gray-100 hover:border-[var(--color-accent)]/40 transition-colors shadow-sm hover:shadow-md">
                <dt className="text-base font-extrabold leading-6 text-gray-900 mb-1.5">
                  <div className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#4ADE80] shadow-sm shadow-[var(--color-accent)]/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  Real-time Chat
                </dt>
                <dd className="text-sm leading-relaxed text-gray-600 font-medium">Communicate instantly with professionals or clients directly on our platform to keep everything organized.</dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
