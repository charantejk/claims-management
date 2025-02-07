'use client';

import Link from 'next/link';


export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="container mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Claims Management System
        </h1>
      </div>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {/* Policy Holder Card */}
            <div className="p-4 lg:w-1/3">
              <div className="h-full bg-grey-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Policy Holder</h1>
                <p className="leading-relaxed mb-3">Register new policy holders or access and manage existing policy holder information.</p>
                <Link href="/policyholders" className="text-indigo-500 inline-flex items-center cursor-pointer">Learn More
                </Link>
              </div>
            </div>

            {/* Claims Management Card */}
            <div className="p-4 lg:w-1/3">
              <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Claims Management</h1>
                <p className="leading-relaxed mb-3">View and process insurance claims through our centralized management system.</p>
                <Link href="/claims" className="text-indigo-500 inline-flex items-center cursor-pointer">Learn More
                </Link>
              </div>
            </div>

            {/* Policy Management Card */}
            <div className="p-4 lg:w-1/3 border-black">
              <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">Policy</h1>
                <p className="leading-relaxed mb-3">Create, edit, and manage insurance policies with our comprehensive tools.</p>
                <Link href="/policies" className="text-indigo-500 inline-flex items-center cursor-pointer">Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}