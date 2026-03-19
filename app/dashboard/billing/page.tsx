'use client'

export default function BillingPage() {
  const emailPro = () => {
    window.location.href = "mailto:alexis@axara.systems?subject=PackRegix Pro €49/mo&body=Hi, I'd like to upgrade to Pro plan. Email: "
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-stone-600 mb-8">Start free. Upgrade anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className="group relative rounded-2xl border-2 border-stone-200 p-8 hover:shadow-xl transition-all">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-stone-900 mb-4">Starter</h3>
            <div className="text-4xl font-bold text-stone-900 mb-6">
              €29<small className="text-stone-500 font-normal">/mo</small>
            </div>
            <ul className="space-y-3 mb-8 text-stone-700 text-left">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1
