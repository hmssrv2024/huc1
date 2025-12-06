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
                prev.setAttribute("aria-label", "Slide anterior");
                prev.innerHTML = '<span class="icon">◀</span>';
                nav.appendChild(prev);

                const counterWrapper = document.createElement("div");
                counterWrapper.className = "slide-counter";

                const counterInput = document.createElement("input");
                counterInput.type = "number";
                counterInput.id = "slideCounter";
                counterInput.className = "slide-input";
                counterInput.min = "1";
                counterInput.max = String(totalSlides);
                counterInput.value = "1";
                counterInput.inputMode = "numeric";
                counterInput.setAttribute("aria-label", "Ir al número de diapositiva");
                counterWrapper.appendChild(counterInput);

                const counterTotal = document.createElement("span");
                counterTotal.className = "slide-total";
                counterTotal.textContent = `/ ${totalSlides}`;
                counterWrapper.appendChild(counterTotal);

                nav.appendChild(counterWrapper);

                const next = document.createElement("button");
                next.type = "button";
                next.id = "nextBtn";
                next.className = "nav-btn";
                next.setAttribute("aria-label", "Siguiente slide");
                next.innerHTML = '<span class="icon">▶</span>';
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
                    counterEl.value = `${currentIndex + 1}`;
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

            if (counterEl) {
                const goToInputSlide = () => {
                    const value = parseInt(counterEl.value, 10);
                    if (Number.isNaN(value)) {
                        counterEl.value = `${currentIndex + 1}`;
                        return;
                    }

                    const targetIndex = Math.min(Math.max(value - 1, 0), totalSlides - 1);
                    goToSlide(targetIndex);
                };

                counterEl.addEventListener("change", goToInputSlide);
                counterEl.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        goToInputSlide();
                    }
                });
                counterEl.addEventListener("blur", () => {
                    counterEl.value = `${currentIndex + 1}`;
                });
            }

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

            // Interactividad del diagrama conceptual
            const flowNodes = Array.from(document.querySelectorAll(".flow-node"));
            const flowTitle = document.getElementById("flowTitle");
            const flowDescription = document.getElementById("flowDescription");
            const flowBadge = document.getElementById("flowBadge");

            const flowContent = {
                embarazo: {
                    title: "Embarazo (Inicio)",
                    text: "Curso fisiológico normal.",
                    badge: "Inicio",
                    badgeClass: "flow-badge-primary",
                },
                complicacion: {
                    title: "Complicación (Alerta)",
                    text: "Evento agudo (Hemorragia, THE, Sepsis).",
                    badge: "Alerta",
                    badgeClass: "flow-badge-warning",
                },
                nearmiss: {
                    title: "Near Miss (Crítico)",
                    text: "Falla orgánica / Criterios OMS. Punto de no retorno.",
                    badge: "Crítico",
                    badgeClass: "flow-badge-danger",
                },
                egresovivo: {
                    title: "Egreso Vivo (Rescate)",
                    text: "Intervención crítica efectiva = Letalidad Nula.",
                    badge: "Rescate",
                    badgeClass: "flow-badge-success",
                },
            };

            function setFlowState(key) {
                const data = flowContent[key];
                if (!data || !flowTitle || !flowDescription || !flowBadge) return;
                flowTitle.textContent = data.title;
                flowDescription.textContent = data.text;
                flowBadge.textContent = data.badge;
                flowBadge.className = `flow-badge ${data.badgeClass}`;
            }

            if (flowNodes.length) {
                const activeNode = flowNodes.find((node) => node.classList.contains("active")) || flowNodes[0];
                if (activeNode) {
                    setFlowState(activeNode.dataset.node || "");
                }

                flowNodes.forEach((node) => {
                    node.addEventListener("click", () => {
                        flowNodes.forEach((el) => el.classList.toggle("active", el === node));
                        setFlowState(node.dataset.node || "");
                    });
                });
            }

            // Interruptor visual: contexto institucional HUC
            const contextGrid = document.querySelector(".huc-context-grid");
            if (contextGrid) {
                const toggleButtons = Array.from(contextGrid.querySelectorAll(".switch-btn"));
                const modeBlocks = Array.from(contextGrid.querySelectorAll("[data-mode-block]"));

                function setMode(mode) {
                    contextGrid.dataset.mode = mode;
                    toggleButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.mode === mode));
                    modeBlocks.forEach((block) => {
                        block.classList.toggle("active", block.dataset.modeBlock === mode);
                    });
                }

                toggleButtons.forEach((btn) => {
                    btn.addEventListener("click", () => setMode(btn.dataset.mode || "capacidad"));
                });

                setMode(contextGrid.dataset.mode || "capacidad");
            }

            // Cerrar overlays al hacer clic fuera
            document.querySelectorAll(".overlay").forEach((overlay) => {
                overlay.addEventListener("click", (event) => {
                    if (event.target === overlay) {
                        overlay.classList.remove("active");
                    }
                });
            });

            const imageOverlay = document.getElementById("overlay-image-viewer");
            const overlayImage = document.getElementById("overlayImage");
            const overlayZoomValue = document.getElementById("overlayZoomValue");
            const overlayImageFrame = document.getElementById("overlayImageFrame");
            let overlayZoom = 1;
            let panX = 0;
            let panY = 0;
            let isPanning = false;
            let panStart = { x: 0, y: 0 };
            let panOrigin = { x: 0, y: 0 };

            const clampPan = () => {
                if (!overlayImage || !overlayImageFrame || !overlayImage.naturalWidth || !overlayImage.naturalHeight) {
                    panX = 0;
                    panY = 0;
                    return;
                }

                const frameRect = overlayImageFrame.getBoundingClientRect();
                const baseScale = Math.min(
                    frameRect.width / overlayImage.naturalWidth,
                    frameRect.height / overlayImage.naturalHeight,
                    1
                );

                const scaledWidth = overlayImage.naturalWidth * baseScale * overlayZoom;
                const scaledHeight = overlayImage.naturalHeight * baseScale * overlayZoom;

                const maxX = Math.max(0, (scaledWidth - frameRect.width) / 2);
                const maxY = Math.max(0, (scaledHeight - frameRect.height) / 2);

                panX = Math.min(maxX, Math.max(-maxX, panX));
                panY = Math.min(maxY, Math.max(-maxY, panY));
            };

            const updateOverlayTransform = () => {
                if (!overlayImage) return;

                clampPan();
                overlayImage.style.transform = `translate(${panX}px, ${panY}px) scale(${overlayZoom})`;

                if (overlayZoomValue) overlayZoomValue.textContent = `${Math.round(overlayZoom * 100)}%`;

                const shouldGrab = overlayZoom > 1;
                overlayImage.style.cursor = shouldGrab ? (isPanning ? "grabbing" : "grab") : "zoom-in";
            };

            const updateOverlayZoom = (value) => {
                if (!overlayImage) return;
                overlayZoom = Math.min(3, Math.max(0.5, value));

                if (overlayZoom <= 1) {
                    panX = 0;
                    panY = 0;
                }

                updateOverlayTransform();
            };

            document.querySelectorAll("[data-image-zoom]").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const direction = btn.dataset.imageZoom === "in" ? 0.25 : -0.25;
                    updateOverlayZoom(overlayZoom + direction);
                });
            });

            if (overlayImage) {
                overlayImage.addEventListener("load", () => {
                    panX = 0;
                    panY = 0;
                    overlayZoom = 1;
                    updateOverlayTransform();
                });

                overlayImage.addEventListener("click", () => {
                    const targetZoom = overlayZoom >= 2.5 ? 1 : overlayZoom + 0.75;
                    updateOverlayZoom(targetZoom);
                });

                overlayImage.addEventListener("pointerdown", (event) => {
                    if (overlayZoom <= 1) return;
                    isPanning = true;
                    panStart = { x: event.clientX, y: event.clientY };
                    panOrigin = { x: panX, y: panY };
                    overlayImage.setPointerCapture(event.pointerId);
                    overlayImage.style.cursor = "grabbing";
                });

                overlayImage.addEventListener("pointermove", (event) => {
                    if (!isPanning) return;
                    panX = panOrigin.x + (event.clientX - panStart.x);
                    panY = panOrigin.y + (event.clientY - panStart.y);
                    updateOverlayTransform();
                });

                const endPan = (event) => {
                    if (!isPanning) return;
                    isPanning = false;
                    if (overlayImage.hasPointerCapture(event.pointerId)) {
                        overlayImage.releasePointerCapture(event.pointerId);
                    }
                    updateOverlayTransform();
                };

                overlayImage.addEventListener("pointerup", endPan);
                overlayImage.addEventListener("pointerleave", endPan);
            }

            // Exponer funciones para botones inline
            window.openOverlay = function (id) {
                const overlay = document.getElementById(id);
                if (overlay) overlay.classList.add("active");
            };

            window.openImageOverlay = function (src, altText) {
                if (!imageOverlay || !overlayImage) return;
                overlayImage.src = src;
                overlayImage.alt = altText || "Imagen de la diapositiva";
                panX = 0;
                panY = 0;
                isPanning = false;
                updateOverlayZoom(1);
                requestAnimationFrame(() => {
                    updateOverlayTransform();
                });
                imageOverlay.classList.add("active");
            };

            window.closeOverlay = function (id) {
                const overlay = document.getElementById(id);
                if (overlay) overlay.classList.remove("active");
            };
        });
