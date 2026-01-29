
import { SkillNodeData } from './types';

// Helper per creare ID puliti
const cleanId = (name: string) => name.replace(/[^a-zA-Z0-9]/g, "");

// Definizione grezza dai dati CSV forniti
const RAW_DATA = [
  // BIANCO (GENERAL)
  { b: "Ascendant Path I", c: 10, t: "PA", desc: "Ogni volta che riduci una creatura a 0 punti ferita, puoi ottenere Punti Evoluzione (PE), se la creatura ne conferisce.", br: "PE da uccisioni", cat: "GENERAL", tier: 0, icon: "ArrowUpCircle" },
  { b: "Ascendant Path II", c: 25, t: "PA", desc: "Quando ottieni PE sconfiggendo un nemico, hai un 50% di possibilità di raddoppiare la quantità di PE ottenuta.", br: "Probabilità PE doppi", cat: "GENERAL", tier: 2, icon: "TrendingUp" },
  { b: "Ascendant Path III", c: 50, t: "PA", desc: "Quando ottieni PA o PE sconfiggendo un nemico, hai un 50% di possibilità di raddoppiare la quantità di PA e PE ottenuti.", br: "Probabilità PA/PE doppi", cat: "GENERAL", tier: 3, icon: "Sparkles" },

  // ROSSO (VITAL)
  { b: "Vital Branch", c: 5, t: "PA", desc: "Il tuo massimo dei punti ferita aumenta di 4.", br: "+4 Punti Ferita", cat: "VITAL", tier: 0, icon: "Heart" },
  { b: "Vital Branch I", c: 5, t: "PE", desc: "Il tuo massimo dei punti ferita aumenta di 8 (sostituisce il bonus precedente).", br: "+8 Punti Ferita", cat: "VITAL", tier: 2, icon: "Heart" },
  { b: "Vital Branch II", c: 10, t: "PE", desc: "Il tuo massimo dei punti ferita aumenta di 13 (sostituisce il bonus precedente).", br: "+13 Punti Ferita", cat: "VITAL", tier: 3, icon: "PlusCircle" },
  { b: "Vital Branch III", c: 20, t: "PE", desc: "Il tuo massimo dei punti ferita aumenta di 18 (sostituisce il bonus precedente).", br: "+18 Punti Ferita", cat: "VITAL", tier: 4, icon: "Shield" },
  { b: "Empowered Weapon Attack", c: 20, t: "PA", desc: "Sblocca il ramo Empowered Weapon Attack.", br: "Sblocca Potenziamenti", cat: "VITAL", tier: 1, icon: "Swords" },
  { b: "Empowered Weapon Attack I", c: 10, t: "PE", desc: "Una volta per giorno, puoi aggiungere un bonus di +1 a un tiro per colpire e al relativo tiro per i danni di un attacco d'arma.", br: "1/gg: +1 Colpire/Danni", cat: "VITAL", tier: 2, icon: "Zap" },
  { b: "Empowered Weapon Attack II", c: 25, t: "PE", desc: "Due volte per giorno, puoi aggiungere un bonus di +1 a un tiro per colpire e +3 ai tiri per i danni di un attacco d'arma.", br: "2/gg: +1 Colpire/+3 Danni", cat: "VITAL", tier: 3, icon: "Zap" },
  { b: "Empowered Weapon Attack III", c: 50, t: "PE", desc: "Ottieni un bonus permanente di +1 ai tiri per colpire e +2 ai tiri per i danni effettuati con armi.", br: "+1 Colpire/+2 Danni fisso", cat: "VITAL", tier: 4, icon: "Zap" },
  { b: "Empowered Weapon Precision", c: 20, t: "PA", desc: "Sblocca il ramo Empowered Weapon Precision.", br: "Sblocca Precisione", cat: "VITAL", tier: 1, icon: "Target" },
  { b: "Empowered Weapon Precision I", c: 10, t: "PE", desc: "Una volta per giorno, puoi scegliere di effettuare un tiro per colpire con un'arma con Vantaggio.", br: "1/gg: Vantaggio Attacco", cat: "VITAL", tier: 2, icon: "Crosshair" },
  { b: "Empowered Weapon Precision II", c: 20, t: "PE", desc: "Una volta per giorno come Reazione, quando una creatura effettua un tiro per colpire contro di te, puoi imporre Svantaggio a quel tiro.", br: "1/gg: Svantaggio Nemico", cat: "VITAL", tier: 3, icon: "ShieldAlert" },
  { b: "Empowered Weapon Precision III", c: 35, t: "PE", desc: "Una volta per giorno, puoi scegliere di ripetere un tuo tiro per colpire fallito, oppure costringere un nemico a ripetere un tiro per colpire effettuato con successo contro di te.", br: "1/gg: Ritiro Attacco", cat: "VITAL", tier: 4, icon: "RefreshCw" },
  { b: "Critical Weapon Proficiency", c: 20, t: "PA", desc: "Sblocca il ramo Critical Weapon Proficiency.", br: "Sblocca Critici", cat: "VITAL", tier: 1, icon: "Skull" },
  { b: "Critical Weapon Proficiency I", c: 10, t: "PE", desc: "Quando metti a segno un colpo critico con un'arma, infliggi danni extra pari alla metà del tuo bonus di competenza (arrotondato per difetto).", br: "Danni Critici +½ Prof", cat: "VITAL", tier: 2, icon: "Grip" },
  { b: "Critical Weapon Proficiency II", c: 25, t: "PE", desc: "Quando metti a segno un colpo critico con un'arma, infliggi danni extra pari al tuo bonus di competenza.", br: "Danni Critici +Prof", cat: "VITAL", tier: 3, icon: "Grip" },
  { b: "Critical Weapon Proficiency III", c: 50, t: "PE", desc: "I tuoi attacchi con arma mettono a segno un colpo critico con un risultato di 19 o 20 al tiro del dado.", br: "Critico con 19-20", cat: "VITAL", tier: 4, icon: "Dices" },

  // BLU (MAGIC)
  { b: "Magical Branch", c: 5, t: "PA", desc: "Apprendi un trucchetto a tua scelta dalla lista della tua classe.", br: "Nuovo Trucchetto", cat: "MAGIC", tier: 0, icon: "Wand2" },
  { b: "Magical Branch I", c: 5, t: "PE", desc: "Apprendi un nuovo incantesimo dalla lista della tua classe (massimo livello 3).", br: "Spell Liv 1-3", cat: "MAGIC", tier: 2, icon: "Sparkles" },
  { b: "Magical Branch II", c: 10, t: "PE", desc: "Apprendi un nuovo incantesimo dalla lista della tua classe (massimo livello 6).", br: "Spell Liv 4-6", cat: "MAGIC", tier: 3, icon: "Sparkles" },
  { b: "Magical Branch III", c: 20, t: "PE", desc: "Apprendi un nuovo incantesimo dalla lista della tua classe (massimo livello 9).", br: "Spell Liv 7-9", cat: "MAGIC", tier: 4, icon: "Sparkles" },
  { b: "Abundant Magic", c: 20, t: "PA", desc: "Sblocca il ramo Abundant Magic.", br: "Sblocca Slot Extra", cat: "MAGIC", tier: 1, icon: "Zap" },
  { b: "Abundant Magic I", c: 10, t: "PE", desc: "Ottieni un ulteriore slot incantesimo di un livello pari a un terzo (arrotondato per difetto) del tuo livello massimo di incantesimo conosciuto.", br: "+1 Slot Liv basso", cat: "MAGIC", tier: 2, icon: "Battery" },
  { b: "Abundant Magic II", c: 25, t: "PE", desc: "Ottieni un ulteriore slot incantesimo di un livello pari alla metà (arrotondato per difetto) del tuo livello massimo di incantesimo conosciuto.", br: "+1 Slot Liv medio", cat: "MAGIC", tier: 3, icon: "BatteryFull" },
  { b: "Abundant Magic III", c: 50, t: "PE", desc: "Ottieni un ulteriore slot incantesimo del livello più alto che sei in grado di lanciare.", br: "+1 Slot Liv massimo", cat: "MAGIC", tier: 4, icon: "Zap" },
  { b: "Sniper Magic", c: 20, t: "PA", desc: "Sblocca il ramo Sniper Magic.", br: "Sblocca Mira Magica", cat: "MAGIC", tier: 1, icon: "Target" },
  { b: "Sniper Magic I", c: 10, t: "PE", desc: "Una volta per giorno, puoi effettuare un tiro per colpire con un incantesimo con Vantaggio.", br: "1/gg: Vantaggio Magico", cat: "MAGIC", tier: 2, icon: "Eye" },
  { b: "Sniper Magic II", c: 20, t: "PE", desc: "Quando infliggi danni con un incantesimo, 5 di quei danni ignorano qualsiasi tipo di resistenza o immunità del bersaglio.", br: "Ignora 5 Resistenze", cat: "MAGIC", tier: 3, icon: "Axe" },
  { b: "Sniper Magic III", c: 35, t: "PE", desc: "Una volta per giorno, puoi scegliere di ripetere un tiro per colpire fallito con un incantesimo.", br: "1/gg: Ritiro Magico", cat: "MAGIC", tier: 4, icon: "RefreshCw" },
  { b: "Strongest Magic", c: 20, t: "PA", desc: "Sblocca il ramo Strongest Magic.", br: "Sblocca Potenza Magica", cat: "MAGIC", tier: 1, icon: "Flame" },
  { b: "Strongest Magic I", c: 10, t: "PE", desc: "Una volta per giorno, puoi aumentare di 1 la CD del tiro salvezza e il bonus al colpire di un incantesimo che lanci.", br: "1/gg: +1 CD/Colpire", cat: "MAGIC", tier: 2, icon: "Activity" },
  { b: "Strongest Magic II", c: 30, t: "PE", desc: "Ottieni un bonus permanente di +1 ai tiri per colpire con i tuoi incantesimi.", br: "+1 Colpire Magico fisso", cat: "MAGIC", tier: 3, icon: "Activity" },
  { b: "Strongest Magic III", c: 50, t: "PE", desc: "La CD del tiro salvezza dei tuoi incantesimi aumenta permanentemente di 1.", br: "+1 CD Magica fissa", cat: "MAGIC", tier: 4, icon: "Activity" },

  // GIALLO (SKILL)
  { b: "Skill Branch", c: 5, t: "PA", desc: "Ottieni competenza in un'abilità a tua scelta.", br: "Nuova Competenza", cat: "SKILL", tier: 0, icon: "GraduationCap" },
  { b: "Skill Branch I", c: 5, t: "PE", desc: "Ottieni un bonus di +1 alle prove effettuate con l'abilità scelta in Skill Branch.", br: "+1 Nuova Skill", cat: "SKILL", tier: 2, icon: "Star" },
  { b: "Skill Branch II", c: 10, t: "PE", desc: "Scegli un'abilità in cui sei già competente: ottieni un bonus di +1 permanente a tutte le prove di quell'abilità.", br: "+1 Skill nota", cat: "SKILL", tier: 3, icon: "Star" },
  { b: "Skill Branch III", c: 20, t: "PE", desc: "Una volta per giorno, puoi scegliere di superare automaticamente una prova di abilità in cui sei competente senza tirare il dado.", br: "1/gg Successo Automatico", cat: "SKILL", tier: 4, icon: "CheckCircle" },
  { b: "Flexibility Skills", c: 20, t: "PA", desc: "Sblocca il ramo Flexibility Skills.", br: "Sblocca Adattabilità", cat: "SKILL", tier: 1, icon: "Dribbble" },
  { b: "Flexibility Skills I", c: 10, t: "PE", desc: "Due volte per giorno, puoi aggiungere un bonus di +3 a una prova di abilità in cui sei competente.", br: "2/gg: +3 Prove Skill", cat: "SKILL", tier: 2, icon: "Zap" },
  { b: "Flexibility Skills II", c: 20, t: "PE", desc: "Due volte per giorno, puoi aggiungere un bonus di +2 a un tiro salvezza o a una prova per resistere agli effetti di un fattore ostile.", br: "2/gg: +2 Tiri Salvezza", cat: "SKILL", tier: 3, icon: "Shield" },
  { b: "Flexibility Skills III", c: 30, t: "PE", desc: "Ottieni un bonus permanente di +1 a ogni prova di abilità in cui non sei competente.", br: "+1 Skill non note", cat: "SKILL", tier: 4, icon: "Globe" },
  { b: "Advanced Skills", c: 20, t: "PA", desc: "Sblocca il ramo Advanced Skills.", br: "Sblocca Maestria", cat: "SKILL", tier: 1, icon: "Lightbulb" },
  { b: "Advanced Skills I", c: 10, t: "PE", desc: "Una volta per giorno, puoi aggiungere metà del tuo bonus di competenza a una prova di abilità in cui non sei competente.", br: "Mezza Prof. ovunque", cat: "SKILL", tier: 2, icon: "Star" },
  { b: "Advanced Skills II", c: 20, t: "PE", desc: "Una volta per giorno, per la durata di 10 minuti, puoi aggiungere 1d4 a ogni prova di abilità che effettui.", br: "+1d4 Prove (10 min)", cat: "SKILL", tier: 3, icon: "Timer" },
  { b: "Advanced Skills III", c: 30, t: "PE", desc: "Una volta per ora, puoi scegliere di utilizzare il bonus di un'abilità competente al posto di un'altra per una singola prova.", br: "Sostituisci Skill", cat: "SKILL", tier: 4, icon: "Shuffle" },
  { b: "Magnitudo Skills", c: 20, t: "PA", desc: "Sblocca il ramo Magnitudo Skills.", br: "Sblocca Analisi", cat: "SKILL", tier: 1, icon: "Magnet" },
  { b: "Magnitudo Skills I", c: 10, t: "PE", desc: "Quando effettui una prova per determinare le debolezze di una creatura, la superi automaticamente.", br: "Scopri Debolezze", cat: "SKILL", tier: 2, icon: "Search" },
  { b: "Magnitudo Skills II", c: 25, t: "PE", desc: "Scegli un alleato: puoi utilizzare una sua abilità di classe per un numero di round pari a metà del tuo valore di competenza (arrotondato per difetto). Mentre effettui questa operazione il soggetto di cui copi l’abilità non potrà attivarla finchè è in uso da parte tua.", br: "Copia Skill Alleata", cat: "SKILL", tier: 3, icon: "Copy" },
  { b: "Magnitudo Skills III", c: 40, t: "PE", desc: "Dopo aver sconfitto un nemico, puoi apprendere e utilizzare una sua azione o abilità speciale per una volta (secondo i termini estesi).", br: "Copia Skill Nemica", cat: "SKILL", tier: 4, icon: "Skull" },

  // VERDE (UTILITY)
  { b: "Utility Branch", c: 5, t: "PA", desc: "Una volta per round, quando tiri un 1 per il danno di un attacco, puoi ripetere il dado e devi usare il nuovo risultato.", br: "Reroll 1 Danni", cat: "UTILITY", tier: 0, icon: "RotateCw" },
  { b: "Utility Branch I", c: 5, t: "PE", desc: "Una volta per round, quando tiri un risultato da 1 a 3 per il danno di un attacco, puoi ripetere il dado e devi usare il nuovo risultato.", br: "Reroll 1-3 Danni", cat: "UTILITY", tier: 2, icon: "RotateCw" },
  { b: "Utility Branch II", c: 10, t: "PE", desc: "Quando tiri per i danni, puoi ripetere fino a 3 dadi di tua scelta. Devi utilizzare i nuovi risultati.", br: "Reroll 3 Dadi Danni", cat: "UTILITY", tier: 3, icon: "RotateCw" },
  { b: "Utility Branch III", c: 20, t: "PE", desc: "Quando tiri per i danni, puoi ripetere qualsiasi numero di dadi del danno. Devi utilizzare i nuovi risultati.", br: "Reroll Danni Totali", cat: "UTILITY", tier: 4, icon: "RotateCw" },
  { b: "Advantageous Situations", c: 20, t: "PA", desc: "Sblocca il ramo Advantageous Situations.", br: "Sblocca Fortuna", cat: "UTILITY", tier: 1, icon: "Compass" },
  { b: "Advantageous Situations I", c: 10, t: "PE", desc: "Una volta per giorno, puoi ottenere Vantaggio a un d20 o d20 Test.", br: "1/gg: Vantaggio", cat: "UTILITY", tier: 2, icon: "Smile" },
  { b: "Advantageous Situations II", c: 20, t: "PE", desc: "Una volta per giorno, puoi aggiungere o sottrarre il tuo bonus di competenza al risultato di un d20 o d20 Test effettuato da te o da una creatura che puoi vedere.", br: "Modifica D20 (+/- Prof)", cat: "UTILITY", tier: 3, icon: "ShieldHalf" },
  { b: "Advantageous Situations III", c: 35, t: "PE", desc: "Una volta per giorno, se fallisci un tiro salvezza, puoi scegliere di superarlo automaticamente.", br: "Successo Salvezza Auto", cat: "UTILITY", tier: 4, icon: "ShieldCheck" },
  { b: "Advanced Action Economy", c: 20, t: "PA", desc: "Sblocca il ramo Advanced Action Economy.", br: "Sblocca Reattività", cat: "UTILITY", tier: 1, icon: "Zap" },
  { b: "Advanced Action Economy I", c: 20, t: "PE", desc: "Una volta per giorno, puoi raddoppiare la tua velocità di movimento per il turno attuale senza utilizzare l'azione di Scatto.", br: "Doppio Movimento", cat: "UTILITY", tier: 2, icon: "FastForward" },
  { b: "Advanced Action Economy II", c: 35, t: "PE", desc: "Una volta per giorno, ottieni la capacità di effettuare una seconda reazione durante lo stesso round.", br: "Seconda Reazione", cat: "UTILITY", tier: 3, icon: "Zap" },
  { b: "Advanced Action Economy III", c: 50, t: "PE", desc: "Una volta per giorno, nel tuo turno, puoi effettuare un'azione bonus aggiuntiva.", br: "Azione Bonus Extra", cat: "UTILITY", tier: 4, icon: "Zap" },
  { b: "Look Into the Future", c: 20, t: "PA", desc: "Sblocca il ramo Look into the Future.", br: "Sblocca Prescienza", cat: "UTILITY", tier: 1, icon: "Eye" },
  { b: "Look Into the Future I", c: 15, t: "PE", desc: "Quando un alleato entro 9 metri subisce danni, come Reazione, puoi decidere di subire metà di quei danni al suo posto.", br: "Proteggi Alleati", cat: "UTILITY", tier: 2, icon: "ShieldAlert" },
  { b: "Look Into the Future II", c: 25, t: "PE", desc: "Una volta per giorno, quando una creatura effettua un tiro per colpire contro un tuo alleato, puoi usare la tua reazione per imporre Svantaggio a quel tiro. Al termine dell’uso di questa capacità speciale, se non sei riuscito ad evitare che questo D20 abbia inflitto danni al tuo alleato, ne subisci la metà (arrotondati per difetto) come riverbero del Fato.", br: "Svantaggio ad Alleati", cat: "UTILITY", tier: 3, icon: "Ghost" },
  { b: "Look Into the Future III", c: 40, t: "PE", desc: "Una volta per giorno, ottieni la capacità prevedere le intenzioni ostili. Venendo a conoscenza delle azioni che una creatura effettuera nel suo prossimo turno. Quando usi questa abilita, come reazione nel turno del bersaglio dell'abilità, puoi costringere il nemico a cambiare il bersaglio del suo attacco o incantesimo.", br: "Cambia Bersaglio Nemico", cat: "UTILITY", tier: 4, icon: "Infinity" },

  // ARANCIONE (EXTRA)
  { b: "Extra Branch", c: 5, t: "PA", desc: "All'inizio di ogni alba, ottieni 1 Punto Evoluzione (PE) supplementare.", br: "+1 PE Giornaliero", cat: "EXTRA", tier: 0, icon: "PlusSquare" },
  { b: "Extra Branch I", c: 5, t: "PE", desc: "All'inizio di ogni alba, ottieni 1 Punto Ascensione (PA) supplementare.", br: "+1 PA Giornaliero", cat: "EXTRA", tier: 2, icon: "ArrowUpSquare" },
  { b: "Extra Branch II", c: 10, t: "PE", desc: "Ogni volta che ottieni Punti Ascensione o Punti Evoluzione dalle abilità Extra Branch, hai un 50% di possibilità di raddoppiare i PE e PA ottenuti.", br: "Raddoppio Rendite", cat: "EXTRA", tier: 3, icon: "Dices" },
  { b: "Extra Branch III", c: 20, t: "PE", desc: "Sblocca Hand of Avarice (Grado Bronzo): ottieni una probabilità del 10% di generare 1d4 PE o 1 PA extra quando ne ottieni sconfiggendo nemici.", br: "Avarizia: Grado Bronzo", cat: "EXTRA", tier: 4, icon: "Coins" },
  { b: "Advanced Evolution Management", c: 20, t: "PA", desc: "Sblocca il ramo Advanced Evolution Management.", br: "Sblocca Gestione", cat: "EXTRA", tier: 1, icon: "Cpu" },
  { b: "Advanced Evolution Management I", c: 20, t: "PE", desc: "Una volta per giorno, puoi ripristinare un utilizzo consumato di un oggetto magico o di un'abilità di classe.", br: "Ripristina Carica", cat: "EXTRA", tier: 2, icon: "BatteryCharging" },
  { b: "Advanced Evolution Management II", c: 35, t: "PE", desc: "All'inizio di ogni alba, ottieni permanentemente 5 Punti Evoluzione extra.", br: "+5 PE per Riposo", cat: "EXTRA", tier: 3, icon: "Zap" },
  { b: "Advanced Evolution Management III", c: 50, t: "PE", desc: "All'inizio di ogni alba, ottieni permanentemente 5 Punti Ascensione extra.", br: "+5 PA per Riposo", cat: "EXTRA", tier: 4, icon: "TrendingUp" },
  { b: "Empowered Hand of Avarice", c: 20, t: "PA", desc: "Sblocca il ramo Empowered Hand of Avarice.", br: "Sblocca Avarizia", cat: "EXTRA", tier: 1, icon: "Gem" },
  { b: "Empowered Hand of Avarice I", c: 15, t: "PE", desc: "Hand of Avarice (Grado Argento): ottieni una probabilità del 20% di ottenere 1d6 PE e 1d3 PA extra, quando ne ottieni sconfiggendo nemici.", br: "Avarizia: Grado Argento", cat: "EXTRA", tier: 2, icon: "Gem" },
  { b: "Empowered Hand of Avarice II", c: 30, t: "PE", desc: "Hand of Avarice (Grado Oro): ottieni una probabilità del 50% di ottenere 1d10 PE e 1d6 PA extra, quando ne ottieni sconfiggendo nemici.", br: "Avarizia: Grado Oro", cat: "EXTRA", tier: 3, icon: "Gem" },
  { b: "Empowered Hand of Avarice III", c: 50, t: "PE", desc: "Hand of Avarice (Grado Diamante): Ottieni sempre 5 PE e 3 PA, quando sconfiggi un nemico di sfida appropriata.", br: "Avarizia: Grado Diamante", cat: "EXTRA", tier: 4, icon: "Gem" },
  { b: "Breaking the Mortal Limit", c: 20, t: "PA", desc: "Sblocca il ramo Breaking the Mortal Limit. NOTA: puoi accedere a questo ramo solamente una volta che possiedi tre talenti di livello III di tre colori (branch) diversi.", br: "Sblocca Limite", cat: "EXTRA", tier: 1, icon: "Skull" },
  { b: "Breaking the Mortal Limit I", c: 10, t: "PA", desc: "Ottieni il tratto Relentless Endurance: Se scendi a 0 punti ferita ma non vieni ucciso sul colpo, puoi decidere di rimanere a 1 punto ferita (1 volta per riposo lungo).", br: "Resisti a 0 PF", cat: "EXTRA", tier: 2, icon: "HeartPulse" },
  { b: "Breaking the Mortal Limit II", c: 10, t: "PA", desc: "Ottieni il tratto Heavenly Wings: Ottieni una velocità di volare pari alla tua velocità di cammino per la durata di 10 minuti al giorno.", br: "Volo (10 min)", cat: "EXTRA", tier: 3, icon: "Bird" },
  { b: "Breaking the Mortal Limit III", c: 10, t: "PA", desc: "Ottieni il tratto Fortuna Prodigiosa: Quando ottieni un 1 naturale su un dado da 20 per un tiro per colpire, una prova di caratteristica o un tiro salvezza, puoi ripetere il dado e devi usare il nuovo risultato.", br: "Rilancia 1 Naturali", cat: "EXTRA", tier: 4, icon: "Sun" },
];



