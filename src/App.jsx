import { useState, useEffect } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const BAHAN_DB = {
  "🥩 Protein Hewani": ["Ayam","Daging Sapi","Ikan Salmon","Ikan Kembung","Ikan Tuna","Udang","Telur","Hati Ayam","Hati Sapi","Ikan Teri"],
  "🌱 Protein Nabati": ["Tahu","Tempe","Kacang Merah","Kacang Hijau","Kacang Polong","Edamame"],
  "🌾 Karbohidrat": ["Beras","Oat","Kentang","Ubi Jalar","Labu Kuning","Singkong","Jagung","Pisang","Roti Tawar"],
  "🥦 Sayuran": ["Wortel","Brokoli","Bayam","Buncis","Kacang Panjang","Tomat","Labu Siam","Zucchini","Kembang Kol","Kangkung","Sawi","Jagung Manis","Timun"],
  "🍎 Buah": ["Pisang","Alpukat","Pepaya","Mangga","Pir","Apel","Melon","Semangka","Jeruk","Kiwi","Strawberry","Anggur"],
  "🫒 Lemak Sehat": ["Minyak Zaitun","Santan","Butter","Minyak Kelapa","Keju Cheddar"],
};

const ALERGEN = ["Telur","Susu Sapi","Kacang Tanah","Kacang Pohon","Ikan","Udang","Gandum/Gluten","Kedelai"];
const HARI = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];
const WAKTU_MAKAN = ["Pagi 🌅","Siang ☀️","Sore 🌤️"];
const TIPS_MPASI = [
  { icon: "🌡️", judul: "Suhu Penyajian", isi: "Sajikan hangat suhu tubuh (37°C). Test di pergelangan tangan Mama sebelum suapi." },
  { icon: "⏱️", judul: "Durasi Makan", isi: "Beri waktu makan 20–30 menit. Jangan paksa jika bayi menolak." },
  { icon: "🥄", judul: "Mulai Bertahap", isi: "Mulai 1–2 sendok teh, naikan perlahan jadi 2–3 sendok makan dalam beberapa minggu." },
  { icon: "🧪", judul: "Metode OAT", isi: "One At a Time — perkenalkan 1 bahan baru tiap 3 hari untuk deteksi alergi." },
  { icon: "🚫", judul: "Pantangan Wajib", isi: "Tanpa garam, gula, madu, kecap, penyedap rasa untuk bayi di bawah 1 tahun." },
  { icon: "🍼", judul: "ASI Tetap Utama", isi: "MPASI hanya pelengkap. ASI atau sufor tetap kebutuhan utama sampai usia 2 tahun." },
];
const MILESTONE = [
  { usia: "6 Bulan", tekstur: "Puree sangat halus", porsi: "1–2 sdm / makan", frekuensi: "2–3x sehari", icon: "🌱" },
  { usia: "7 Bulan", tekstur: "Puree agak kasar", porsi: "2–3 sdm / makan", frekuensi: "2–3x sehari", icon: "🌿" },
  { usia: "8–9 Bulan", tekstur: "Minced / cincang halus", porsi: "3–4 sdm / makan", frekuensi: "3x sehari", icon: "🌳" },
  { usia: "10–12 Bulan", tekstur: "Chopped / potongan kecil", porsi: "½ mangkuk kecil", frekuensi: "3x + snack", icon: "🎋" },
];

