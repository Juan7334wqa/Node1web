import express from 'express';
import cors from "cors";


 
type LD = {
id: number
filmName: string
rotationType: "CAV" | "CLV",
region: string,
lengthMinutes: number,
videoFormat: "NTSC" | "PAL"
}

let LDs:LD[]=[
   { id: 1, filmName: "Lakers", rotationType: "CAV", region: "",lengthMinutes: 12, videoFormat:"NTSC"},

 { id: 2, filmName: "Celtics", rotationType: "CLV", region: "",lengthMinutes: 24, videoFormat:"PAL" },

]


const validateLD = (data: any): string | null => {
  if (!data) return "No se ha proporcionado ningún cuerpo de solicitud.";

  const { filmName,rotationType, region,lengthMinutes,videoFormat } = data;

  if (typeof filmName !== "string" || filmName.trim().length < 2)
    return "El nombre debe ser una cadena con al menos 2 caracteres.";
  if (typeof rotationType !== "string" || rotationType !== "CLV" && rotationType !== "CAV")
      return "El rotation debe ser CLV o CAV.";
  if (typeof region !== "string" || filmName.trim().length < 2)// Nose que hay que cumplir
    return "El region debe ser una cadena con al menos 2 caracteres.";
  if (typeof lengthMinutes !== "number")
    return "El nombre debe ser numero.";
  if (typeof videoFormat !== "string" || videoFormat !== "NTSC" && videoFormat !== "PAL")
      return "El video debe ser NTSC o PAL.";


  {
    return "La dirección debe incluir filmName(string),rotationType,(CLV o CAV) region(string),lengthMinutes(numero),videoFormat(NTSC o PAL).";
  }

  return null;
};



const app = express();

const port = 3000;





app.use(cors()); // se usa cuando no estas usadon el sever o 2 maquinas
app.use(express.json()); // le estas diciendo que estas aciendo en Api no en paginas web o otras cosas


app.get("/Id",(req, res)=>{
  res.json(LDs);

});
app.get("/Id/:id",(req, res)=>{// id = string
  const id = Number(req.params.id);// para sacar id que ha introducido
const eqpenc = LDs.find((elem)=>{
  if(elem.id===id){
    res.status(201).json({message:"LD encontrado"})
    res.json(elem);
  }
  else{
    res.status(404).json({message:"LD no existe"})
  }
})

});

app.post("/Id", (req, res) => {
  try {
    const error = validateLD(req.body);
    if (error) return res.status(400).json({ error });

    const newUser: LD = {
      id: Date.now().toString(),
      ...req.body,
    };

    LDs.push(newUser);
    res.status(201).json(newUser);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error al crear la persona", detail: err.message });
  }
});



app.delete("/person/:id", (req, res) => {
  try {
    const  id  = Number(req.params);
    const exists = LDs.some((p) => p.id === id);

    if (!exists)
      return res.status(404).json({ error: "LD no encontrada" });

    LDs = LDs.filter((p) => p.id !== id);

    res.json({ message: "LD eliminada correctamente" });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error al eliminar LD", detail: err.message });
  }
});


app.listen(port,()=>{
  console.log("Sever started at:"+port )
})


