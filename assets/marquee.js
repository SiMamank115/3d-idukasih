class InfiniteMarquee {
	constructor(e = {}) {
		(this.element = "string" == typeof e.element ? [...document.querySelectorAll(e.element)] : e.element), (this.direction = e.direction || "left"), (this.spaceBetween = e.spaceBetween || "0px"), (this.gap = { vertical: (e.gap && e.gap.vertical) || "5px", horizontal: (e.gap && e.gap.horizontal) || "0px" }), (this.speed = e.speed || 1e4), (this.fullContainer = e.fullContainer || !1), (this.smoothEdges = e.smoothEdges || !1), (this.pauseOnHover = e.pauseOnHover || !1), (this.duplicateCount = e.duplicateCount || 1), (this.breakpointSize = e.breakpointSize || 1023), (this.desktopBreakpoint = this.breakpointSize + 1), (this.mobileSettings = e.mobileSettings || {}), (this.destroyOnDesktop = e.destroyOnDesktop || !1), (this.destroyOnMobile = e.destroyOnMobile || !1), (this.elementClass = e.elementClass || "marquee-container"), (this.on = { beforeInit: (e.on && e.on.beforeInit) || null, afterInit: (e.on && e.on.afterInit) || null, pauseAnimation: (e.on && e.on.pauseAnimation) || null, resumeAnimation: (e.on && e.on.resumeAnimation) || null }), (this.scrollType = "top" === e.direction || "bottom" === e.direction ? "vertical" : "horizontal"), (this.debugging = e.debugging || !1), (this.animateMotion = !0), (this.isMarqueeInitialized = !1), !this.isMarqueeInitialized && this.init(), "undefined" != typeof window && (this.destroyOnResponsive(), (this.destroyOnMobile || this.destroyOnDesktop) && window.addEventListener("resize", this.destroyOnResponsive.bind(this)));
	}
	init() {
		if (("undefined" == typeof window && "undefined" == typeof document) || !(Array.isArray(this.element) ? this.element.length > 0 : this.element)) this.debugging && console.error("🚊 Infinite Marquee - Failed to Initialize");
		else {
			if ((this.debugging && console.log("🚊 Infinite Marquee - Initialized"), window.matchMedia("(prefers-reduced-motion: reduce)").matches && ((this.animateMotion = !1), this.debugging && console.log('🚊 Infinite Marquee - "prefers-reduced-motion" is Reduced')), "function" == typeof this.on.beforeInit && this.on.beforeInit(), Array.isArray(this.element))) {
				this.isMarqueeInitialized = !0;
				for (const e of this.element) this.configureChildNodes(e), this.configureAnimationOptions(e);
				this.debugging && console.log("🚊 Infinite Marquee - DOM Nodes Created from Array");
			} else (this.isMarqueeInitialized = !0), this.configureChildNodes(this.element), this.configureAnimationOptions(this.element), this.debugging && console.log("🚊 Infinite Marquee - DOM Nodes Created from Single Element");
			"function" == typeof this.on.afterInit && this.on.afterInit();
		}
	}
	configureChildNodes(e) {
		const i = document.createElement("div");
		for (i.classList.add(`${this.scrollType}-marquee-inner`); e.firstChild; ) i.appendChild(e.firstChild);
		e.classList.add(`${this.scrollType}-marquee`), e.appendChild(i), this.duplicateOriginalNodes(i), this.duplicateContainer(e), this.debugging && console.log("🚊 Infinite Marquee - DOM Nodes Appended Successfully");
	}
	duplicateOriginalNodes(e) {
		const i = e.children,
			t = [];
		for (let e = 0; e < i.length; e++) {
			const s = i[e].cloneNode(!0);
			s.setAttribute("aria-hidden", !0), t.push(s);
		}
		for (const i of t) e.appendChild(i);
		this.debugging && console.log("🚊 Infinite Marquee - DOM Nodes Duplicated Successfully");
	}
	duplicateContainer(e) {
		const i = e.querySelector(`.${this.scrollType}-marquee-inner`),
			t = i.cloneNode(!0);
		t.setAttribute("aria-hidden", !0);
		const s = t.children;
		for (let e = 0; e < s.length; e++) s[e].removeAttribute("aria-hidden");
		const n = "vertical" === this.scrollType ? this.duplicateCount + 1 : this.duplicateCount,
			o = Array.from({ length: n }, () => t.cloneNode(!0));
		if ((e.append(...o), "vertical" === this.scrollType)) {
			const t = e.clientHeight - i.clientHeight;
			e.style.setProperty("--_containerSize", `${t}px`);
		}
	}
	configureAnimationOptions(e) {
		const i = window.matchMedia(`(max-width: ${this.breakpointSize}px)`);
		e.setAttribute("data-animate", this.animateMotion);
		const t = (e) => {
				e.addEventListener("mouseenter", () => this.pause(e)), e.addEventListener("mouseleave", () => this.resume(e));
			},
			s = () => {
				if (this.isMarqueeInitialized) {
					const s = this.mobileSettings.direction || this.direction,
						n = "right" === s || "bottom" === s,
						o = "right" === this.direction || "bottom" === this.direction,
						r = i.matches ? (n ? "reverse" : "forwards") : o ? "reverse" : "forwards",
						a = (i.matches && this.mobileSettings.speed) || this.speed;
					if ((e.style.setProperty("--_speed", `${a}ms`), e.style.setProperty("--_direction", r), this.smoothEdges && e.classList.add("smooth"), "vertical" === this.scrollType)) {
						const t = (i.matches && this.mobileSettings && this.mobileSettings.gap && this.mobileSettings.gap.horizontal) || this.gap.horizontal,
							s = (i.matches && this.mobileSettings && this.mobileSettings.gap && this.mobileSettings.gap.vertical) || this.gap.vertical;
						this.gap.horizontal && e.style.setProperty("--_hGap", t), this.gap.vertical && e.style.setProperty("--_vGap", s);
					} else {
						const t = (i.matches && this.mobileSettings.spaceBetween) || this.spaceBetween;
						e.style.setProperty("--_gap", t), this.fullContainer && e.classList.add("full");
					}
					window.innerWidth >= this.desktopBreakpoint && this.pauseOnHover && this.animateMotion && t(e), this.debugging && console.log(`🚊 Infinite Marquee - ${this.scrollType} type`), this.debugging && console.log("🚊 Infinite Marquee - Animation Configs Ready");
				}
			};
		s(), window.addEventListener("resize", this.debounce(s));
	}
	destroyOnResponsive() {
		const e = `${this.scrollType}-marquee-inner`,
			i = this.element;
		"undefined" != typeof window && (window.innerWidth <= this.breakpointSize && this.destroyOnMobile ? this.manageMarquee(i, e) : window.innerWidth >= this.desktopBreakpoint && this.destroyOnDesktop ? this.manageMarquee(i, e) : this.isMarqueeInitialized || (this.init(), (this.isMarqueeInitialized = !0)));
	}
	manageMarquee(e, i) {
		this.isMarqueeInitialized && (this.destroy(e, i), (this.isMarqueeInitialized = !1), this.debugging && console.log("🚊 Infinite Marquee - Destroyed Successfully"));
	}
	removeClassesAfter(e, i) {
		if (i && i.classList) {
			let t = !1;
			for (let s = 0; s < i.classList.length; s++) {
				const n = i.classList[s];
				t && (i.classList.remove(n), s--), n === e && (t = !0);
			}
		}
	}
	destroy(e, i) {
		if (e) {
			e.removeAttribute("style");
			const t = e.querySelectorAll(`.${i}`);
			for (let i = 1; i < t.length; i++) e.removeChild(t[i]);
			const s = e.firstElementChild;
			if (s) {
				if (
					(s.querySelectorAll('[aria-hidden="true"]').forEach(function (e) {
						s.removeChild(e);
					}),
					s.classList.contains(i))
				) {
					for (; s.firstChild; ) e.appendChild(s.firstChild);
					e.removeChild(s), this.removeClassesAfter(this.elementClass, e);
				}
			}
		}
	}
	pause(e) {
		(e || this.element).classList.add("paused"), this.debugging && console.log("🚊 Infinite Marquee - Animation Paused"), "function" == typeof this.on.pauseAnimation && this.on.pauseAnimation();
	}
	resume(e) {
		(e || this.element).classList.remove("paused"), this.debugging && console.log("🚊 Infinite Marquee - Animation Resumed"), "function" == typeof this.on.resumeAnimation && this.on.resumeAnimation();
	}
	debounce(e, i = 300) {
		let t;
		return (...s) => {
			t && clearTimeout(t),
				(t = setTimeout(() => {
					e(...s);
				}, i));
		};
	}
}
