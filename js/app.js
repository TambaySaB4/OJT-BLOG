function createCard(item, index = 0) {
    return `
    <div class="fade-in max-w-full rounded-2xl border border-white/10 p-6 shadow-sm">

      <div class="flex flex-col gap-6 sm:flex-row">

        <div class="flex-shrink-0">
          <div class="h-48 w-48 overflow-hidden rounded-xl bg-gray-200">
            <img src="${item.img}" class="h-full w-full object-cover">
          </div>
        </div>

        <div class="flex flex-col justify-center">
          <div class="flex flex-row gap-3">
            <h2 class="text-xl font-bold text-white">${item.title}</h2>
            <p class="text-xs text-gray-500 mt-1.5">${item.date}</p>
          </div>

          <p class="mt-3 text-gray-400 line-clamp-4">${item.desc}</p>
             <div class="mt-4">
            <a href="weeks.html?id=${item.id}" 
               class="inline-block bg-gray-900 text-gray-400 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-gray-700">
              View
            </a>
          </div>
        </div>

      </div>
    </div>
    `;
}

function renderMonth(month) {
    const container = document.getElementById("weeks-container");

    if (!DATA[month]) return;

    container.innerHTML = "";

    DATA[month].forEach((item, index) => {
        container.insertAdjacentHTML("beforeend", createCard(item, index));
    });

    observeCards(); 
}

function setActiveMonth(month) {
    // render content
    renderMonth(month);

    // reset all buttons
    const buttons = document.querySelectorAll(".month-btn");

    buttons.forEach(btn => {
        const isActive = btn.getAttribute("data-month") === month;

        if (isActive) {
            btn.classList.remove("bg-gray-900", "text-gray-600");
            btn.classList.add("bg-gray-900", "text-[#4A90E2]");
        } else {
            btn.classList.remove("bg-[#4A90E2]", "text-white");
            btn.classList.add("bg-gray-900", "text-gray-600");
        }
    });
}

// default load
window.onload = function () {
    setActiveMonth("FEB");
};

function openLightbox(src) {
    let existing = document.getElementById("lightbox");

    if (existing) existing.remove();

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = `
        fixed inset-0 bg-black/80 flex items-center justify-center z-50
    `;

    lightbox.innerHTML = `
        <img src="${src}" class="max-w-[90%] max-h-[90%] rounded-xl shadow-lg">
    `;

    lightbox.onclick = () => lightbox.remove();

    document.body.appendChild(lightbox);
}

function renderImages(images) {
    const container = document.getElementById("image-grid");

    container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div class="relative overflow-hidden rounded-2xl aspect-square cursor-zoom-in">
        <img src="${images[0]}" onclick="openLightbox(this.src)"
          class="h-full w-full object-cover hover:scale-105 transition">
      </div>

      <div class="grid grid-cols-2 gap-4">

        ${images.slice(1).map(img => `
          <div class="overflow-hidden rounded-2xl aspect-square cursor-zoom-in">
            <img src="${img}" onclick="openLightbox(this.src)"
              class="h-full w-full object-cover hover:scale-105 transition">
          </div>
        `).join("")}

      </div>

    </div>
    `;
}

function renderDTR(dtr) {
    const container = document.getElementById("dtr-container");

    const days = ["mon", "tue", "wed", "thu", "fri", "sat"];

    container.innerHTML = `
        <div class="grid grid-cols-3 text-xs text-gray-500 mb-2">
            <span>Day</span>
            <span class="text-center">AM</span>
            <span class="text-right">PM</span>
        </div>

        ${days.map(day => {
            const data = dtr?.[day];

            if (!data) {
                return `
                    <div class="grid grid-cols-3 text-xs text-gray-500">
                        <span>${day.toUpperCase()}</span>
                        <span class="text-center">-</span>
                        <span class="text-right">-</span>
                    </div>
                `;
            }

            if (data.type === "wfh") {
                return `
                    <div class="grid grid-cols-3 text-xs text-[#5999d4]">
                        <span>${day.toUpperCase()}</span>
                        <span class="text-center">WFH</span>
                        <span class="text-right">WFH</span>
                    </div>
                `;
            }

            if (data.type === "office") {
                return `
                    <div class="grid grid-cols-3 text-xs text-gray-400">
                        <span>${day.toUpperCase()}</span>
                        <span class="text-center">${data.am ?? "-"}</span>
                        <span class="text-right">${data.pm ?? "-"}</span>
                    </div>
                `;
            }

            return "";
        }).join("")}
    `;
}

function observeCards() {
    const cards = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target); // animate once
            }
        });
    }, {
        threshold: 0.15
    });

    cards.forEach(card => observer.observe(card));
}