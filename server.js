const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');
const os         = require('os');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════
//  PLAYERS (fixed — only Ron & Hadas)
// ══════════════════════════════════════════
const PLAYERS = ['רון', 'הדס'];

// ══════════════════════════════════════════
//  CARD DATA
// ══════════════════════════════════════════
const CATS = {
  personal: {
    label: 'שאלות אישיות', icon: '💬', color: '#e0517a',
    grad: 'linear-gradient(135deg,#e0517a,#9b5de5)',
    cards: [
      {id:'p1',  text:'מה הדבר שהכי אהבת בגיל 10 ועדיין אוהב?',                   tip:'תשובה ישרה, בלי לחשוב יותר מדי', icon:'🧒'},
      {id:'p2',  text:'אם יכולת לשנות רגע אחד מהשנה האחרונה — מה היה?',            tip:'לא חייב להיות רע, אולי רגע שהיית רוצה להאריך', icon:'⏪'},
      {id:'p3',  text:'מה הדבר שאני עושה שממש גורם לך להרגיש אהוב?',              tip:'תהיו ספציפיים — תנועה, מילה, מבט', icon:'💗'},
      {id:'p4',  text:'מה הפחד הכי גדול שלך שעוד לא סיפרת לי עליו?',              tip:'תנשמו. האחד מחזיק את השני', icon:'🌊'},
      {id:'p5',  text:'אם הייתם שני ספרים — איזה סוג ספר היה כל אחד?',           tip:'ז\'אנר, כריכה, כמה עמודים — הכל עולה', icon:'📚'},
      {id:'p6',  text:'מה הדבר שאתה הכי גאה בו בעצמך בשנה האחרונה?',             tip:'גאווה אישית, לא הישג חיצוני', icon:'🌟'},
      {id:'p7',  text:'מתי בפעם האחרונה בכית — ועל מה?',                           tip:'אין תשובה נכונה או לא נכונה', icon:'🥺'},
      {id:'p8',  text:'מה המוזיקה שמכניסה אותך הכי עמוק פנימה?',                  tip:'שיר, אמן, ז\'אנר — מה שעולה ראשון', icon:'🎵'},
      {id:'p9',  text:'איזה גרסה של עצמך אתה מחפש להיות בעוד שנה?',              tip:'לא ברשימה — בתחושה', icon:'🌱'},
      {id:'p10', text:'מה הדבר שהכי קשה לך לבקש עזרה בו?',                        tip:'נשמה לנשמה', icon:'🤝'},
      {id:'p11', text:'מה מייד משפר לך את הרוח גם ביום הכי קשה?',                  tip:'קטן או גדול, הכל תקף', icon:'☀️'},
      {id:'p12', text:'אם היית שולח מכתב לגרסה הצעירה שלך — מה כתבת?',           tip:'שתפו בקול', icon:'✉️'},
      {id:'p13', text:'מה הדבר שאתה הכי אוהב לגבי הקשר שלנו?',                    tip:'תגידו במילים — לא רק ב"הכל"', icon:'💑'},
      {id:'p14', text:'אם יכולת לחיות יום אחד כמישהו אחר — מי ולמה?',             tip:'בן אדם אמיתי, דמות, מישהו מהסביבה', icon:'🦸'},
      {id:'p15', text:'מה גרם לך לדעת שאני "זה"/"זו"?',                            tip:'רגע, תחושה, מחשבה — מתי הבנתם?', icon:'✨'},
    ]
  },
  memories: {
    label: 'זיכרונות', icon: '📸', color: '#00c9a7',
    grad: 'linear-gradient(135deg,#00c9a7,#0067b3)',
    cards: [
      {id:'m1',  text:'ספרו על הרגע הראשון שהרגשתם שיש כימיה.',                   tip:'מה בדיוק קרה? מה הייתם לבושים?', icon:'⚡'},
      {id:'m2',  text:'מה הסיפור הכי מצחיק שעבר עליכם יחד?',                     tip:'זה שמביא לכם חיוך מיידי', icon:'😂'},
      {id:'m3',  text:'זכרו יחד את הדייט הראשון — כל אחד מגרסתו.',               tip:'השוו — בטוח יש הבדלים', icon:'🌹'},
      {id:'m4',  text:'מה הטיול הכי בלתי נשכח שלכם?',                            tip:'אפילו אם לא הלכה לפי התוכנית', icon:'✈️'},
      {id:'m5',  text:'זכרו רגע שנלחמתם ואחר כך צחקתם עליו.',                    tip:'מה הפך את הרוגז לצחוק?', icon:'🕊️'},
      {id:'m6',  text:'מה השיר שהוא מיד שלכם?',                                   tip:'ספרו איפה שמעתם אותו יחד בפעם הראשונה', icon:'🎶'},
      {id:'m7',  text:'מה הסוד הראשון ששיתפתם אחד עם השני?',                     tip:'הרגע שהתחלתם להאמין אחד בשני', icon:'🔐'},
      {id:'m8',  text:'מה הסיטואציה שבה הרגשתם הכי "אנחנו"?',                    tip:'יכול להיות רגע שקט לגמרי', icon:'🫂'},
      {id:'m9',  text:'ספרו על פעם שהפתעתם אחד את השני.',                         tip:'הפתעה טובה, לא חייבת להיות מתוכננת', icon:'🎁'},
      {id:'m10', text:'מה הרגע הכי רומנטי שחוויתם יחד?',                          tip:'לפעמים הרגעים הקטנים הם הכי גדולים', icon:'🌙'},
      {id:'m11', text:'מה פחד שאחד מכם עזר לשני להתגבר עליו?',                   tip:'לפעמים נוכחות מספיקה', icon:'🦋'},
      {id:'m12', text:'מה המשפט שאחד אמר שהשני עדיין זוכר?',                     tip:'מצחיק, רציני, או סתם מוזר', icon:'💬'},
    ]
  },
  creative: {
    label: 'יצירתיות', icon: '🎨', color: '#f7b731',
    grad: 'linear-gradient(135deg,#f7b731,#e0517a)',
    cards: [
      {id:'c1',  text:'אם הקשר שלנו היה סרט — איזה ז\'אנר ומי הכוכב?',           tip:'כל אחד מציע ז\'אנר — השוו', icon:'🎬'},
      {id:'c2',  text:'בנו יחד את הדייט המושלם עם תקציב אינסופי.',                tip:'כל אחד מוסיף אלמנט אחד — חלופות', icon:'🌍'},
      {id:'c3',  text:'אם הייתם חיות — מה כל אחד מכם ולמה?',                    tip:'ואם הייתם חיות — האם הייתם מסתדרים?', icon:'🦁'},
      {id:'c4',  text:'תארו את הבית האידיאלי שלכם בעוד 10 שנים.',               tip:'כל אחד מוסיף חדר — בנו אותו יחד', icon:'🏡'},
      {id:'c5',  text:'3 מקומות בעולם שתרצו לנסוע אליהם — אלו?',                tip:'כל אחד בוחר מקום + אחד מוחלט יחד', icon:'🗺️'},
      {id:'c6',  text:'כתבו יחד 6 מילים שמתארות את הקשר שלכם.',                 tip:'כל אחד אומר 3 — ראו אם יש חפיפות', icon:'✍️'},
      {id:'c7',  text:'אם יכולתם ליצור סדרה על חייכם — שם הפרק הראשון?',        tip:'חשבו על where it all began', icon:'📺'},
      {id:'c8',  text:'אם הייתם להקה — שם הלהקה והז\'אנר?',                      tip:'ובונוס: שם האלבום הראשון', icon:'🎸'},
      {id:'c9',  text:'בחרו 3 שירים שהם "פסקול" לקשר שלכם.',                    tip:'כל אחד בוחר שיר + אחד מוחלט יחד', icon:'🎵'},
      {id:'c10', text:'אם יכולתם לגור בכל תקופה היסטורית — מתי ואיפה?',         tip:'ומה הייתם עושים שם יחד?', icon:'⏳'},
      {id:'c11', text:'כתבו פרסומת של 3 משפטים למערכת היחסים שלכם.',            tip:'מוכרים מה? לאיזו אוכלוסיית יעד?', icon:'📣'},
      {id:'c12', text:'אם הייתם ממציאים חגיגה חדשה — מה חוגגים?',               tip:'שם, תאריך, מסורת — הכל!', icon:'🎊'},
      {id:'c13', text:'תארו את הארוחה המושלמת שהייתם מכינים זה לזה.',           tip:'כל אחד מתאר ארוחה לשני, בפרטים', icon:'🍽️'},
    ]
  },
  dare: {
    label: 'אתגרים', icon: '🔥', color: '#9b5de5',
    grad: 'linear-gradient(135deg,#9b5de5,#e0517a)',
    cards: [
      {id:'d1',  text:'שלחו לחבר/ה טוב/ה: "אתם רוצים לשמוע משהו נחמד עלינו?"',   tip:'ואז ספרו מה הם ענו 😄', icon:'📱', player:'שניהם'},
      {id:'d2',  text:'ספרו זה לזה משהו שמעולם לא ספרתם לשום אדם.',              tip:'זה מרגיש מפחיד — בדיוק בגלל זה שווה', icon:'🔓', player:'כל אחד בתורו'},
      {id:'d3',  text:'שחקו "מה אני אוהב בך" — כל אחד אומר 5 דברים ספציפיים.',  tip:'לא "הכל" — תהיו ספציפיים!', icon:'❤️', player:'כל אחד בתורו'},
      {id:'d4',  text:'בעיניים סגורות — מה אתם חושבים עלי כשקמים?',              tip:'ללא עריכות. מה שעולה ראשון', icon:'😴', player:'שניהם'},
      {id:'d5',  text:'כתבו יחד ב-10 שניות רשימת "הדברים שאנחנו הכי טובים בהם".', tip:'כמה שיותר מהר, ללא מחשבה', icon:'⚡', player:'שניהם'},
      {id:'d6',  text:'תנו לשני ניחוש: מה הייתי רוצה לשמוע עכשיו? ואז — אמרו את זה.', tip:'ההזדמנות הזאת היא עכשיו', icon:'👂', player:'כל אחד בתורו'},
      {id:'d7',  text:'מיני אתגר ריקוד: 60 שניות — כמה שיותר מוגזם.',            tip:'כיף בהחלט 💃', icon:'💃', player:'שניהם'},
      {id:'d8',  text:'כל אחד מעניק לשני תואר כבוד ומסביר אותו.',                tip:'כמו: "אלוף הניחוחות" או "מלכת הנחמה"', icon:'🏆', player:'כל אחד בתורו'},
      {id:'d9',  text:'מה הייתם עושים אחרת אם הייתם מתחילים את הקשר מחדש?',    tip:'לא ביקורת — רפלקציה אמיתית', icon:'🔄', player:'כל אחד בתורו'},
      {id:'d10', text:'אמרו "אני אוהב אותך" בשלוש שפות — אחת ממוצאת.',           tip:'השפה הממוצאת חייבת להיות הנמתקת ביותר', icon:'🌐', player:'שניהם'},
      {id:'d11', text:'ספרו על הרגע שהרגשתם שאתם ממש רואים אחד את השני.',        tip:'ההבדל הזה חשוב. חשבו עליו.', icon:'👁️', player:'כל אחד בתורו'},
      {id:'d12', text:'שחקו "מי בינינו יותר...?" — כל אחד שואל שאלה.',            tip:'כל תשובה דורשת הסבר!', icon:'🤔', player:'שניהם'},
      {id:'d13', text:'אמרו משהו שתמיד רציתם לומר אבל חיכיתם לרגע הנכון.',       tip:'ההזדמנות הזאת היא עכשיו', icon:'💌', player:'כל אחד בתורו'},
      {id:'d14', text:'צרו יחד ברכה שתשלחו לעצמכם בעוד שנה.',                    tip:'כל אחד כותב משפט אחד — שלחו במייל', icon:'📩', player:'שניהם'},
    ]
  },
  life: {
    label: 'רגעי חיים', icon: '🎂', color: '#ff9f43',
    grad: 'linear-gradient(135deg,#ff9f43,#ee5a24)',
    cards: [
      {id:'l1',  text:'איפה חגגנו את יום ההולדת שלך בפעם האחרונה? מה היה הרגע הכי טוב שם?',   tip:'סגרו עיניים ותחזרו לאותו ערב', icon:'🎂'},
      {id:'l2',  text:'מה הארוחה הכי בלתי נשכחת שאכלנו יחד? מה הזמנו?',                       tip:'המסעדה, השולחן, מה לבשתם — הכל', icon:'🍽️'},
      {id:'l3',  text:'איזה חופשה או טיול הפתיע אתכם לטובה יותר מכל ציפייה?',                   tip:'אפילו אם הכל הלך הפוך — מה עשה אותו מיוחד?', icon:'✈️'},
      {id:'l4',  text:'מה האירוע המשפחתי שדיברתם עליו שנה לאחר מכן?',                          tip:'חתונה, בר מצווה, ברית — מה תפס אתכם?', icon:'👨‍👩‍👧‍👦'},
      {id:'l5',  text:'ספרו על ערב ספונטני לגמרי — בלי תכנון — שיצא מדהים.',                    tip:'מה התחיל אותו? לאן הגעתם בסוף?', icon:'🌃'},
      {id:'l6',  text:'מה הרכישה הכי שמחה שקניתם יחד? האם חרטתם?',                             tip:'גדולה או קטנה — מה הביאה לחייכם?', icon:'🛍️'},
      {id:'l7',  text:'זכרו את הדירה הראשונה שגרתם בה יחד. מה הדבר הכי מצחיק שקרה שם?',         tip:'ריח, רעש, שכנים, ריהוט — כל פרט עולה', icon:'🏠'},
      {id:'l8',  text:'איזה סרט, סדרה או הצגה ראיתם יחד שעדיין מדברים עליה?',                   tip:'ולמה דווקא היא נשארה?', icon:'🎭'},
      {id:'l9',  text:'מה החג שהכי נהנתם לחגוג יחד? מה עשה אותו מיוחד?',                       tip:'ראש השנה, פסח, חנוכה — מה ה"טקס" שלכם?', icon:'🕎'},
      {id:'l10', text:'ספרו על פעם שאחד מכם עבר משהו קשה — וכיצד הייתם שם זה לזה.',            tip:'לא צריך פרטים — רק התחושה', icon:'🤍'},
      {id:'l11', text:'מה הקונצרט, האירוע או ההופעה הכי מדהימה שהייתם בה יחד?',                tip:'אמן, מקום, מה הרגשתם שם', icon:'🎸'},
      {id:'l12', text:'ספרו על יום הולדת שאחד מכם ארגן לשני — מה עבד ומה השתבש?',              tip:'גם הסיפורים שהשתבשו הם הכי טובים', icon:'🎁'},
      {id:'l13', text:'מה ההחלטה הכי גדולה שקיבלתם יחד? ואיך הגעתם אליה?',                     tip:'דירה, ילד, עבודה, מעבר — מה היה הרגע שאמרתם "כן"?', icon:'🔑'},
      {id:'l14', text:'איזה מקום בעולם — שביקרתם בו — הייתם חוזרים אליו מחר אם יכולתם?',       tip:'ולמה דווקא שם?', icon:'🗺️'},
      {id:'l15', text:'מה שנה שעברה לימדה אתכם על עצמכם כזוג?',                                tip:'לא חייב להיות עמוק — גם תגלית קטנה שווה', icon:'📅'},
      {id:'l16', text:'ספרו על ארוחת שישי או ארוחה משפחתית שתמיד תזכרו — מה היה שם?',          tip:'מי ישב, מה בושל, מה נאמר', icon:'🕯️'},
      {id:'l17', text:'מה הדבר הכי טיפש שעשיתם יחד ואחר כך צחקתם עליו שנים?',                 tip:'בנו, קנו, תכננו — מה לא עבד?', icon:'😅'},
    ]
  }
};

