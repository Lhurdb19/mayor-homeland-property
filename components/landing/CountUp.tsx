export default function CountSection() {
    return (
        <>
          {/* TRUST STATS */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2
      w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center px-5">
        <div>
          <h3 className="text-2xl font-bold">5,000+</h3>
          <p className="text-sm text-gray-300">Verified Listings</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">1,200+</h3>
          <p className="text-sm text-gray-300">Happy Clients</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">98%</h3>
          <p className="text-sm text-gray-300">Trusted Agents</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">24/7</h3>
          <p className="text-sm text-gray-300">Support</p>
        </div>
      </div>
        </>
    )
}