// ── STORAGE HELPERS ───────────────────────────────────────────────────────────
const lsGet = (key) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function MPASIApp() {
  const [tab, setTab] = useState("beranda");
  const [babyName, setBabyName] = useState("");
  const [babyAge, setBabyAge] = useState("6");
  const [alergiList, setAlergiList] = useState([]);
  const [showOnboard, setShowOnboard] = useState(true);
  const [onboardStep, setOnboardStep] = useState(0);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [jadwal, setJadwal] = useState({});

  useEffect(() => {
    const profile = lsGet("mpasi_profile");
    if (profile) { setBabyName(profile.name||""); setBabyAge(profile.age||"6"); setAlergiList(profile.alergi||[]); setShowOnboard(false); }
    const saved = lsGet("mpasi_saved"); if (saved) setSavedRecipes(saved);
    const jdwl = lsGet("mpasi_jadwal"); if (jdwl) setJadwal(jdwl);
  }, []);

  const saveProfile = () => {
    lsSet("mpasi_profile", { name: babyName, age: babyAge, alergi: alergiList });
    setShowOnboard(false);
  };
  const saveRecipe = (resep) => {
    const updated = savedRecipes.find(r => r.nama === resep.nama)
      ? savedRecipes.filter(r => r.nama !== resep.nama)
      : [...savedRecipes, resep];
    setSavedRecipes(updated); lsSet("mpasi_saved", updated);
  };
  const addToJadwal = (hari, waktu, resepNama) => {
    const updated = { ...jadwal, [`${hari}-${waktu}`]: resepNama };
    setJadwal(updated); lsSet("mpasi_jadwal", updated);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FFF8F3", fontFamily:"'Nunito',sans-serif", maxWidth:480, margin:"0 auto", position:"relative" }}>
      <style>{CSS}</style>
      {showOnboard && (
        <Onboarding step={onboardStep} setStep={setOnboardStep}
          name={babyName} setName={setBabyName}
          age={babyAge} setAge={setBabyAge}
          alergi={alergiList} setAlergi={setAlergiList}
          onDone={saveProfile} />
      )}
      {!showOnboard && (
        <>
          {tab==="beranda"   && <Beranda babyName={babyName} babyAge={babyAge} savedRecipes={savedRecipes} setTab={setTab} />}
          {tab==="generator" && <Generator babyAge={babyAge} alergi={alergiList} savedRecipes={savedRecipes} onSave={saveRecipe} onAddJadwal={addToJadwal} />}
          {tab==="jadwal"    && <Jadwal jadwal={jadwal} onAdd={addToJadwal} savedRecipes={savedRecipes} />}
          {tab==="tersimpan" && <Tersimpan savedRecipes={savedRecipes} onSave={saveRecipe} />}
          {tab==="panduan"   && <Panduan babyAge={babyAge} />}
          <BottomNav tab={tab} setTab={setTab} savedCount={savedRecipes.length} />
        </>
      )}
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({ step, setStep, name, setName, age, setAge, alergi, setAlergi, onDone }) {
  const steps = [
    { title:"Halo, Mama! 👋", sub:"Mari setup profil si kecil dulu yuk, biar rekomendasinya makin pas 🍼" },
    { title:"Nama si Kecil?", sub:"Supaya terasa lebih personal ✨" },
    { title:"Usia Sekarang?", sub:"Kami sesuaikan tekstur & porsi yang tepat" },
    { title:"Ada Alergi?", sub:"Centang jika si kecil pernah atau diduga alergi bahan ini" },
  ];
  const cur = steps[step];
  return (
    <div className="onboard-overlay">
      <div className="onboard-card">
        <div className="onboard-dots">
          {steps.map((_,i)=><div key={i} className={`dot ${i===step?"active":i<step?"done":""}`}/>)}
        </div>
        {step===0 && (
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:80,marginBottom:16}}>🥣</div>
            <h2 className="ob-title">{cur.title}</h2>
            <p className="ob-sub">{cur.sub}</p>
            <div style={{background:"linear-gradient(135deg,#FFF0E8,#FFE4D6)",borderRadius:16,padding:"16px 20px",margin:"20px 0",textAlign:"left"}}>
              <div style={{fontWeight:700,fontSize:14,color:"#E07040",marginBottom:8}}>✨ Fitur Unggulan</div>
              {["🔍 Generator menu dari bahan yang kamu punya","🤖 Resep AI — langsung dibuatkan untukmu","📅 Jadwal menu mingguan","💾 Simpan resep favorit","📚 Panduan MPASI lengkap"].map((f,i)=>(
                <div key={i} style={{fontSize:13,color:"#555",padding:"4px 0"}}>{f}</div>
              ))}
            </div>
            <button className="btn-primary" onClick={()=>setStep(1)}>Mulai Sekarang →</button>
          </div>
        )}
        {step===1 && (
          <div>
            <h2 className="ob-title">{cur.title}</h2>
            <p className="ob-sub">{cur.sub}</p>
            <input className="ob-input" placeholder="Contoh: Arya, Kenzie, Nara..." value={name} onChange={e=>setName(e.target.value)} autoFocus onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(2)}/>
            <button className="btn-primary" style={{marginTop:20}} onClick={()=>setStep(2)} disabled={!name.trim()}>Lanjut →</button>
          </div>
        )}
        {step===2 && (
          <div>
            <h2 className="ob-title">{cur.title}</h2>
            <p className="ob-sub">{cur.sub}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,margin:"20px 0"}}>
              {["6","7","8","9","10","11","12"].map(a=>(
                <button key={a} className={`age-btn ${age===a?"active":""}`} onClick={()=>setAge(a)}>{a} Bulan</button>
              ))}
            </div>
            <button className="btn-primary" onClick={()=>setStep(3)}>Lanjut →</button>
          </div>
        )}
        {step===3 && (
          <div>
            <h2 className="ob-title">{cur.title}</h2>
            <p className="ob-sub">{cur.sub}</p>
            <div style={{margin:"16px 0"}}>
              {ALERGEN.map(a=>(
                <div key={a} className={`alergi-row ${alergi.includes(a)?"active":""}`} onClick={()=>setAlergi(p=>p.includes(a)?p.filter(x=>x!==a):[...p,a])}>
                  <span>{a}</span><span style={{fontSize:18}}>{alergi.includes(a)?"✓":"○"}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" onClick={onDone}>Selesai & Mulai! 🎉</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BERANDA ───────────────────────────────────────────────────────────────────
function Beranda({ babyName, babyAge, savedRecipes, setTab }) {
  const milestone = MILESTONE.find(m=>{
    const a=parseInt(babyAge);
    if(m.usia==="6 Bulan"&&a===6) return true;
    if(m.usia==="7 Bulan"&&a===7) return true;
    if(m.usia==="8–9 Bulan"&&(a===8||a===9)) return true;
    if(m.usia==="10–12 Bulan"&&a>=10) return true;
    return false;
  })||MILESTONE[0];
  const greeting=()=>{const h=new Date().getHours();if(h<11)return"Selamat Pagi";if(h<15)return"Selamat Siang";if(h<18)return"Selamat Sore";return"Selamat Malam";};
  return (
    <div className="page">
      <div className="hero-wrap">
        <div className="hero-bg"/>
        <div className="hero-content">
          <div style={{fontSize:13,color:"rgba(255,255,255,0.85)",fontWeight:600,marginBottom:4}}>{greeting()}, Mama 👋</div>
          <h1 className="hero-title">Menu untuk<br/><span className="hero-name">{babyName||"Si Kecil"}</span></h1>
          <div className="hero-badge">{babyAge} Bulan • {milestone.tekstur}</div>
        </div>
        <div className="hero-blob">🍼</div>
      </div>
      <div style={{padding:"0 16px",marginTop:-20}}>
        <div className="milestone-card">
          <div style={{fontSize:32}}>{milestone.icon}</div>
          <div>
            <div style={{fontWeight:800,fontSize:15,color:"#2D1B0E"}}>Usia {milestone.usia}</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>{milestone.tekstur} • {milestone.porsi} • {milestone.frekuensi}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
          <QuickCard icon="🔍" title="Cari Menu" sub="Dari bahan tersedia" color="#FF8C69" onClick={()=>setTab("generator")}/>
          <QuickCard icon="📅" title="Jadwal Makan" sub="Atur minggu ini" color="#52B788" onClick={()=>setTab("jadwal")}/>
          <QuickCard icon="💾" title="Tersimpan" sub={`${savedRecipes.length} resep`} color="#9B72CF" onClick={()=>setTab("tersimpan")}/>
          <QuickCard icon="📚" title="Panduan" sub="Tips & tabel MPASI" color="#E07A5F" onClick={()=>setTab("panduan")}/>
        </div>
        <div style={{marginTop:24}}>
          <div className="section-title">💡 Tips Hari Ini</div>
          <TipsCarousel/>
        </div>
      </div>
      <div style={{height:100}}/>
    </div>
  );
}
function QuickCard({icon,title,sub,color,onClick}){
  return(
    <button className="quick-card" onClick={onClick} style={{"--c":color}}>
      <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
      <div style={{fontWeight:800,fontSize:15,color:"#2D1B0E"}}>{title}</div>
      <div style={{fontSize:12,color:"#999",marginTop:2}}>{sub}</div>
    </button>
  );
}
function TipsCarousel(){
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%TIPS_MPASI.length),4000);return()=>clearInterval(t);},[]);
  const tip=TIPS_MPASI[idx];
  return(
    <div className="tips-carousel">
      <div style={{fontSize:32,marginRight:14}}>{tip.icon}</div>
      <div>
        <div style={{fontWeight:800,fontSize:14,color:"#2D1B0E",marginBottom:4}}>{tip.judul}</div>
        <div style={{fontSize:13,color:"#666",lineHeight:1.6}}>{tip.isi}</div>
      </div>
      <div style={{position:"absolute",bottom:12,right:16,display:"flex",gap:4}}>
        {TIPS_MPASI.map((_,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:i===idx?"#FF8C69":"#DDD",transition:"background 0.3s"}}/>)}
      </div>
    </div>
  );
}