// ══════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}

// ══════════════════════════════════════════
//  ONE PERMANENT GAME (no room codes)
// ══════════════════════════════════════════
const GAME = {
  players:   [null, null],   // [רון-socket, הדס-socket]
  cat:       null,
  deck:      [],
  cardIdx:   0,
  reactions: {},
  history:   [],
};

function gameState() {
  const cat  = GAME.cat ? CATS[GAME.cat] : null;
  const card = (GAME.deck && GAME.deck[GAME.cardIdx]) || null;
  return {
    players:   PLAYERS,
    cat:       GAME.cat,
    catMeta:   cat ? { label: cat.label, icon: cat.icon, color: cat.color, grad: cat.grad } : null,
    card,
    cardIdx:   GAME.cardIdx,
    total:     GAME.deck.length,
    reactions: GAME.reactions,
    history:   GAME.history,
    online:    GAME.players.map(s => !!s),
  };
}

function broadcast(event, data) {
  GAME.players.forEach(s => { if (s) s.emit(event, data); });
}

// ══════════════════════════════════════════
//  SOCKET EVENTS
// ══════════════════════════════════════════
io.on('connection', (socket) => {

  // Join as Ron (0) or Hadas (1) ───────────
  socket.on('join', ({ playerIdx }) => {
    // Disconnect previous session for same player if any
    const prev = GAME.players[playerIdx];
    if (prev && prev.id !== socket.id) prev.emit('replaced', {});

    GAME.players[playerIdx] = socket;
    socket.data.playerIdx   = playerIdx;

    socket.emit('joined', { playerIdx, state: gameState() });
    broadcast('online_update', { online: GAME.players.map(s => !!s) });
  });

  // Select category ─────────────────────────
  socket.on('select_cat', ({ cat }) => {
    if (!CATS[cat]) return;
    GAME.cat       = cat;
    GAME.deck      = shuffle(CATS[cat].cards);
    GAME.cardIdx   = 0;
    GAME.reactions = {};
    broadcast('game_state', gameState());
  });

  // Next card ───────────────────────────────
  socket.on('next_card', () => {
    const card = GAME.deck[GAME.cardIdx];
    if (card && (GAME.reactions[0] || GAME.reactions[1])) {
      GAME.history.push({
        cat:       GAME.cat,
        text:      card.text,
        reactions: { ...GAME.reactions },
        ts:        Date.now(),
      });
    }
    if (GAME.cardIdx >= GAME.deck.length - 1) {
      broadcast('game_ended', { history: GAME.history });
      return;
    }
    GAME.cardIdx++;
    GAME.reactions = {};
    broadcast('game_state', gameState());
  });

  // React ───────────────────────────────────
  socket.on('react', ({ emoji, playerIdx }) => {
    GAME.reactions[playerIdx] = emoji;
    broadcast('reactions_update', { reactions: GAME.reactions });
  });

  // Back to categories ──────────────────────
  socket.on('back_to_cats', () => {
    GAME.cat = null; GAME.deck = []; GAME.cardIdx = 0; GAME.reactions = {};
    broadcast('show_cats', {});
  });

  // Disconnect ──────────────────────────────
  socket.on('disconnect', () => {
    const pi = socket.data.playerIdx;
    if (pi === undefined) return;
    if (GAME.players[pi] && GAME.players[pi].id === socket.id) {
      GAME.players[pi] = null;
      broadcast('online_update', { online: GAME.players.map(s => !!s) });
    }
  });
});

// ══════════════════════════════════════════
//  START
// ══════════════════════════════════════════
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   💑  אנחנו — רון והדס               ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  📱  פתחו בטלפון:                    ║`);
  console.log(`║      http://${ip}:${PORT}        ║`);
  console.log('╚══════════════════════════════════════╝\n');
});
