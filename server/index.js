import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import open from "open";

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from "mercadopago";

// rutas ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// credenciales MercadoPago
const client = new MercadoPagoConfig({
    accessToken: "TEST-7725781667080467-012118-b65dfd61887cca6c19720ceca5cd8fb2-647396"
});

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// servir la web
app.use(express.static(path.join(__dirname, "../client")));

// servir imágenes
app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,"../client/index.html"));
});

// endpoint MercadoPago
app.post("/create_preference", async (req,res)=>{
    try{

        const body = {
            items: [{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: "MXN"
            }]
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({
            id: result.id
        });

    }catch(error){
        console.log(error);
    }
});

app.listen(port, ()=>{
    console.log("Servidor corriendo en puerto", port);

    // abrir navegador automáticamente
    open("http://localhost:3000");
});