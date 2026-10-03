const SUPABASE_URL = "https://mcxerfmuxuuyuxggdhir.supabase.co/rest/v1/;
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rQsiAjAJ5Y78LFYd-dvcWg_4Bh5C-Sm;

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ===============================
// MENAMPILKAN KOMENTAR
// ===============================

async function tampilkanKomentar() {

    const daftarKomentar =
        document.getElementById("daftarKomentar");

    daftarKomentar.innerHTML = "<p>Memuat komentar...</p>";

    const { data, error } = await supabaseClient
        .from("komentar")
        .select("id, nama, pesan, created_at")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error("Gagal mengambil komentar:", error);

        daftarKomentar.innerHTML =
            "<p>Gagal mengambil komentar.</p>";

        return;
    }


    if (!data || data.length === 0) {

        daftarKomentar.innerHTML =
            "<p>Belum ada komentar.</p>";

        return;
    }


    daftarKomentar.innerHTML = "";


    data.forEach(function (komentar) {

        const div = document.createElement("div");

        div.className = "komentar-item";


        const nama = document.createElement("h4");
        nama.textContent = komentar.nama;


        const pesan = document.createElement("p");
        pesan.textContent = komentar.pesan;


        const tanggal = document.createElement("small");

        tanggal.textContent =
            new Date(komentar.created_at)
                .toLocaleString("id-ID");


        div.appendChild(nama);
        div.appendChild(pesan);
        div.appendChild(tanggal);


        daftarKomentar.appendChild(div);

    });
}


// ===============================
// MENYIMPAN KOMENTAR
// ===============================

const formKomentar =
    document.getElementById("formKomentar");


formKomentar.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const nama =
            document.getElementById("nama")
                .value.trim();


        const pesan =
            document.getElementById("isiKomentar")
                .value.trim();


        const status =
            document.getElementById("statusKomentar");


        if (!nama || !pesan) {

            status.textContent =
                "Nama dan komentar harus diisi.";

            return;
        }


        status.textContent =
            "Mengirim komentar...";


        const { error } =
            await supabaseClient
                .from("komentar")
                .insert([
                    {
                        nama: nama,
                        pesan: pesan
                    }
                ]);


        if (error) {

            console.error(
                "Komentar gagal disimpan:",
                error
            );


            status.textContent =
                "Komentar gagal disimpan: " +
                error.message;

            return;
        }


        status.textContent =
            "Komentar berhasil dikirim!";


        formKomentar.reset();


        await tampilkanKomentar();

    }
);


// ===============================
// JALANKAN SAAT HALAMAN DIBUKA
// ===============================

tampilkanKomentar();
