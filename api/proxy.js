import fetch from "node-fetch";

export default async function handler(req, res){
    try {
        const { endpoint, method='GET', body, domain, key } = req.body;
        if(!domain || !key) return res.status(400).json({error:"Missing domain or API key"});
        const url = `${domain}/api/client${endpoint}`;
        const r = await fetch(url, {
            method,
            headers:{
                "Authorization": `Bearer ${key}`,
                "Content-Type": method==='POST'?'application/json':'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const ct = r.headers.get("content-type");
        if(ct && ct.includes("application/json")) return res.status(200).json(await r.json());
        else return res.status(200).send(await r.text());
    } catch(e){ res.status(500).json({error:e.message}); }
}
