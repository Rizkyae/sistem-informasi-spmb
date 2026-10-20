document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. FAQ Accordion Logic
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            
            // Toggle current FAQ
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // 3. Form Pendaftaran & LocalStorage Simulation
    const spmbForm = document.getElementById('spmb-form');

    if (spmbForm) {
        spmbForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value.trim();
            const nik = document.getElementById('nik').value.trim();
            const asalSekolah = document.getElementById('asal_sekolah').value.trim();
            const jalur = document.getElementById('jalur_pendaftaran').value;
            const telepon = document.getElementById('telepon').value.trim();
            const nilai = document.getElementById('nilai').value.trim();

            // Validasi Sederhana NIK
            if (nik.length !== 16 || isNaN(nik)) {
                alert('NIK harus terdiri dari 16 digit angka!');
                return;
            }

            // Generate Kode Registration Unik (Contoh: REG-2026-XXXX)
            const kodeReg = 'REG-2026-' + Math.floor(1000 + Math.random() * 9000);

            const pendaftarBaru = {
                kodeReg: kodeReg,
                nama: nama,
                nik: nik,
                asalSekolah: asalSekolah,
                jalur: jalur,
                telepon: telepon,
                nilai: nilai,
                tanggal: new Date().toLocaleDateString('id-ID'),
                status: 'Terverifikasi (Menunggu Seleksi)'
            };

            // Simpan ke LocalStorage
            let listPendaftar = JSON.parse(localStorage.getItem('spmb_pendaftar')) || [];
            listPendaftar.push(pendaftarBaru);
            localStorage.setItem('spmb_pendaftar', JSON.stringify(listPendaftar));

            // Tampilkan Notifikasi Sukses
            alert(`Pendaftaran Berhasil!\n\nNama: ${nama}\nKode Pendaftaran: ${kodeReg}\n\nHarap simpan Kode Pendaftaran ini untuk mengecek status seleksi.`);

            spmbForm.reset();
        });
    }

    // 4. Cek Status Pendaftaran
    const searchForm = document.getElementById('search-status-form');
    const resultBox = document.getElementById('status-result');

    if (searchForm && resultBox) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchKey = document.getElementById('search_key').value.trim().toLowerCase();
            const listPendaftar = JSON.parse(localStorage.getItem('spmb_pendaftar')) || [];

            const foundData = listPendaftar.find(data => 
                data.nik.toLowerCase() === searchKey || data.kodeReg.toLowerCase() === searchKey
            );

            resultBox.classList.remove('hidden');

            if (foundData) {
                resultBox.className = "mt-6 p-6 rounded-xl border border-green-200 bg-green-50 text-slate-800";
                resultBox.innerHTML = `
                    <div class="flex items-center gap-3 mb-4 border-b border-green-200 pb-3">
                        <i class="fa-solid fa-circle-check text-2xl text-green-600"></i>
                        <div>
                            <h4 class="font-bold text-slate-900">Data Pendaftaran Ditemukan</h4>
                            <p class="text-xs text-slate-600">Tanggal Daftar: ${foundData.tanggal}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div><strong class="text-slate-700 block text-xs">Kode Registrasi:</strong> <span class="font-bold text-blue-700">${foundData.kodeReg}</span></div>
                        <div><strong class="text-slate-700 block text-xs">Nama Lengkap:</strong> ${foundData.nama}</div>
                        <div><strong class="text-slate-700 block text-xs">Jalur:</strong> ${foundData.jalur}</div>
                        <div><strong class="text-slate-700 block text-xs">Asal Sekolah:</strong> ${foundData.asalSekolah}</div>
                        <div class="col-span-2 pt-2 border-t border-green-200 mt-2">
                            <strong class="text-slate-700 block text-xs">Status Saat Ini:</strong> 
                            <span class="inline-block mt-1 bg-green-600 text-white font-bold text-xs px-3 py-1 rounded-full">${foundData.status}</span>
                        </div>
                    </div>
                `;
            } else {
                resultBox.className = "mt-6 p-6 rounded-xl border border-red-200 bg-red-50 text-slate-800";
                resultBox.innerHTML = `
                    <div class="flex items-center gap-3">
                        <i class="fa-solid fa-circle-xmark text-2xl text-red-600"></i>
                        <div>
                            <h4 class="font-bold text-slate-900">Data Tidak Ditemukan</h4>
                            <p class="text-xs text-slate-600">Pastikan NIK atau Kode Pendaftaran yang dimasukkan sudah benar.</p>
                        </div>
                    </div>
                `;
            }
        });
    }

});