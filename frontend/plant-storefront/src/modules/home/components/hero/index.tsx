import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full">
      {/* Hero Image */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1920&q=80"
          alt="Beautiful indoor plants collection"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="content-container">
            <div className="max-w-xl text-white">
              <h1 className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic leading-tight mb-4">
                Laissez l&apos;amour
                <br />
                <span className="text-brand-gold">grandir !</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 max-w-md">
                Découvrez notre collection de plantes d&apos;intérieur et d&apos;extérieur pour embellir votre espace.
              </p>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center gap-2 bg-brand-olive hover:bg-brand-oliveDark text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
              >
                Explorer la collection
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-brand-beige border-b border-brand-beigeDark">
        <div className="content-container py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 text-xs sm:text-sm text-brand-oliveDark">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span><strong className="text-brand-olive">Livraison offerte</strong> à partir de 50 TND</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-brand-beigeDark" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span><strong className="text-brand-olive">Garantie 30 jours</strong> sur la santé des plantes</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-brand-beigeDark" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span><strong className="text-brand-olive">4.8/5</strong> sur 500+ avis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
