// ==================================================
// KONFIGURASI SUPABASE
// ==================================================

const SUPABASE_URL = "https://mcxerfmuxuuyuxggdhir.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_rQsiAjAJ5Y78LFYd-dvcWg_4Bh5C-Sm";


// ==================================================
// KONEKSI KE SUPABASE
// ==================================================

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

        const { data, error } =
            await supabaseClient
                .from("komentar")
                .select("id, nama, isi, tanggal")
                .order("tanggal", {
                    ascending: false
                });


        // ==========================================
        // JIKA GAGAL MENGAMBIL DATA
        // ==========================================

        if (error) {

            console.error(
                "Gagal mengambil komentar:",
                error
            );

            daftarKomentar.innerHTML =
                "<p>Gagal mengambil komentar. Silakan cek Console.</p>";

            return;
        }


        // ==========================================
        // JIKA BELUM ADA KOMENTAR
        // ==========================================

        if (!data || data.length === 0) {

            daftarKomentar.innerHTML =
                "<p>Belum ada komentar.</p>";

            return;
        }


        // ==========================================
        // KOSONGKAN DAFTAR
        // ==========================================

        daftarKomentar.innerHTML = "";


        // ==========================================
        // TAMPILKAN SEMUA KOMENTAR
        // ==========================================

        data.forEach(function (komentar) {

            const div =
                document.createElement("div");

            div.className =
                "komentar-item";


            // --------------------------------------
            // NAMA
            // --------------------------------------

            const nama =
                document.createElement("h4");

            nama.textContent =
                komentar.nama;


            // --------------------------------------
            // ISI KOMENTAR
            // --------------------------------------

            const isi =
                document.createElement("p");

            isi.textContent =
                komentar.isi;


            // --------------------------------------
            // TANGGAL
            // --------------------------------------

            const tanggal =
                document.createElement("small");

            if (komentar.tanggal) {

                tanggal.textContent =
                    new Date(
                        komentar.tanggal
                    ).toLocaleString("id-ID");

            }


            // --------------------------------------
// TOMBOL HAPUS
// --------------------------------------

const tombolHapus =
    document.createElement("button");

tombolHapus.type = "button";
tombolHapus.textContent = "Hapus";
tombolHapus.className = "btn-hapus";


// --------------------------------------
// KETIKA TOMBOL HAPUS DIKLIK
// --------------------------------------

tombolHapus.addEventListener(
    "click",
    async function () {

        const yakin = confirm(
            "Apakah kamu yakin ingin menghapus komentar ini?"
        );

        if (!yakin) {
            return;
        }


        // Ubah tombol menjadi Menghapus...
        tombolHapus.disabled = true;
        tombolHapus.textContent = "Menghapus...";


        try {

            // ----------------------------------
            // HAPUS BERDASARKAN ID
            // ----------------------------------

            const { error } =
                await supabaseClient
                    .from("komentar")
                    .delete()
                    .eq("id", komentar.id);


            // ----------------------------------
            // JIKA GAGAL
            // ----------------------------------

            if (error) {

                console.error(
                    "Gagal menghapus komentar:",
                    error
                );

                alert(
                    "Komentar gagal dihapus: " +
                    error.message
                );

                tombolHapus.disabled = false;
                tombolHapus.textContent = "Hapus";

                return;
            }


            // ----------------------------------
            // JIKA BERHASIL
            // ----------------------------------

            alert("Komentar berhasil dihapus.");

            await tampilkanKomentar();

        }

        catch (error) {

            console.error(
                "Terjadi kesalahan:",
                error
            );

            alert(
                "Terjadi kesalahan saat menghapus komentar."
            );

            tombolHapus.disabled = false;
            tombolHapus.textContent = "Hapus";

        }

    }
);


// --------------------------------------
// MASUKKAN KE KOMENTAR
// --------------------------------------

div.appendChild(nama);
div.appendChild(isi);
div.appendChild(tanggal);
div.appendChild(tombolHapus);


// --------------------------------------
// MASUKKAN KE DAFTAR
// --------------------------------------

daftarKomentar.appendChild(div);

        });

    }

    catch (error) {

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

                // ----------------------------------
                // MENCEGAH HALAMAN RELOAD
                // ----------------------------------

                event.preventDefault();


                // ----------------------------------
                // AMBIL INPUT
                // ----------------------------------

                const inputNama =
                    document.getElementById("nama");

                const inputKomentar =
                    document.getElementById("isiKomentar");

                const status =
                    document.getElementById(
                        "statusKomentar"
                    );

                const tombol =
                    document.getElementById(
                        "tombolKomentar"
                    );


                // ----------------------------------
                // CEK ELEMEN
                // ----------------------------------

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


                // ----------------------------------
                // AMBIL NILAI
                // ----------------------------------

                const nama =
                    inputNama.value.trim();

                const isi =
                    inputKomentar.value.trim();


                // ----------------------------------
                // VALIDASI
                // ----------------------------------

                if (!nama || !isi) {

                    status.textContent =
                        "Nama dan komentar harus diisi.";

                    return;
                }


                // ----------------------------------
                // STATUS MENGIRIM
                // ----------------------------------

                status.textContent =
                    "Mengirim komentar...";


                // ----------------------------------
                // NONAKTIFKAN TOMBOL
                // ----------------------------------

                if (tombol) {

                    tombol.disabled = true;

                    tombol.textContent =
                        "Mengirim...";

                }


                try {

                    // ==================================
                    // SIMPAN KE SUPABASE
                    // ==================================

                    const { data, error } =
                        await supabaseClient
                            .from("komentar")
                            .insert([
                                {
                                    nama: nama,
                                    isi: isi
                                }
                            ])
                            .select();


                    // ==================================
                    // JIKA GAGAL
                    // ==================================

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


                    // ==================================
                    // JIKA BERHASIL
                    // ==================================

                    console.log(
                        "Komentar berhasil disimpan:",
                        data
                    );

                    status.textContent =
                        "Komentar berhasil dikirim!";


                    // ----------------------------------
                    // KOSONGKAN FORM
                    // ----------------------------------

                    formKomentar.reset();


                    // ----------------------------------
                    // TAMPILKAN KOMENTAR TERBARU
                    // ----------------------------------

                    await tampilkanKomentar();


                    // ----------------------------------
                    // AKTIFKAN KEMBALI TOMBOL
                    // ----------------------------------

                    if (tombol) {

                        tombol.disabled = false;

                        tombol.textContent =
                            "Kirim Komentar";

                    }


                    // ----------------------------------
                    // HAPUS STATUS
                    // ----------------------------------

                    setTimeout(
                        function () {

                            status.textContent = "";

                        },
                        3000
                    );

                }

                catch (error) {

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
