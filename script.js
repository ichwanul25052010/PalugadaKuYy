```javascript
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
            "<p>Gagal mengambil komentar.</p>";

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

}


// ==================================================
// MENYIMPAN KOMENTAR
// ==================================================

const formKomentar =
    document.getElementById("formKomentar");


if (formKomentar) {

    formKomentar.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Ambil nama
            const nama =
                document
                    .getElementById("nama")
                    .value
                    .trim();


            // Ambil komentar
            const pesan =
                document
                    .getElementById("isiKomentar")
                    .value
                    .trim();


            // Status
            const status =
                document.getElementById(
                    "statusKomentar"
                );


            // Validasi
            if (!nama || !pesan) {

                status.textContent =
                    "Nama dan komentar harus diisi.";

                return;
            }


            // Tampilkan status
            status.textContent =
                "Mengirim komentar...";


            // Matikan tombol sementara
            const tombol =
                document.getElementById(
                    "tombolKomentar"
                );

            if (tombol) {
                tombol.disabled = true;
                tombol.textContent =
                    "Mengirim...";
            }


            // Kirim ke Supabase
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


            // Jika gagal
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


            // Jika berhasil
            console.log(
                "Komentar berhasil:",
                data
            );


            status.textContent =
                "Komentar berhasil dikirim!";


            // Kosongkan form
            formKomentar.reset();


            // Tampilkan komentar terbaru
            await tampilkanKomentar();


            // Aktifkan tombol kembali
            if (tombol) {
                tombol.disabled = false;
                tombol.textContent =
                    "Kirim Komentar";
            }


            // Hilangkan pesan status setelah beberapa detik
            setTimeout(function () {

                status.textContent = "";

            }, 3000);

        }
    );

} else {

    console.error(
        "Form #formKomentar tidak ditemukan."
    );

}


// ==================================================
// JALANKAN SAAT HALAMAN DIBUKA
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        tampilkanKomentar();

    }
);
```