// ── GENERATOR ────────────────────────────────────────────────────────────────
function Generator({ babyAge, alergi, savedRecipes, onSave, onAddJadwal }) {
  const [bahanDipilih,setBahanDipilih]=useState([]);
  const [inputCustom,setInputCustom]=useState("");
  const [loading,setLoading]=useState(false);
  const [results,setResults]=useState([]);
  const [activeResep,setActiveResep]=useState(null);
  const [view,setView]=useState("input");
  const [addingToJadwal,setAddingToJadwal]=useState(false);
  const [addedMsg,setAddedMsg]=useState("");
  const [apiError,setApiError]=useState("");

  const toggleBahan=(b)=>setBahanDipilih(p=>p.includes(b)?p.filter(x=>x!==b):[...p,b]);
  const addCustom=()=>{const t=inputCustom.trim();if(t&&!bahanDipilih.includes(t)){setBahanDipilih(p=>[...p,t]);setInputCustom("");}};

  const generate=async()=>{
    if(!bahanDipilih.length) return;
    setLoading(true); setView("hasil"); setResults([]); setApiError("");
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if(!apiKey){
      setApiError("API key Gemini belum diset. Lihat README untuk cara menambahkan VITE_GEMINI_API_KEY di Vercel (100% gratis!).");
      setLoading(false); return;
    }
    const prompt=`Kamu adalah ahli nutrisi MPASI Indonesia. Buatkan TEPAT 4 resep MPASI kreatif dan bergizi untuk bayi usia ${babyAge} bulan.

Bahan yang tersedia: ${bahanDipilih.join(", ")}
${alergi.length?`⚠️ HINDARI bahan alergen ini: ${alergi.join(", ")}`:""}

ATURAN PENTING:
- Tidak boleh ada garam, gula, madu, kecap, penyedap untuk bayi <1 tahun
- Tekstur sesuai usia ${babyAge} bulan: ${parseInt(babyAge)<=6?"puree sangat halus":parseInt(babyAge)<=8?"puree agak kasar / bubur halus":"minced / cincang halus"}
- Gunakan minimal 2 bahan dari daftar yang tersedia per resep
- Resep harus praktis, bisa dibuat ibu rumah tangga biasa
- Selalu ada komponen protein + karbohidrat dalam setiap resep

Balas HANYA dengan JSON array murni, tanpa teks lain, tanpa markdown, tanpa backtick:
[{"nama":"Nama Resep","emoji":"emoji","warna":"#hexcolor","waktu":"X menit","tekstur":"jenis tekstur","nutrisi":"emoji + manfaat gizi singkat","bahan":["bahan 1 + takaran","bahan 2 + takaran"],"langkah":["langkah 1","langkah 2","langkah 3","langkah 4"],"tips":"1 tips spesifik resep ini"}]`;
    try{
      const res=await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[{text:prompt}]}],
            generationConfig:{temperature:0.7,maxOutputTokens:2048},
          }),
        }
      );
      const data=await res.json();
      if(data.error){setApiError("Error Gemini API: "+data.error.message);setLoading(false);return;}
      const text=data.candidates?.[0]?.content?.parts?.[0]?.text||"[]";
      const clean=text.replace(/```json|```/g,"").trim();
      setResults(JSON.parse(clean));
    }catch(e){
      setApiError("Gagal terhubung ke AI. Periksa API key dan koneksi internet.");
    }
    setLoading(false);
  };

  const handleAddJadwal=async(hari,waktu)=>{
    onAddJadwal(hari,waktu,activeResep.nama);
    setAddedMsg(`✓ Ditambahkan ke ${hari} ${waktu}`);
    setTimeout(()=>{setAddedMsg("");setAddingToJadwal(false);},2000);
  };

  return(
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">🔍 Generator Menu</h2>
        {view!=="input"&&<button className="btn-text" onClick={()=>{setView("input");setResults([]);setBahanDipilih([]);}}>Ulang</button>}
      </div>
      {view==="input"&&(
        <div style={{padding:"0 16px"}}>
          {Object.entries(BAHAN_DB).map(([kat,items])=>(
            <div key={kat} style={{marginBottom:20}}>
              <div className="kat-label">{kat}</div>
              <div className="chip-wrap">
                {items.map(b=>(
                  <button key={b} className={`chip ${bahanDipilih.includes(b)?"active":""}`} onClick={()=>toggleBahan(b)}>{b}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="custom-row">
            <input className="custom-inp" placeholder="Tambah bahan lain..." value={inputCustom} onChange={e=>setInputCustom(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()}/>
            <button className="btn-sm" onClick={addCustom}>+</button>
          </div>
          {bahanDipilih.length>0&&(
            <div className="selected-wrap">
              <div style={{fontSize:12,fontWeight:700,color:"#FF8C69",marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>Bahan Terpilih ({bahanDipilih.length})</div>
              <div className="chip-wrap">
                {bahanDipilih.map(b=><button key={b} className="chip active" onClick={()=>toggleBahan(b)}>{b} ×</button>)}
              </div>
            </div>
          )}
          <button className="btn-primary big" onClick={generate} disabled={!bahanDipilih.length} style={{marginTop:20}}>🤖 Buatkan Resep AI Sekarang!</button>
          <div style={{height:100}}/>
        </div>
      )}
      {view==="hasil"&&(
        <div style={{padding:"0 16px"}}>
          {loading?(
            <div className="loading-state">
              <div className="loading-spinner"/>
              <div style={{fontWeight:700,fontSize:16,color:"#2D1B0E",marginTop:16}}>AI sedang memasak resep...</div>
              <div style={{fontSize:13,color:"#999",marginTop:6}}>Sebentar ya Mama ✨</div>
            </div>
          ):apiError?(
            <div className="error-state">
              <div style={{fontSize:48}}>⚠️</div>
              <div style={{fontWeight:700,fontSize:15,color:"#E07A5F",marginTop:12}}>{apiError}</div>
              <button className="btn-primary" style={{marginTop:20}} onClick={()=>{setView("input");setApiError("");}}>← Kembali</button>
            </div>
          ):(
            <>
              <div style={{fontSize:13,color:"#888",marginBottom:16}}>Dari {bahanDipilih.length} bahan → {results.length} menu ditemukan</div>
              {results.map((r,i)=>(
                <ResepCard key={i} resep={r} saved={savedRecipes.some(s=>s.nama===r.nama)} onSave={()=>onSave(r)} onClick={()=>{setActiveResep(r);setView("detail");}}/>
              ))}
            </>
          )}
          <div style={{height:100}}/>
        </div>
      )}
      {view==="detail"&&activeResep&&(
        <div style={{padding:"0 16px"}}>
          <button className="back-btn" onClick={()=>setView("hasil")}>← Kembali</button>
          <ResepDetail resep={activeResep} saved={savedRecipes.some(s=>s.nama===activeResep.nama)} onSave={()=>onSave(activeResep)} onAddJadwal={()=>setAddingToJadwal(true)}/>
          <div style={{height:100}}/>
        </div>
      )}
      {addingToJadwal&&(
        <div className="modal-overlay" onClick={()=>setAddingToJadwal(false)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:16,color:"#2D1B0E"}}>📅 Tambah ke Jadwal</div>
            {addedMsg?(
              <div style={{textAlign:"center",padding:20,color:"#52B788",fontWeight:700,fontSize:15}}>{addedMsg}</div>
            ):(
              HARI.map(h=>(
                <div key={h} style={{marginBottom:12}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#888",marginBottom:6}}>{h}</div>
                  <div style={{display:"flex",gap:8}}>
                    {WAKTU_MAKAN.map(w=><button key={w} className="jadwal-mini-btn" onClick={()=>handleAddJadwal(h,w)}>{w}</button>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResepCard({resep,saved,onSave,onClick}){
  return(
    <div className="resep-card" onClick={onClick}>
      <div className="rc-left"><div className="rc-emoji" style={{background:`${resep.warna}22`}}>{resep.emoji}</div></div>
      <div className="rc-body">
        <div className="rc-name">{resep.nama}</div>
        <div className="rc-meta">{resep.waktu} • {resep.tekstur}</div>
        <div className="rc-nutrisi">{resep.nutrisi}</div>
      </div>
      <button className="save-btn" onClick={e=>{e.stopPropagation();onSave();}} style={{color:saved?"#FF8C69":"#DDD"}}>{saved?"♥":"♡"}</button>
      <div className="rc-bar" style={{background:resep.warna}}/>
    </div>
  );
}

function ResepDetail({resep,saved,onSave,onAddJadwal}){
  return(
    <div>
      <div className="detail-hero" style={{background:`linear-gradient(135deg,${resep.warna}33,${resep.warna}11)`}}>
        <div style={{fontSize:64}}>{resep.emoji}</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#2D1B0E",marginTop:12,textAlign:"center",lineHeight:1.3}}>{resep.nama}</h2>
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap",justifyContent:"center"}}>
          <span className="detail-pill">⏱ {resep.waktu}</span>
          <span className="detail-pill">📊 {resep.tekstur}</span>
        </div>
        <div style={{marginTop:12,fontWeight:600,fontSize:14,color:"#666"}}>{resep.nutrisi}</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        <button className="btn-primary" style={{flex:1,padding:"12px"}} onClick={onAddJadwal}>📅 Jadwal</button>
        <button className="btn-outline" style={{flex:1,padding:"12px"}} onClick={onSave}>{saved?"♥ Tersimpan":"♡ Simpan"}</button>
      </div>
      <div className="detail-section">
        <div className="detail-section-title">🛒 Bahan-bahan</div>
        {resep.bahan?.map((b,i)=><div key={i} className="bahan-row"><span style={{color:resep.warna,fontWeight:800}}>•</span> {b}</div>)}
      </div>
      <div className="detail-section">
        <div className="detail-section-title">👩‍🍳 Cara Membuat</div>
        {resep.langkah?.map((l,i)=>(
          <div key={i} className="step-row">
            <div className="step-circle" style={{background:resep.warna}}>{i+1}</div>
            <div style={{flex:1,fontSize:14,color:"#444",lineHeight:1.7}}>{l}</div>
          </div>
        ))}
      </div>
      {resep.tips&&(
        <div className="tips-box" style={{borderColor:resep.warna}}>
          <div style={{fontWeight:800,fontSize:13,color:resep.warna,marginBottom:6}}>💡 Tips Spesial</div>
          <div style={{fontSize:14,color:"#555",lineHeight:1.6}}>{resep.tips}</div>
        </div>
      )}
    </div>
  );
}

// ── JADWAL ────────────────────────────────────────────────────────────────────
function Jadwal({jadwal,onAdd,savedRecipes}){
  const [selHari,setSelHari]=useState(HARI[0]);
  const [picking,setPicking]=useState(null);
  const [inputNama,setInputNama]=useState("");
  const handlePick=(hari,waktu,nama)=>{onAdd(hari,waktu,nama);setPicking(null);setInputNama("");};
  return(
    <div className="page">
      <div className="page-header"><h2 className="page-title">📅 Jadwal Mingguan</h2></div>
      <div style={{padding:"0 16px"}}>
        <div className="day-tabs">
          {HARI.map(h=><button key={h} className={`day-tab ${selHari===h?"active":""}`} onClick={()=>setSelHari(h)}>{h.slice(0,3)}</button>)}
        </div>
        {WAKTU_MAKAN.map(w=>{
          const key=`${selHari}-${w}`;const menu=jadwal[key];
          return(
            <div key={w} className="jadwal-slot">
              <div className="slot-time">{w}</div>
              {menu?(
                <div className="slot-filled"><span>{menu}</span><button className="btn-x" onClick={()=>onAdd(selHari,w,"")}>×</button></div>
              ):picking===key?(
                <div>
                  {savedRecipes.length>0&&(
                    <div style={{marginBottom:8}}>
                      <div style={{fontSize:12,color:"#999",marginBottom:6}}>Dari tersimpan:</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {savedRecipes.map(r=><button key={r.nama} className="chip active" style={{fontSize:12}} onClick={()=>handlePick(selHari,w,r.nama)}>{r.emoji} {r.nama}</button>)}
                      </div>
                    </div>
                  )}
                  <div className="custom-row">
                    <input className="custom-inp" placeholder="Atau ketik nama menu..." value={inputNama} onChange={e=>setInputNama(e.target.value)} onKeyDown={e=>e.key==="Enter"&&inputNama.trim()&&handlePick(selHari,w,inputNama.trim())}/>
                    <button className="btn-sm" onClick={()=>inputNama.trim()&&handlePick(selHari,w,inputNama.trim())}>✓</button>
                  </div>
                  <button className="btn-text" style={{marginTop:6}} onClick={()=>setPicking(null)}>Batal</button>
                </div>
              ):(
                <button className="slot-empty" onClick={()=>setPicking(key)}>+ Tambah menu</button>
              )}
            </div>
          );
        })}
        <div style={{marginTop:24}}>
          <div className="section-title">📊 Ringkasan Minggu Ini</div>
          <div className="summary-grid">
            {HARI.map(h=>{const count=WAKTU_MAKAN.filter(w=>jadwal[`${h}-${w}`]).length;return(
              <div key={h} className={`summary-dot ${count===3?"full":count>0?"partial":""}`}>
                <div style={{fontSize:11,fontWeight:700}}>{h.slice(0,3)}</div>
                <div style={{fontSize:10,color:count===3?"#52B788":count>0?"#FF8C69":"#CCC"}}>{count}/3</div>
              </div>
            );})}
          </div>
        </div>
        <div style={{height:100}}/>
      </div>
    </div>
  );
}

// ── TERSIMPAN ─────────────────────────────────────────────────────────────────
function Tersimpan({savedRecipes,onSave}){
  const [active,setActive]=useState(null);
  return(
    <div className="page">
      <div className="page-header"><h2 className="page-title">💾 Resep Tersimpan</h2></div>
      <div style={{padding:"0 16px"}}>
        {savedRecipes.length===0?(
          <div className="empty-state">
            <div style={{fontSize:60}}>🗂️</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#2D1B0E",marginTop:12}}>Belum ada resep</div>
            <div style={{fontSize:14,color:"#999",marginTop:6}}>Simpan resep dari Generator yuk!</div>
          </div>
        ):active?(
          <>
            <button className="back-btn" onClick={()=>setActive(null)}>← Kembali</button>
            <ResepDetail resep={active} saved={true} onSave={()=>{onSave(active);setActive(null);}} onAddJadwal={()=>{}}/>
          </>
        ):(
          savedRecipes.map((r,i)=><ResepCard key={i} resep={r} saved={true} onSave={()=>onSave(r)} onClick={()=>setActive(r)}/>)
        )}
        <div style={{height:100}}/>
      </div>
    </div>
  );
}

// ── PANDUAN ───────────────────────────────────────────────────────────────────
function Panduan({babyAge}){
  const [openIdx,setOpenIdx]=useState(null);
  const FAQ=[
    {q:"Kapan waktu terbaik memberi MPASI?",a:"Pagi hari sekitar jam 08.00–10.00 saat bayi segar dan lapar. Hindari saat bayi terlalu lapar atau mengantuk."},
    {q:"Bagaimana kalau bayi menolak makan?",a:"Normal! Coba lagi di sesi berbeda. Butuh 10–15 kali percobaan sebelum bayi menerima rasa baru. Jangan paksa, tetap positif."},
    {q:"Apakah boleh tambah bumbu?",a:"Boleh menggunakan bawang merah, bawang putih, jahe, kunyit dalam jumlah kecil. HINDARI garam, gula, kecap, dan penyedap untuk bayi <1 tahun."},
    {q:"Bagaimana cara menyimpan puree?",a:"Simpan dalam wadah kedap udara. Kulkas: tahan 1–2 hari. Freezer: tahan 1–3 bulan. Cetak di cetakan es batu untuk porsi sekali makan."},
    {q:"Apa tanda bayi siap MPASI?",a:"Usia minimal 6 bulan, bisa duduk tegak dengan bantuan, hilang tongue-thrust reflex, dan menunjukkan ketertarikan pada makanan."},
    {q:"Berapa kali sehari memberi MPASI?",a:`Usia ${babyAge} bulan: ${parseInt(babyAge)<=6?"2–3x sehari, mulai 1–2 sendok teh":parseInt(babyAge)<=8?"2–3x sehari, porsi 2–3 sendok makan":"3x sehari + 1–2x snack"}.`},
  ];
  return(
    <div className="page">
      <div className="page-header"><h2 className="page-title">📚 Panduan MPASI</h2></div>
      <div style={{padding:"0 16px"}}>
        <div className="section-title" style={{marginBottom:12}}>📈 Tahapan Tekstur</div>
        {MILESTONE.map((m,i)=>(
          <div key={i} className={`milestone-row ${(m.usia===`${babyAge} Bulan`||(parseInt(babyAge)>=10&&m.usia.includes("10")))?"current":""}`}>
            <div style={{fontSize:28,marginRight:12}}>{m.icon}</div>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:"#2D1B0E"}}>{m.usia}</div>
              <div style={{fontSize:12,color:"#777",marginTop:2}}>{m.tekstur} • {m.porsi} • {m.frekuensi}</div>
            </div>
          </div>
        ))}
        <div className="section-title" style={{marginTop:24,marginBottom:12}}>🟢🔴 Boleh vs Tidak Boleh</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          <div className="allowed-card">
            <div style={{fontWeight:800,fontSize:13,color:"#52B788",marginBottom:8}}>✅ Boleh</div>
            {["Semua sayuran segar","Buah-buahan","Daging, ikan, telur","Tahu & tempe","Minyak zaitun","Santan & butter","Bumbu alami (bawang, jahe)"].map(i=>(
              <div key={i} style={{fontSize:12,color:"#555",padding:"3px 0",borderBottom:"1px solid #F0FFF4"}}>• {i}</div>
            ))}
          </div>
          <div className="forbidden-card">
            <div style={{fontWeight:800,fontSize:13,color:"#E07A5F",marginBottom:8}}>❌ Dilarang</div>
            {["Garam & kecap","Gula & pemanis","Madu","Susu sapi (minum)","Makanan olahan","Kafein & teh","Makanan tinggi merkuri"].map(i=>(
              <div key={i} style={{fontSize:12,color:"#555",padding:"3px 0",borderBottom:"1px solid #FFF4F0"}}>• {i}</div>
            ))}
          </div>
        </div>
        <div className="section-title" style={{marginBottom:12}}>❓ Pertanyaan Umum</div>
        {FAQ.map((f,i)=>(
          <div key={i} className="faq-item" onClick={()=>setOpenIdx(openIdx===i?null:i)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
              <div style={{fontWeight:700,fontSize:14,color:"#2D1B0E",flex:1}}>{f.q}</div>
              <span style={{color:"#FF8C69",fontSize:18,flexShrink:0}}>{openIdx===i?"−":"+"}</span>
            </div>
            {openIdx===i&&<div style={{fontSize:13,color:"#666",lineHeight:1.7,marginTop:10,paddingTop:10,borderTop:"1px solid #FFE8D6"}}>{f.a}</div>}
          </div>
        ))}
        <div style={{height:100}}/>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({tab,setTab,savedCount}){
  const items=[
    {id:"beranda",icon:"🏠",label:"Beranda"},
    {id:"generator",icon:"🔍",label:"Generator"},
    {id:"jadwal",icon:"📅",label:"Jadwal"},
    {id:"tersimpan",icon:"💾",label:"Tersimpan",badge:savedCount},
    {id:"panduan",icon:"📚",label:"Panduan"},
  ];
  return(
    <nav className="bottom-nav">
      {items.map(it=>(
        <button key={it.id} className={`nav-item ${tab===it.id?"active":""}`} onClick={()=>setTab(it.id)}>
          <span style={{fontSize:20,position:"relative"}}>
            {it.icon}
            {it.badge>0&&<span className="nav-badge">{it.badge}</span>}
          </span>
          <span className="nav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
.onboard-overlay{position:fixed;inset:0;background:linear-gradient(160deg,#FF8C69 0%,#FF6B35 100%);z-index:999;display:flex;align-items:center;justify-content:center;padding:24px;}
.onboard-card{background:white;border-radius:28px;padding:32px 28px;width:100%;max-width:420px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 80px rgba(0,0,0,0.2);}
.onboard-dots{display:flex;gap:8px;justify-content:center;margin-bottom:28px;}
.dot{width:8px;height:8px;border-radius:50%;background:#EEE;transition:all 0.3s;}
.dot.active{width:24px;border-radius:4px;background:#FF8C69;}
.dot.done{background:#FF8C6966;}
.ob-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#2D1B0E;margin-bottom:8px;}
.ob-sub{font-size:14px;color:#888;line-height:1.6;margin-bottom:20px;}
.ob-input{width:100%;border:2px solid #FFD6C0;border-radius:14px;padding:14px 18px;font-size:16px;font-family:'Nunito',sans-serif;outline:none;color:#2D1B0E;background:#FFFAF8;}
.ob-input:focus{border-color:#FF8C69;}
.age-btn{padding:12px;border:2px solid #FFD6C0;border-radius:12px;background:#FFFAF8;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer;color:#888;transition:all 0.2s;}
.age-btn.active{border-color:#FF8C69;background:linear-gradient(135deg,#FF8C69,#FF6B35);color:white;}
.alergi-row{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:12px;margin-bottom:8px;border:2px solid #FFD6C0;background:#FFFAF8;cursor:pointer;font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;color:#555;transition:all 0.2s;}
.alergi-row.active{border-color:#FF8C69;background:#FFF0E8;color:#FF6B35;}
.btn-primary{width:100%;background:linear-gradient(135deg,#FF8C69,#FF6B35);color:white;border:none;border-radius:14px;padding:16px;font-family:'Nunito',sans-serif;font-size:16px;font-weight:800;cursor:pointer;transition:all 0.2s;box-shadow:0 6px 20px rgba(255,107,53,0.35);}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(255,107,53,0.45);}
.btn-primary:disabled{opacity:0.4;cursor:not-allowed;transform:none;}
.btn-primary.big{font-size:17px;padding:18px;}
.btn-outline{background:white;border:2px solid #FF8C69;border-radius:14px;color:#FF8C69;font-family:'Nunito',sans-serif;font-size:14px;font-weight:800;cursor:pointer;transition:all 0.2s;}
.btn-outline:hover{background:#FFF0E8;}
.btn-text{background:none;border:none;color:#FF8C69;font-family:'Nunito',sans-serif;font-size:14px;font-weight:700;cursor:pointer;}
.btn-sm{background:linear-gradient(135deg,#FF8C69,#FF6B35);color:white;border:none;border-radius:10px;padding:10px 16px;font-family:'Nunito',sans-serif;font-weight:800;font-size:16px;cursor:pointer;flex-shrink:0;}
.back-btn{display:inline-flex;align-items:center;gap:6px;background:none;border:2px solid #FFD6C0;border-radius:10px;padding:8px 16px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;color:#FF8C69;cursor:pointer;margin-bottom:16px;transition:all 0.2s;}
.back-btn:hover{background:#FFF0E8;}
.page{min-height:100vh;background:#FFF8F3;}
.page-header{padding:20px 16px 12px;display:flex;align-items:center;justify-content:space-between;}
.page-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#2D1B0E;}
.section-title{font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;color:#FF8C69;text-transform:uppercase;letter-spacing:1.5px;}
.hero-wrap{position:relative;padding:40px 20px 70px;overflow:hidden;background:linear-gradient(135deg,#FF8C69 0%,#FF6B35 60%,#E05A25 100%);}
.hero-bg{position:absolute;inset:0;background:radial-gradient(circle at 80% 50%,rgba(255,255,255,0.12) 0%,transparent 60%);}
.hero-content{position:relative;}
.hero-title{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:white;line-height:1.2;margin-top:6px;}
.hero-name{color:#FFE0CC;}
.hero-badge{display:inline-block;margin-top:14px;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.35);color:white;font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px;}
.hero-blob{position:absolute;right:-10px;top:20px;font-size:90px;opacity:0.3;transform:rotate(-15deg);}
.milestone-card{background:white;border-radius:18px;padding:16px 20px;display:flex;align-items:center;gap:14px;box-shadow:0 4px 20px rgba(255,107,53,0.12);border:1px solid #FFE8D6;}
.quick-card{background:white;border-radius:18px;padding:18px;text-align:left;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.06);border-top:4px solid var(--c);transition:all 0.2s;}
.quick-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1);}
.tips-carousel{background:white;border-radius:18px;padding:20px;display:flex;align-items:flex-start;box-shadow:0 4px 16px rgba(0,0,0,0.06);position:relative;min-height:90px;border:1px solid #FFE8D6;}
.kat-label{font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#888;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;}
.chip-wrap{display:flex;flex-wrap:wrap;gap:8px;}
.chip{font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;padding:7px 14px;border-radius:50px;border:2px solid #FFD6C0;background:#FFFAF8;color:#888;cursor:pointer;transition:all 0.2s;}
.chip:hover{border-color:#FF8C69;color:#FF6B35;}
.chip.active{background:linear-gradient(135deg,#FF8C69,#FF6B35);color:white;border-color:transparent;box-shadow:0 3px 10px rgba(255,107,53,0.35);}
.custom-row{display:flex;gap:10px;margin-top:12px;}
.custom-inp{flex:1;border:2px solid #FFD6C0;border-radius:12px;padding:11px 16px;font-family:'Nunito',sans-serif;font-size:14px;outline:none;color:#2D1B0E;background:#FFFAF8;}
.custom-inp:focus{border-color:#FF8C69;}
.selected-wrap{background:#FFF0E8;border-radius:16px;padding:16px;margin-top:16px;border:2px dashed #FFB89A;}
.resep-card{background:white;border-radius:18px;margin-bottom:14px;overflow:hidden;display:flex;align-items:stretch;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.07);transition:all 0.2s;position:relative;}
.resep-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.12);}
.rc-left{padding:16px 0 16px 16px;display:flex;align-items:center;}
.rc-emoji{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;}
.rc-body{flex:1;padding:16px 12px;}
.rc-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#2D1B0E;line-height:1.3;}
.rc-meta{font-size:12px;color:#AAA;margin-top:4px;font-family:'Nunito',sans-serif;font-weight:600;}
.rc-nutrisi{font-size:12px;color:#888;margin-top:4px;font-family:'Nunito',sans-serif;}
.rc-bar{width:4px;flex-shrink:0;}
.save-btn{background:none;border:none;font-size:22px;cursor:pointer;padding:16px 14px;transition:transform 0.2s;}
.save-btn:hover{transform:scale(1.3);}
.detail-hero{border-radius:20px;padding:24px;text-align:center;margin-bottom:20px;}
.detail-pill{background:white;border-radius:50px;padding:5px 14px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:700;color:#888;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
.detail-section{margin-bottom:20px;}
.detail-section-title{font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#FF8C69;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px;}
.bahan-row{font-family:'Nunito',sans-serif;font-size:14px;color:#444;padding:8px 0;border-bottom:1px solid #FFF0E8;display:flex;align-items:flex-start;gap:10px;line-height:1.5;}
.step-row{display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;}
.step-circle{width:26px;height:26px;border-radius:50%;color:white;font-family:'Nunito',sans-serif;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.tips-box{background:#FFFAF8;border-left:4px solid #FF8C69;border-radius:0 12px 12px 0;padding:14px 16px;margin-top:4px;}
.day-tabs{display:flex;gap:6px;overflow-x:auto;padding:0 0 12px;scrollbar-width:none;margin-bottom:16px;}
.day-tabs::-webkit-scrollbar{display:none;}
.day-tab{flex-shrink:0;padding:8px 14px;border-radius:50px;border:2px solid #FFD6C0;background:#FFFAF8;font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;color:#888;cursor:pointer;transition:all 0.2s;}
.day-tab.active{background:linear-gradient(135deg,#FF8C69,#FF6B35);color:white;border-color:transparent;}
.jadwal-slot{background:white;border-radius:16px;padding:16px;margin-bottom:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.slot-time{font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;color:#FF8C69;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
.slot-filled{display:flex;justify-content:space-between;align-items:center;background:#FFF0E8;border-radius:10px;padding:10px 14px;font-family:'Nunito',sans-serif;font-size:14px;font-weight:600;color:#2D1B0E;}
.slot-empty{background:none;border:2px dashed #FFD6C0;border-radius:10px;padding:10px 14px;width:100%;font-family:'Nunito',sans-serif;font-size:13px;font-weight:600;color:#CCC;cursor:pointer;text-align:left;transition:all 0.2s;}
.slot-empty:hover{border-color:#FF8C69;color:#FF8C69;}
.btn-x{background:none;border:none;color:#CC8866;font-size:18px;cursor:pointer;font-weight:700;padding:0 4px;}
.summary-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:8px;}
.summary-dot{background:white;border-radius:10px;padding:8px 4px;text-align:center;font-family:'Nunito',sans-serif;border:2px solid #FFE8D6;}
.summary-dot.full{border-color:#52B788;background:#F0FFF8;}
.summary-dot.partial{border-color:#FF8C69;background:#FFF5F0;}
.jadwal-mini-btn{flex:1;border:2px solid #FFD6C0;border-radius:10px;padding:7px 6px;font-family:'Nunito',sans-serif;font-size:11px;font-weight:700;color:#888;background:#FFFAF8;cursor:pointer;transition:all 0.2s;text-align:center;}
.jadwal-mini-btn:hover{border-color:#FF8C69;color:#FF6B35;background:#FFF0E8;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal-card{background:white;width:100%;max-width:480px;border-radius:24px 24px 0 0;padding:28px 20px 48px;max-height:80vh;overflow-y:auto;}
.milestone-row{display:flex;align-items:center;background:white;border-radius:14px;padding:14px 16px;margin-bottom:10px;box-shadow:0 2px 10px rgba(0,0,0,0.05);border:2px solid transparent;}
.milestone-row.current{border-color:#FF8C69;background:#FFF8F5;}
.allowed-card,.forbidden-card{background:white;border-radius:14px;padding:14px;box-shadow:0 2px 10px rgba(0,0,0,0.05);}
.faq-item{background:white;border-radius:14px;padding:16px;margin-bottom:10px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,0.05);border:2px solid transparent;transition:border-color 0.2s;}
.faq-item:hover{border-color:#FFD6C0;}
.loading-state{text-align:center;padding:60px 20px;}
.loading-spinner{width:48px;height:48px;border:4px solid #FFE0D0;border-top-color:#FF8C69;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto;}
@keyframes spin{to{transform:rotate(360deg);}}
.error-state{text-align:center;padding:40px 20px;}
.empty-state{text-align:center;padding:60px 20px;}
.bottom-nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:white;border-top:1px solid #FFE8D6;display:flex;box-shadow:0 -4px 20px rgba(255,107,53,0.1);z-index:100;}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 4px 12px;background:none;border:none;cursor:pointer;transition:all 0.2s;position:relative;}
.nav-label{font-family:'Nunito',sans-serif;font-size:10px;font-weight:800;color:#CCC;margin-top:2px;transition:color 0.2s;}
.nav-item.active .nav-label{color:#FF8C69;}
.nav-badge{position:absolute;top:-2px;right:calc(50% - 18px);background:#FF6B35;color:white;font-size:9px;font-weight:800;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 4px;}
`;