export const INITIAL_SKILLS: SkillNodeData[] = RAW_DATA.map(item => ({
  id: cleanId(item.b),
  name: item.b,
  description: item.desc,
  category: item.cat as any,
  tier: item.tier,
  costAscension: item.t === "PA" ? item.c : 0,
  costEvolution: item.t === "PE" ? item.c : 0,
  isActive: false,
  isUnlocked: item.tier === 0,
  iconName: item.icon
}));

const connections: { source: string; target: string }[] = [];

// 1. Collegamenti interni ai rami (stesso baseName, sequenza di Tier)
const branches: Record<string, SkillNodeData[]> = {};
INITIAL_SKILLS.forEach(skill => {
  const baseName = skill.name.split(" I")[0].split(" II")[0].split(" III")[0].trim();
  if (!branches[baseName]) branches[baseName] = [];
  branches[baseName].push(skill);
});

Object.values(branches).forEach(nodes => {
  nodes.sort((a, b) => a.tier - b.tier);
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push({ source: nodes[i].id, target: nodes[i+1].id });
  }
});

// 2. Collegamento dai nodi Tier 0 ai nodi Tier 1 della stessa categoria
// Questo assicura che rami come "Advanced Action Economy" (T1) richiedano "Utility Branch" (T0)
const categoryRoots: Record<string, SkillNodeData> = {};
INITIAL_SKILLS.forEach(skill => {
  if (skill.tier === 0) {
    categoryRoots[skill.category] = skill;
  }
});

INITIAL_SKILLS.forEach(skill => {
  if (skill.tier === 1) {
    const root = categoryRoots[skill.category];
    if (root) {
      // Evitiamo duplicati se il nodo T1 faceva già parte del chain del T0
      const exists = connections.some(c => c.source === root.id && c.target === skill.id);
      if (!exists) {
        connections.push({ source: root.id, target: skill.id });
      }
    }
  }
});

export const INITIAL_CONNECTIONS = connections;
