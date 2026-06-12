const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8"
        }
    });
}

export default async function handler(request) {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: corsHeaders
        });
    }

    if (request.method !== "POST") {
        return jsonResponse(
            { error: "Sadece POST isteği desteklenmektedir." },
            405
        );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return jsonResponse(
            { error: "Groq API anahtarı Netlify üzerinde tanımlanmamış." },
            500
        );
    }

    try {
        const requestBody = await request.json();

        if (!Array.isArray(requestBody.messages)) {
            return jsonResponse(
                { error: "messages alanı bulunamadı veya geçersiz." },
                400
            );
        }

        const groqBody = {
            ...requestBody,

            // İstemciden farklı bir model gönderilse bile bu model kullanılır.
            model: "llama-3.1-8b-instant",

            // Aşırı token kullanımını engeller.
            max_tokens: Math.min(
                Number(requestBody.max_tokens) || 512,
                800
            )
        };

        const groqResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(groqBody)
            }
        );

        const responseText = await groqResponse.text();

        return new Response(responseText, {
            status: groqResponse.status,
            headers: {
                ...corsHeaders,
                "Content-Type":
                    groqResponse.headers.get("Content-Type") ||
                    "application/json; charset=utf-8"
            }
        });
    } catch (error) {
        return jsonResponse(
            {
                error: "İstek işlenirken hata oluştu.",
                detail: error.message
            },
            500
        );
    }
}