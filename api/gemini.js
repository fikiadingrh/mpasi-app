
export async function POST(req) {
  try {
    const { ageMonths, dietaryRestrictions } = await req.json();
    
    // Ambil API key dari environment variable (server-side)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel',
          message: 'Hubungi admin untuk setup API key'
        }),
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Buatkan resep MPASI untuk bayi usia ${ageMonths} bulan. ${dietaryRestrictions ? 'Pertimbangkan: ' + dietaryRestrictions : ''}. 

Berikan output dalam format JSON murni tanpa markdown, tanpa triple backticks, hanya JSON valid dengan struktur:
{
  "nama_resep": "...",
  "umur_rekomendasi": "...",
  "bahan": ["...", "...", "..."],
  "cara_membuat": ["...", "...", "..."],
  "nilai_gizi": "...",
  "tips": "..."
}

JANGAN tambahkan teks lain selain JSON.`
            }]
          }]
        })
      }
    );

    const data = await response.json();
    
    // Cek jika ada error dari Gemini
    if (data.error) {
      return new Response(
        JSON.stringify({ error: data.error.message || 'Terjadi kesalahan dari Gemini API' }),
        { status: data.error.code || 500 }
      );
    }

    // Extract text dari response Gemini
    const recipeText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!recipeText) {
      return new Response(
        JSON.stringify({ error: 'Response tidak valid dari Gemini' }),
        { status: 500 }
      );
    }

    // Parse JSON dari text (Gemini kadang return markdown)
    let parsedRecipe;
    try {
      // Hapus markdown ```json dan ``` jika ada
      const cleanJSON = recipeText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      parsedRecipe = JSON.parse(cleanJSON);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          error: 'Gagal parse respon AI',
          raw_response: recipeText.substring(0, 200) + '...'
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: parsedRecipe }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500 }
    );
  }
}

// Handle GET (opsional, untuk health check)
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
