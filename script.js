// Mobile Navigation Logic
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileMenuBtn.addEventListener('click', () => {
    // Toggle menu visibility
    mobileMenu.classList.toggle('hidden');
    
    // Toggle SVG icon between Hamburger and X
    if (mobileMenu.classList.contains('hidden')) {
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16'); // Hamburger
    } else {
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12'); // X icon
    }
});

// Close mobile menu automatically when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    });
});

// State management
let packData = [];
const gridContainer = document.getElementById('packGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('packModal');
const backdrop = document.getElementById('modalBackdrop');

// Icons
const iconDownload = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>`;
const iconLock = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`;
const iconPatreon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.386.524c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 4.4 20.136.524 15.386.524M.003 23.537h4.22V.524H.003v23.013z"/></svg>`;

async function init() {
    try {
        const response = await fetch('data.json');
        packData = await response.json();
        renderPacks(packData);
    } catch (error) {
        console.error("Error loading texture packs:", error);
        gridContainer.innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load texture packs. Ensure you are running a local server.</p>`;
    }
}

function renderPacks(packs) {
    gridContainer.innerHTML = '';
    if (packs.length === 0) {
        gridContainer.innerHTML = `<p class="text-[#d3bc8e] text-center col-span-full py-12">No texture packs found matching your criteria.</p>`;
        return;
    }

    packs.forEach(pack => {
        const card = document.createElement('div');
        card.className = "group relative bg-[#1c253c]/40 backdrop-blur-sm border border-[#d3bc8e]/20 rounded-xl overflow-hidden cursor-pointer shadow-lg card-hover";
        
        card.innerHTML = `
            <div class="aspect-video overflow-hidden bg-black">
                <img src="${pack.thumbnail}" alt="${pack.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100">
            </div>
            <div class="p-5 relative z-10">
                <div class="flex justify-between items-center">
                    <h3 class="font-serif text-xl font-semibold text-white">${pack.name}</h3>
                    <span class="bg-[#0f1423] text-[#d3bc8e] text-xs px-2 py-1 rounded border border-[#d3bc8e]/30">${pack.resolution}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openModal(pack));
        gridContainer.appendChild(card);
    });
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredPacks = packData.filter(pack => 
        pack.name.toLowerCase().includes(query) || 
        pack.resolution.toLowerCase().includes(query)
    );
    renderPacks(filteredPacks);
});

function openModal(pack) {
    document.getElementById('modalTitle').textContent = pack.name;
    document.getElementById('modalTitleMobile').textContent = pack.name;
    document.getElementById('modalRes').textContent = pack.resolution;
    document.getElementById('modalDesc').textContent = pack.description;
    
    // Set Video (Added a wrapper to ensure it stretches to fill the container height on desktop)
    const videoContainer = document.getElementById('modalVideoContainer');
    videoContainer.innerHTML = `<iframe class="absolute inset-0 w-full h-full" src="${pack.videoEmbed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    // Render Clean Buttons
    const buttonsContainer = document.getElementById('modalButtons');
    buttonsContainer.innerHTML = '';

    // Helper function to generate clean download rows
    const createDownloadRow = (title, freeLink, patreonLink, isExclusive = false) => {
        let buttonsHTML = '';
        
        if (isExclusive) {
            buttonsHTML = `
                <a href="${patreonLink}" target="_blank" class="flex-1 flex items-center justify-center gap-2 bg-[#d3bc8e]/10 hover:bg-[#d3bc8e]/20 text-[#d3bc8e] border border-[#d3bc8e]/30 py-2 px-3 rounded transition-colors text-sm font-semibold">
                    ${iconLock} Patreon Exclusive
                </a>`;
        } else {
            buttonsHTML = `
                <a href="${freeLink}" target="_blank" class="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2 px-3 rounded transition-colors text-sm">
                    ${iconDownload} Free (Ad)
                </a>
                <a href="${patreonLink}" target="_blank" class="flex-1 flex items-center justify-center gap-2 bg-[#d3bc8e]/10 hover:bg-[#d3bc8e]/20 text-[#d3bc8e] border border-[#d3bc8e]/30 py-2 px-3 rounded transition-colors text-sm font-semibold">
                    ${iconPatreon} Ad-Free
                </a>`;
        }

        return `
            <div class="flex flex-col gap-1 border border-[#d3bc8e]/10 bg-black/20 p-3 rounded-lg">
                <span class="text-xs text-gray-400 uppercase tracking-wider font-semibold ml-1">${title}</span>
                <div class="flex gap-2 mt-1">
                    ${buttonsHTML}
                </div>
            </div>
        `;
    };

    // Populate versions
    buttonsContainer.innerHTML += createDownloadRow('Java Edition 1.8.9', pack.links.java18_ad, pack.links.java18_patreon);
    buttonsContainer.innerHTML += createDownloadRow('Java Edition 1.20+', null, pack.links.javaLatest_patreon, true);
    buttonsContainer.innerHTML += createDownloadRow('Bedrock Edition', pack.links.bedrock_ad, pack.links.bedrock_patreon);

    // NSFW Conditional Button
    if (pack.nsfw && pack.links.nsfw_link) {
        buttonsContainer.innerHTML += `
            <div class="flex flex-col gap-1 border border-rose-900/30 bg-rose-950/20 p-3 rounded-lg mt-2">
                <span class="text-xs text-rose-400 uppercase tracking-wider font-semibold ml-1">NSFW Version</span>
                <a href="${pack.links.nsfw_link}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-rose-900/30 hover:bg-rose-900/50 text-rose-200 border border-rose-800/50 py-2 px-3 rounded transition-colors text-sm mt-1">
                    ${iconLock} Get on Patreon
                </a>
            </div>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    document.getElementById('modalVideoContainer').innerHTML = ''; // Stop video
}

// Event Listeners
document.getElementById('closeModalBtnDesktop').addEventListener('click', closeModal);
document.getElementById('closeModalBtnMobile').addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// Run Init
init();