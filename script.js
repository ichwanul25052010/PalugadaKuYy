// ==================================================
// KONFIGURASI SUPABASE
// ==================================================

const SUPABASE_URL = "https://mcxerfmuxuuyuxggdhir.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_rQsiAjAJ5Y78LFYd-dvcWg_4Bh5C-Sm";


// Membuat koneksi ke Supabase
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==================================================
// MENAMPILKAN KOMENTAR
// ==================================================

async function tampilkanKomentar() {

    const daftarKomentar =
        document.getElementById("daftarKomentar");

    if (!daftarKomentar) {
        console.error("Elemen #daftarKomentar tidak ditemukan.");
        return;
    }

    daftarKomentar.innerHTML =
        "<p>Memuat komentar...</p>";


    try {

        const { data, error } = await supabaseClient
            .from("komentar")
            .select("id, nama, pesan, created_at")
            .order("created_at", {
                ascending: false
            });


        // Jika terjadi error
        if (error) {

            console.error(
                "Gagal mengambil komentar:",
                error
            );

            daftarKomentar.innerHTML =
                "<p>Gagal mengambil komentar. Silakan cek Console.</p>";

            return;
        }


        // Jika belum ada komentar
        if (!data || data.length === 0) {

            daftarKomentar.innerHTML =
                "<p>Belum ada komentar.</p>";

            return;
        }


        // Kosongkan daftar komentar
        daftarKomentar.innerHTML = "";


        // Menampilkan setiap komentar
        data.forEach(function (komentar) {

            const div =
                document.createElement("div");

            div.className =
                "komentar-item";


            // Nama
            const nama =
                document.createElement("h4");

            nama.textContent =
                komentar.nama;


            // Isi komentar
            const pesan =
                document.createElement("p");

            pesan.textContent =
                komentar.pesan;


            // Tanggal
            const tanggal =
                document.createElement("small");

            if (komentar.created_at) {

                tanggal.textContent =
                    new Date(
                        komentar.created_at
                    ).toLocaleString("id-ID");

            }


            // Masukkan ke div komentar
            div.appendChild(nama);
            div.appendChild(pesan);
            div.appendChild(tanggal);


            // Masukkan ke daftar komentar
            daftarKomentar.appendChild(div);

        });

    } catch (error) {

        console.error(
            "Terjadi kesalahan:",
            error
        );

        daftarKomentar.innerHTML =
            "<p>Terjadi kesalahan saat mengambil komentar.</p>";

    }

}


// ==================================================
// MENYIMPAN KOMENTAR
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const formKomentar =
            document.getElementById("formKomentar");


        if (!formKomentar) {

            console.error(
                "Form #formKomentar tidak ditemukan."
            );

            return;
        }


        formKomentar.addEventListener(
            "submit",
            async function (event) {

                // Mencegah halaman reload
                event.preventDefault();


                // Ambil nama
                const inputNama =
                    document.getElementById("nama");

                // Ambil komentar
                const inputKomentar =
                    document.getElementById("isiKomentar");

                // Ambil status
                const status =
                    document.getElementById(
                        "statusKomentar"
                    );

                // Ambil tombol
                const tombol =
                    document.getElementById(
                        "tombolKomentar"
                    );


                // Pastikan elemen tersedia
                if (
                    !inputNama ||
                    !inputKomentar ||
                    !status
                ) {

                    console.error(
                        "Elemen form komentar tidak lengkap."
                    );

                    return;
                }


                // Ambil nilai
                const nama =
                    inputNama.value.trim();

                const pesan =
                    inputKomentar.value.trim();


                // Validasi
                if (!nama || !pesan) {

                    status.textContent =
                        "Nama dan komentar harus diisi.";

                    return;
                }


                // Status mengirim
                status.textContent =
                    "Mengirim komentar...";


                // Matikan tombol sementara
                if (tombol) {

                    tombol.disabled = true;

                    tombol.textContent =
                        "Mengirim...";

                }


                try {

                    // ==========================================
                    // SIMPAN KE SUPABASE
                    // ==========================================

                    const { data, error } =
                        await supabaseClient
                            .from("komentar")
                            .insert([
                                {
                                    nama: nama,
                                    pesan: pesan
                                }
                            ])
                            .select();


                    // ==========================================
                    // JIKA GAGAL
                    // ==========================================

                    if (error) {

                        console.error(
                            "Komentar gagal disimpan:",
                            error
                        );

                        status.textContent =
                            "Komentar gagal disimpan: " +
                            error.message;

                        if (tombol) {

                            tombol.disabled = false;

                            tombol.textContent =
                                "Kirim Komentar";

                        }

                        return;
                    }


                    // ==========================================
                    // JIKA BERHASIL
                    // ==========================================

                    console.log(
                        "Komentar berhasil disimpan:",
                        data
                    );


                    status.textContent =
                        "Komentar berhasil dikirim!";


                    // Kosongkan form
                    formKomentar.reset();


                    // Tampilkan komentar terbaru
                    await tampilkanKomentar();


                    // Aktifkan tombol
                    if (tombol) {

                        tombol.disabled = false;

                        tombol.textContent =
                            "Kirim Komentar";

                    }


                    // Hilangkan status setelah 3 detik
                    setTimeout(
                        function () {

                            status.textContent = "";

                        },
                        3000
                    );


                } catch (error) {

                    console.error(
                        "Terjadi kesalahan:",
                        error
                    );


                    status.textContent =
                        "Terjadi kesalahan: " +
                        error.message;


                    if (tombol) {

                        tombol.disabled = false;

                        tombol.textContent =
                            "Kirim Komentar";

                    }

                }

            }
        );


        // ==========================================
        // TAMPILKAN KOMENTAR SAAT HALAMAN DIBUKA
        // ==========================================

        tampilkanKomentar();

    }
);
