'use client'

export default function BillingPage() {
  const emailPro = () => {
    window.location.href = "mailto:alexis@axara.systems?subject=PackRegix Pro €49/mo"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Choose Your Plan</h1>
        <p className="text-xl text-stone-600 mb-8">Start free. Upgrade anytime.</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl border-2 border-stone-200 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Starter</h3>
          <div className="text-4xl font-bold text-stone-900 mb-6">€29<small className="text-stone-500">/mo</small></div>
          <button disabled className="w-full bg-stone-400 text-white py-3 rounded-xl font-medium cursor-not-allowed">
            Current Plan
          </button>
        </div>

        <div className="p-8 rounded-2xl border-2 border-emerald-200 bg-emerald-50 transform rotate-3 md:rotate-0 md:translate-y-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-emerald-900 mb-4">Pro ⭐</h3>
          <div className="text-4xl font-bold text-stone-900 mb-6">€49<small className="text-stone-500">/mo</small></div>
          <button 
            onClick={emailPro}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-lg"
          >
            Get Pro Now
          </button>
          <p className="text-xs text-stone-500 mt-2">Email invoice – 14 day trial</p>
        </div>

        <div className="p-8 rounded-2xl border-2 border-stone-200 hover:shadow-xl">
          <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
          <div className="text-4xl font-bold text-stone-900 mb-6">€99<small className="text-stone-500">/mo</small></div>
          <button onClick={emailPro} className="w-full bg-stone-600 hover:bg-stone-700 text-white py-3 rounded-xl font-medium">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  )
}
