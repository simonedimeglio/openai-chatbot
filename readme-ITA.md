# AI-Chatbot

Spiegazione dettagliata per ciascun passaggio del codice:

## 1 - Importazione delle librerie

Vengono importate due librerie:

- **openai** per interagire con l’API di OpenAI
- **dotenv** per caricare le variabili di ambiente da un file `.env`, dove salveremo informazioni sensibili come l’API key.

```ts
import OpenAI from "openai";
import * as dotenv from "dotenv";
```

## 2 - `dotenv.config()`

Questo comando carica le variabili definite nel file `.env` nel sistema di ambiente. Ad esempio, il file `.env` conterrà la chiave API (_OPENAI_API_KEY_), che verrà utilizzata successivamente nel codice.

```ts
// Carichiamo le variabili di ambiente da un file .env
// Questo permette di mantenere dati sensibili, come le API key, al di fuori del codice sorgente
dotenv.config();
```

## 3 - Inizializzazione di OpenAI

Creiamo un’istanza dell’oggetto OpenAI, passando la chiave API come parametro. `process.env.OPENAI_API_KEY` ottiene la chiave dal file `.env`. Questo permette al nostro codice di autenticarsi e interagire con i server di OpenAI.

```ts
// Inizializziamo l'istanza OpenAI con la chiave API
// La chiave API è memorizzata nella variabile di ambiente OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Assicurati di impostare questa nel tuo file .env
});
```

## 4 - Funzione `getChatbotResponse`

Questa funzione è asincrona perché deve fare una richiesta esterna all’API di OpenAI, che può richiedere del tempo per rispondere. Se qualcosa va storto durante la chiamata API (_come un errore di rete o un problema con l’API stessa_), catturiamo l’errore con un `try/catch`, lo mostriamo con `console.error`.

**`openai.chat.completions.create`**: Questa è la chiamata all’API di OpenAI. Gli passiamo il modello che vogliamo usare (_in questo caso "gpt-4o-mini-2024-07-18"_) e un array di messaggi. I messaggi includono:

- Un messaggio di tipo system che imposta il contesto. In questo caso, diciamo al modello che è un “_assistente utile_”.
- Un messaggio di tipo user che rappresenta l’input dell’utente, cioè la domanda o la richiesta che l’utente fa al chatbot.

**`completion.choices[0].message.content`**: L’API di OpenAI restituisce un oggetto chiamato **completion**, che contiene un array chiamato **choices**. Ogni scelta rappresenta una possibile risposta generata dal modello. Prendiamo la prima risposta (`choices[0]`) e restituiamo il suo contenuto (`message.content`), che è la risposta del chatbot.

```ts
// Funzione per ottenere una risposta dal chatbot
async function getChatbotResponse(userInput: string) {
  try {
    // Chiamata all'API di OpenAI per generare una risposta
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // Il modello specifico che vuoi usare
      messages: [
        // Il messaggio "system" definisce il comportamento dell'assistente
        { role: "system", content: "You are a helpful assistant." },

        // Il messaggio "user" è l'input fornito dall'utente
        { role: "user", content: userInput },
      ],
    });

    // Estraiamo e restituiamo la risposta generata dal chatbot
    // L'array 'choices' contiene le possibili risposte, selezioniamo la prima
    return completion.choices[0].message.content;
  } catch (error) {
    // Se c'è un errore, lo logghiamo e lo rilanciamo
    console.error("Errore durante la chiamata a OpenAI:", error);
    throw error;
  }
}
```

## 5 - Utilizzo

Qui stiamo usando una **IIFE** (_Immediately Invoked Function Expression_), che ci permette di usare la sintassi `async/await` direttamente.

- **`userInput`**: Definiamo una variabile con l’input dell’utente, in questo caso una richiesta di scrivere un haiku sulla ricorsione nella programmazione.
- **`getChatbotResponse`**: Chiamiamo la funzione che abbiamo creato per ottenere la risposta dal chatbot, passandole l’input dell’utente.
- **`console.log`**: Una volta ottenuta la risposta, la stampiamo nella console con console.log per vederla
