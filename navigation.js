(function() {
    const slides = [
        "slice2.html",
        "slice3.html",
        "slice4.html",
        "slice5.html",
        "slice6.html",
        "slice7.html",
        "slice8.html",
        "slice9.html",
        "slice10.html",
        "slice11.html",
        "slice12.html",
        "slice13.html",
        "slice14.html",
        "Slice15.html",
        "slice16.html",
        "slice17.html",
        "slice18.html",
        "slice19.html",
        "slice20.html",
        "slice21.html",
        "slice22.html"
    ];

    const currentFile = window.location.pathname.split("/").pop();
    const currentIndex = slides.findIndex(
        (slide) => slide.toLowerCase() === currentFile.toLowerCase()
    );

    if (currentIndex === -1) return;

    const prevSlide = slides[currentIndex - 1];
    const nextSlide = slides[currentIndex + 1];

    const navContainer = document.createElement("div");
    navContainer.className = "fixed bottom-6 right-6 flex items-center gap-3 z-[1000]";

    const badge = document.createElement("div");
    badge.className = "bg-blue-900 text-white text-sm font-semibold px-3 py-2 rounded-xl shadow-lg font-montserrat";
    badge.textContent = `Slide ${currentIndex + 2} / ${slides.length + 1}`;

    const navButtons = document.createElement("div");
    navButtons.className = "glass-panel flex gap-2 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-lg p-2";

    const createButton = (label, target, icon) => {
        const btn = document.createElement(target ? "a" : "button");
        btn.className = "flex items-center gap-2 px-4 py-2 rounded-xl font-semibold font-montserrat text-sm transition-all duration-200";
        btn.className += target
            ? " bg-blue-600 hover:bg-blue-700 text-white shadow"
            : " bg-slate-200 text-slate-500 cursor-not-allowed";

        if (target) {
            btn.href = target;
        } else {
            btn.setAttribute("aria-disabled", "true");
            btn.tabIndex = -1;
        }

        const iconElem = document.createElement("i");
        iconElem.className = icon;
        btn.appendChild(iconElem);

        const text = document.createElement("span");
        text.textContent = label;
        btn.appendChild(text);

        return btn;
    };

    navButtons.appendChild(createButton("Anterior", prevSlide, "fas fa-arrow-left"));
    navButtons.appendChild(createButton("Siguiente", nextSlide, "fas fa-arrow-right"));

    navContainer.appendChild(badge);
    navContainer.appendChild(navButtons);

    document.body.appendChild(navContainer);

    window.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" && nextSlide) {
            window.location.href = nextSlide;
        }
        if (event.key === "ArrowLeft" && prevSlide) {
            window.location.href = prevSlide;
        }
    });
})();
