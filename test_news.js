async function testNews() {
    console.log("Testing Global Pulse News API...");
    try {
        const res = await fetch("https://globalpulse.social/api/news");
        if (!res.ok) {
            console.error(`❌ Backend returned error: ${res.status}`);
            const text = await res.text();
            console.error(`Error details: ${text}`);
            return;
        }
        
        const data = await res.json();
        console.log(`✅ API Response Status: ${data.status}`);
        console.log(`✅ Total Results: ${data.totalResults || 'N/A'}`);
        
        if (data.articles && data.articles.length > 0) {
            console.log(`✅ Fetched ${data.articles.length} articles!`);
            console.log(`📰 First article title: ${data.articles[0].title}`);
        } else {
            console.log("⚠️ API returned ok, but no articles were found.");
            console.log(JSON.stringify(data, null, 2).slice(0, 300) + '...');
        }
        
    } catch (e) {
        console.error("❌ Network or Parsing error:", e.message);
    }
}

testNews();
