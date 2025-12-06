document.addEventListener("DOMContentLoaded", () => {
            const slides = Array.from(document.querySelectorAll(".slide"));
            const totalSlides = slides.length;

            const progressBar = document.getElementById("progressBar");
            const navDotsContainer = document.getElementById("navDots");

            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");
            const slideCounter = document.getElementById("slideCounter");

            let currentIndex = 0;

            // Crear controles si aún no existen
            if (!prevBtn || !nextBtn || !slideCounter) {
                const nav = document.createElement("div");
                nav.className = "nav-controls";

                const prev = document.createElement("button");
                prev.type = "button";
                prev.id = "prevBtn";
                prev.className = "nav-btn";
                prev.innerHTML = '<span class="icon">◀</span><span>Anterior</span>';
                nav.appendChild(prev);

                const counter = document.createElement("div");
                counter.id = "slideCounter";
                counter.className = "slide-counter";
                nav.appendChild(counter);

                const next = document.createElement("button");
                next.type = "button";
                next.id = "nextBtn";
                next.className = "nav-btn";
                next.innerHTML = '<span>Siguiente</span><span class="icon">▶</span>';
                nav.appendChild(next);

                document.body.appendChild(nav);
            }

            const prevButton = document.getElementById("prevBtn");
            const nextButton = document.getElementById("nextBtn");
            const counterEl = document.getElementById("slideCounter");

            // Crear puntos de navegación lateral
            slides.forEach((slide, idx) => {
                const dot = document.createElement("button");
                dot.type = "button";
                dot.className = "nav-dot";
                dot.dataset.index = String(idx);
                const label = slide.getAttribute("data-label") || `Slide ${idx + 1}`;
                dot.setAttribute("data-label", label);
                dot.addEventListener("click", () => goToSlide(idx));
                navDotsContainer.appendChild(dot);
            });

            const navDots = Array.from(navDotsContainer.querySelectorAll(".nav-dot"));

            function updateCounter() {
                if (counterEl) {
                    counterEl.textContent = `${currentIndex + 1} / ${totalSlides}`;
                }
            }

            function updateProgress() {
                if (progressBar) {
                    const pct = ((currentIndex + 1) / totalSlides) * 100;
                    progressBar.style.width = pct.toFixed(1) + "%";
                }
            }

            function updateButtons() {
                if (prevButton) prevButton.disabled = currentIndex === 0;
                if (nextButton) nextButton.disabled = currentIndex === totalSlides - 1;
            }

            function updateDots() {
                navDots.forEach((dot) => {
                    dot.classList.toggle("active", Number(dot.dataset.index) === currentIndex);
                });
            }

            function animateSlide(slide) {
                const animEls = slide.querySelectorAll("[data-animate]");
                animEls.forEach((el, idx) => {
                    el.classList.remove("animate-visible");
                    // Reiniciar animación
                    void el.offsetWidth;
                    const delayAttr = el.getAttribute("data-delay");
                    const delay = delayAttr ? parseFloat(delayAttr) : idx * 0.06;
                    el.style.transitionDelay = delay ? `${delay}s` : "0s";
                    requestAnimationFrame(() => {
                        el.classList.add("animate-visible");
                    });
                });
            }

            function runBars(slide) {
                const bars = slide.querySelectorAll(".bar-fill");
                bars.forEach((bar) => {
                    const width = bar.getAttribute("data-width");
                    if (width && !bar.dataset.filled) {
                        bar.style.width = width;
                        bar.dataset.filled = "true";
                    }
                });
            }

            function runCounters(slide) {
                const counters = slide.querySelectorAll(".count-up");
                counters.forEach((el) => {
                    const targetStr = el.getAttribute("data-target");
                    if (!targetStr || el.dataset.running === "true") return;

                    const target = parseFloat(targetStr);
                    if (isNaN(target)) return;

                    const suffix = el.getAttribute("data-suffix") || "";
                    const decimals = targetStr.includes(".") ? 1 : 0;

                    let startValue = 0;
                    const duration = 900;
                    const startTime = performance.now();
                    el.dataset.running = "true";

                    function step(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const value = startValue + (target - startValue) * progress;
                        el.textContent = value.toFixed(decimals) + suffix;
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = target.toFixed(decimals) + suffix;
                        }
                    }

                    requestAnimationFrame(step);
                });
            }

            function goToSlide(index) {
                if (index < 0 || index >= totalSlides || index === currentIndex) return;

                slides[currentIndex].classList.remove("active");
                slides[index].classList.add("active");
                currentIndex = index;

                updateCounter();
                updateProgress();
                updateButtons();
                updateDots();
                animateSlide(slides[index]);
                runBars(slides[index]);
                runCounters(slides[index]);
            }

            function nextSlide() {
                if (currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                }
            }

            function prevSlide() {
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            }

            // Inicialización
            slides.forEach((slide) => slide.classList.remove("active"));
            if (slides[0]) {
                slides[0].classList.add("active");
                updateCounter();
                updateProgress();
                updateButtons();
                updateDots();
                animateSlide(slides[0]);
                runBars(slides[0]);
                runCounters(slides[0]);
            }

            // Eventos de botones
            if (nextButton) nextButton.addEventListener("click", nextSlide);
            if (prevButton) prevButton.addEventListener("click", prevSlide);

            // Navegación por teclado
            document.addEventListener("keydown", (e) => {
                if (e.key === "ArrowRight" || e.key === "PageDown") {
                    nextSlide();
                } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                    prevSlide();
                } else if (e.key === "Home") {
                    goToSlide(0);
                } else if (e.key === "End") {
                    goToSlide(totalSlides - 1);
                }
            });

            // Cerrar overlays al hacer clic fuera
            document.querySelectorAll(".overlay").forEach((overlay) => {
                overlay.addEventListener("click", (event) => {
                    if (event.target === overlay) {
                        overlay.classList.remove("active");
                    }
                });
            });

            // Exponer funciones para botones inline
            window.openOverlay = function (id) {
                const overlay = document.getElementById(id);
                if (overlay) overlay.classList.add("active");
            };

            window.closeOverlay = function (id) {
                const overlay = document.getElementById(id);
                if (overlay) overlay.classList.remove("active");
            };
        });
