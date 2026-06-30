// script.js — MyRiddlePage logic

// ═══════════════════════════════════════════════════════════════
// ██  AI CONFIGURATION  ████████████████████████████████████████
// ═══════════════════════════════════════════════════════════════
//
//  Using: Groq — FREE, no credit card, 14,400 requests/day
//  Get your key at: https://console.groq.com/keys
//  (Sign in with Google/GitHub → API Keys → Create key)
//
//  STEP 1: Get your free API key from the link above
//  STEP 2: Paste it below between the quotes
//  STEP 3: Set enabled: true
//
const AI_CONFIG = {
  enabled: true,
  model: "meta-llama/llama-4-scout-17b-16e-instruct", // Llama 4, free on Groq
}
// ═══════════════════════════════════════════════════════════════

// ── CONSTANTS ────────────────────────────────────────────────
const STORAGE_KEY = "myriddlepage_data"
const STATUS = { TRY: "try", TRIED: "tried", GAVEUP: "gaveup", SOLVED: "solved" }
const STATUS_LABEL = { try: "[ to try ]", tried: "[ tried ]", gaveup: "[ gave up ]", solved: "[ solved ]" }
const STATUS_CLASS = { try: "status-try", tried: "status-tried", gaveup: "status-gaveup", solved: "status-solved" }

// ── STATE ────────────────────────────────────────────────────
let currentRiddleId = null
let hintCount = 0
let gameData = {} // { [id]: { status, chat, hintCount } }
let isAIBusy = false

// ── PERSISTENCE ──────────────────────────────────────────────
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) gameData = JSON.parse(raw)
  } catch (e) {
    gameData = {}
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameData))
  } catch (e) {}
}

function getState(id) {
  if (!gameData[id]) gameData[id] = { status: STATUS.TRY, chat: [], hintCount: 0 }
  return gameData[id]
}

// ── TILES ────────────────────────────────────────────────────
function buildBoard() {
  const board = document.getElementById("riddleBoard")
  board.innerHTML = ""

  RIDDLES.forEach((riddle) => {
    const state = getState(riddle.id)
    const tile = document.createElement("div")
    tile.className = "riddle-tile"
    tile.dataset.id = riddle.id
    tile.dataset.difficulty = riddle.difficulty
    tile.dataset.status = state.status

    // Odd IDs anchor left, even IDs anchor right — clean, no randomness
    if (riddle.id % 2 !== 0) {
      tile.style.marginLeft = "0"
      tile.style.marginRight = "auto"
    } else {
      tile.style.marginLeft = "auto"
      tile.style.marginRight = "0"
    }

    tile.innerHTML = `
      <span class="tile-id">#${String(riddle.id).padStart(2, "0")}</span>
      <span class="tile-name">${riddle.name}</span>
      <span class="tile-difficulty difficulty-${riddle.difficulty}">${riddle.difficulty}</span>
      <span class="tile-status ${STATUS_CLASS[state.status]}">${STATUS_LABEL[state.status]}</span>
    `
    tile.addEventListener("click", () => openDevice(riddle.id))
    board.appendChild(tile)
  })
}

function updateTile(id) {
  const state = getState(id)
  const tile = document.querySelector(`.riddle-tile[data-id="${id}"]`)
  if (!tile) return
  tile.dataset.status = state.status
  const statusEl = tile.querySelector(".tile-status")
  statusEl.className = `tile-status ${STATUS_CLASS[state.status]}`
  statusEl.textContent = STATUS_LABEL[state.status]
}

// ── DEVICE OPEN / CLOSE ──────────────────────────────────────
function openDevice(id) {
  currentRiddleId = id
  const riddle = RIDDLES.find((r) => r.id === id)
  const state = getState(id)
  hintCount = state.hintCount || 0

  document.getElementById("deviceLabel").textContent = `RIDDLE #${String(id).padStart(2, "0")}`

  const badge = document.getElementById("deviceDifficulty")
  badge.textContent = riddle.difficulty.toUpperCase()
  badge.className = `difficulty-badge ${riddle.difficulty}`

  document.getElementById("riddleName").textContent = riddle.name

  document.getElementById("riddleLines").innerHTML = riddle.lines
    .map((line) => `<div class="riddle-line">${escapeHtml(line)}</div>`)
    .join("")

  renderHints(riddle)

  const chatEl = document.getElementById("chatMessages")
  chatEl.innerHTML = ""
  if (state.chat.length === 0) {
    addSystemMsgRaw("Type your answer and press SUBMIT or Enter. Use HINT for clues.", "", chatEl)
  } else {
    state.chat.forEach((msg) => {
      if (msg.role === "user") addUserMsgRaw(msg.text, chatEl)
      else addSystemMsgRaw(msg.text, msg.type, chatEl)
    })
  }

  updateStatusBar(state.status)

  const input = document.getElementById("guessInput")
  input.value = ""
  const locked = state.status === STATUS.SOLVED || state.status === STATUS.GAVEUP
  setInputLocked(locked)

  const overlay = document.getElementById("deviceOverlay")
  overlay.classList.add("active")
  overlay.removeAttribute("aria-hidden")
  if (!locked) input.focus()

  scrollChat()
}

function closeDevice() {
  if (currentRiddleId !== null) {
    const state = getState(currentRiddleId)
    state.hintCount = hintCount
    if (state.status === STATUS.TRY && state.chat.length > 0) state.status = STATUS.TRIED
    saveData()
    updateTile(currentRiddleId)
  }
  const overlay = document.getElementById("deviceOverlay")
  overlay.classList.remove("active")
  overlay.setAttribute("aria-hidden", "true")
  currentRiddleId = null
  hintCount = 0
  isAIBusy = false
}

// ── RESET ALL ────────────────────────────────────────────────
function handleReset() {
  if (!window.confirm("Reset all riddle history?\nThis clears every saved chat and status. Cannot be undone.")) return
  gameData = {}
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {}
  buildBoard()
}

// ── CLEAR THIS RIDDLE'S DATA ──────────────────────────────────
function handleClearData() {
  if (currentRiddleId === null) return
  if (!window.confirm("Clear data for this riddle?\nThis resets its chat history and status to 'to try'.")) return
  delete gameData[currentRiddleId]
  saveData()
  // Re-open fresh
  const id = currentRiddleId
  closeDevice()
  openDevice(id)
}

// ── SUBMIT HANDLER ────────────────────────────────────────────
async function handleSubmit() {
  if (isAIBusy) return

  const input = document.getElementById("guessInput")
  const raw = input.value.trim()
  if (!raw) return

  input.value = ""
  const riddle = RIDDLES.find((r) => r.id === currentRiddleId)
  const state = getState(currentRiddleId)

  addUserMsg(raw, state)
  if (state.status === STATUS.TRY) state.status = STATUS.TRIED

  const clean = raw
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
  const answers = Array.isArray(riddle.answer)
    ? riddle.answer.map((a) => a.toLowerCase().trim())
    : [riddle.answer.toLowerCase().trim()]
  const isExactMatch = answers.includes(clean)

  // ── AI path (handles all verdicts including correct) ──────────
  if (AI_CONFIG.enabled) {
    isAIBusy = true
    setInputLocked(true)
    const typingEl = addTypingIndicator()

    let result
    try {
      result = await judgeGuessWithAI(riddle, raw, state, isExactMatch)
    } catch (err) {
      typingEl.remove()
      isAIBusy = false
      setInputLocked(false)

      const code = err.message || ""
      let errMsg
      if (code === "HTTP_429") {
        errMsg = "⏳ Rate limit hit. Wait a few seconds and try again."
      } else if (code === "NETWORK") {
        errMsg = "🔌 Could not reach Groq — check your internet connection or API key."
      } else if (code.startsWith("HTTP_403") || code.startsWith("HTTP_401")) {
        errMsg = "🔑 API key rejected. Double-check your key in AI_CONFIG at the top of script.js."
      } else if (code.startsWith("HTTP_404")) {
        errMsg = "❌ Groq model not found. Check the model name in AI_CONFIG."
      } else {
        // Parse fail or unknown — if exact match still mark solved with fallback
        if (isExactMatch) {
          const others = answers.filter((a) => a !== clean)
          const extra = others.length ? ` Also valid: ${others.map((a) => a.toUpperCase()).join(", ")}.` : ""
          handleVerdict({ verdict: "correct", message: `✓ Correct! Well done!${extra}` }, state, riddle)
          return
        }
        handleVerdict({ verdict: "wrong", message: buildWrongFallback(raw) }, state, riddle)
        return
      }

      addSystemMsg(errMsg, "warn-msg", null, state)
      saveData()
      scrollChat()
      return
    }

    typingEl.remove()
    isAIBusy = false
    handleVerdict(result, state, riddle)
  } else {
    // AI disabled — local fallback
    if (isExactMatch) {
      const others = answers.filter((a) => a !== clean)
      const extra = others.length ? ` Also valid: ${others.map((a) => a.toUpperCase()).join(", ")}.` : ""
      handleVerdict({ verdict: "correct", message: `✓ Correct! Well done!${extra}` }, state, riddle)
    } else {
      handleVerdict({ verdict: "wrong", message: buildWrongFallback(raw) }, state, riddle)
    }
  }
}

// ── VERDICT APPLIER ───────────────────────────────────────────
function handleVerdict(result, state, riddle) {
  const { verdict, message } = result

  if (verdict === "correct") {
    addSystemMsg(message, "correct", null, state)
    state.status = STATUS.SOLVED
    setInputLocked(true)
    updateStatusBar(STATUS.SOLVED)
    updateTile(currentRiddleId)
    saveData()
  } else if (verdict === "typo") {
    // Typo does NOT auto-solve — just nudges the player to retry/check spelling
    addSystemMsg(message, "typo-msg", null, state)
    setInputLocked(false)
    saveData()
  } else if (verdict === "close") {
    addSystemMsg(message, "close-msg", null, state)
    setInputLocked(false)
    saveData()
  } else if (verdict === "warm") {
    addSystemMsg(message, "warm-msg", null, state)
    setInputLocked(false)
    saveData()
  } else {
    // wrong / trash
    addSystemMsg(message, "wrong", null, state)
    setInputLocked(false)
    saveData()
  }

  scrollChat()
}

// ── HINT HANDLER ─────────────────────────────────────────────
async function handleHint() {
  if (isAIBusy) return
  const riddle = RIDDLES.find((r) => r.id === currentRiddleId)
  const state = getState(currentRiddleId)

  if (hintCount >= riddle.hints.length) {
    addSystemMsg("No more hints available.", "hint-msg", null, state)
    saveData()
    scrollChat()
    return
  }

  const rawHint = riddle.hints[hintCount]
  hintCount++
  state.hintCount = hintCount
  if (state.status === STATUS.TRY) state.status = STATUS.TRIED

  const hintText = `HINT ${hintCount}: ${rawHint}`
  renderHints(riddle)
  addSystemMsg(hintText, "hint-msg", null, state)

  saveData()
  scrollChat()
}

// ── GIVE UP HANDLER ───────────────────────────────────────────
function handleGiveUp() {
  const riddle = RIDDLES.find((r) => r.id === currentRiddleId)
  const state = getState(currentRiddleId)

  const displayAnswer = Array.isArray(riddle.answer)
    ? riddle.answer.join(" / ").toUpperCase()
    : String(riddle.answer).toUpperCase()
  const msgText = `The answer was: "${displayAnswer}". Better luck next time!`
  addSystemMsg(msgText, "giveup-msg", null, state)
  state.status = STATUS.GAVEUP
  setInputLocked(true)
  updateStatusBar(STATUS.GAVEUP)
  updateTile(currentRiddleId)
  saveData()
  scrollChat()
}

// ═══════════════════════════════════════════════════════════════
// ██  AI FUNCTIONS  ████████████████████████████████████████████
// ═══════════════════════════════════════════════════════════════

// Returns: { verdict: 'correct'|'typo'|'close'|'warm'|'wrong'|'trash', message: string }
async function judgeGuessWithAI(riddle, guess, state, isExactMatch = false) {
  const riddleText = riddle.lines.join("\n")
  const answersArr = Array.isArray(riddle.answer) ? riddle.answer : [riddle.answer]
  const synonymMode = riddle.synonym === true // clean boolean field, nothing in answer array
  const hasMultiple = answersArr.length > 1
  const otherAnswers = answersArr.slice(1)
  const attemptsSoFar = state.chat.filter((m) => m.role === "user").length

  const preknown = isExactMatch
    ? `NOTE: The system has verified this guess is an EXACT CORRECT MATCH. Your verdict MUST be "correct". Write a nice congratulation message.`
    : `NOTE: The system has verified this is NOT an exact match. Use your judgment for verdict.`

  const synonymNote = synonymMode
    ? `\nSYNONYM MODE: This riddle accepts direct synonyms of any listed answer as correct too. When listing other valid answers, end with "...and their synonyms" — nothing else.`
    : ""

  const answersBlock = isExactMatch
    ? `VALID ANSWERS (all equal): ${answersArr.map((a) => `"${a}"`).join(", ")}${synonymNote}
→ Verdict MUST be "correct".`
    : `PRIVATE ANSWER LOOKUP (use ONLY to judge proximity — do not output any of these words in your message):
${answersArr.map((a, i) => `  [${i + 1}] "${a}"`).join("\n")}`

  const primaryAnswerStr = answersArr[0].toUpperCase()

  const prompt = `You are the judge of a riddle game. Respond ONLY with a JSON object — no other text.

RIDDLE THE PLAYER IS SOLVING:
${riddleText}

SECRET (never reveal in close/warm/wrong/trash responses):
${answersBlock}

PLAYER'S GUESS: "${guess}"
${preknown}

YOUR ONLY OUTPUT — start with { end with }, nothing else:
{"verdict":"VERDICT_HERE","message":"MESSAGE_HERE"}

If verdict is "correct": message MUST literally name the answer "${primaryAnswerStr}".

VERDICT — pick exactly one, in this priority order:

1. "correct" — mark correct when ANY of these are true. Before deciding NOT correct, explicitly check
   each of a/b/c/d below one by one — do not skip straight to "wrong" or "close" without testing them:
   a) Exact match to an answer (ignoring case/punctuation).
   b) Minor filler word omission/addition (a/an/the/of/on/without/with) that doesn't change meaning,
      as long as every meaning-carrying word (noun/verb/adjective) still matches the answer exactly.
      TEST IT: strip filler words from both the guess and the answer, then compare what's left.
      Example: answer "stone" → guess "a stone" → strip "a" → "stone" = "stone" ✓ CORRECT.
      Example: answer "an ocean without water" → "ocean without water" ✓, "ocean with no water" ✓.
      Adding NEW descriptive content words (not in the answer) does NOT count — e.g. answer "drone" →
      "remote controlled drone" ✗ (extra content words = not correct, that's close/warm instead).
   c) Word order changed but same content words, regardless of how unusual the reordering sounds.
      TEST IT: take the content words from the guess, take the content words from the answer — same
      set of words, different order = CORRECT, even if the reordered phrase sounds grammatically odd.
      Example: answer "coat of paint" → guess "paint coat" ✓ CORRECT, guess "paint of coat" ✓ CORRECT
      (still just "paint" + "coat" reordered, "of" is filler — ignore that it reads awkwardly).
   ${synonymMode ? `d) SYNONYM MODE — CHECK THIS CAREFULLY, do not skip it: this riddle accepts direct
      synonyms of ANY listed answer as correct. TEST IT: ask yourself "if I looked this guess up in a
      thesaurus entry for the answer, would it appear as a synonym?" If yes → correct. Examples for
      answer "wrong": "false" ✓ correct (false = a standard synonym of wrong/incorrect), "untrue" ✓
      correct (same meaning), "inaccurate" ✓ correct (same meaning — something inaccurate IS wrong/
      incorrect), "mistaken" ✓ correct, "erroneous" ✓ correct. Be GENEROUS here — if the guess and the
      answer would be interchangeable in a sentence without changing its meaning, mark it correct.
      Do NOT require the guess to be a rare or unusual synonym — common everyday synonyms count fully.` : ""}

   Math/logic expressions (like "4+5" for answer "9") are NEVER "correct", even if the math is right —
   see categories 3 and 4 below for how to handle these instead.

2. "typo" — the guess is the SAME single word as an answer, with any of:
   a) 1-2 letters wrong, swapped, missing, or added anywhere in the word — including simple
      pluralization or de-pluralization. TEST IT: if you remove/add just 1-2 letters from the guess,
      does it become exactly the answer (or vice versa)? If yes → typo.
      Examples: "painr"→"paint" ✓, "echu"→"echo" ✓, "carpet"↔"carpets" ✓ (just the "s"),
      "misconception"↔"misconceptions" ✓ (just the "s" — this IS a typo, not close/warm).
   b) A regional/alternate English spelling of the same word (e.g. "center"→"centre",
      "foetus"→"fetus", "colour"→"color").
   Typo does NOT solve the riddle — it just nudges the player that they're a letter away.
   STRICT: "carcat" is NOT a typo for "carpet" (different word, sounds similar) — that's "close" instead.

3. "close" — ONLY when:
   a) The guess very closely means the same thing as the answer (true near-synonym), e.g.
      "badminton" for "shuttlecock" is too broad for close — but "shuttle" for "shuttlecock" is close
      because one word is literally contained within / is a shortened form of the other.
   b) The answer is a substring of the guess or the guess is a substring of the answer (whole-word
      containment), e.g. "shuttle" for "shuttlecock", "mirror" for "rear-view mirror".
   c) A math/logic expression that, when YOU verify it, equals this riddle's specific numeric answer.
      Compute it yourself — don't assume. Answer "nine"(=9), guess "4+5" → compute 4+5=9 ✓ this counts
      as "close" (right number, not expressed as the word). Answer "one"(=1), guess "4+5" → 4+5=9≠1,
      this is "wrong" instead, not close.
   This is a NARROW category — not just "related," but nearly identical or one-contains-the-other.

4. "warm" — the guess and answer are connected through the RIDDLE's context: same field, same
   category, adjacent role, or a thing closely associated within the riddle's world — but the words
   themselves are not close synonyms. Examples: "game" or "badminton player" for answer "shuttlecock"
   (related through the riddle's sport context, not synonym-level). This should be used more often
   than close — most "in the right direction" guesses belong here, not in close.
   Also warm: a guess that references the CONCEPT of a math operation relevant to the riddle (e.g. the
   riddle mentions counting or "4" and "5" somewhere, and the guess is "addition" or "sum") without
   actually computing the right number.

5. "wrong" — the guess has no real connection to the answer, OR is only superficially/thematically
   paired with it without being truly related (e.g. "ice" for answer "fire" — commonly paired as
   opposites in speech, but not a meaningful guess connection). Also wrong: something that appears
   in the riddle's text/imagery but isn't actually related to the specific answer word (e.g. "car"
   when the answer is "trunk" — car is mentioned in the riddle but trunk-the-answer isn't about cars).
   A math expression that computes to the wrong number for this riddle is also wrong.
   If genuinely unsure between warm and wrong, pick wrong. BUT if synonym mode is active and the guess
   is a real synonym, it must go to "correct" (category 1d), not "wrong" — do not let category 5
   override category 1d.

6. "trash" — gibberish, random key-mashing, or a guess showing no real attempt to solve.

━━━ MESSAGE RULES ━━━
⚠️ ABSOLUTE RULE — READ CAREFULLY: In typo/close/warm/wrong/trash responses, your message must NEVER
contain: the answer word itself, any synonym of the answer, any word from the same word-family or
concept-pair as the answer (e.g. if answer is "shadow", you may NOT use "shade", "dark", "silhouette",
"dim", "light", "shine", "illuminate", "glow", or any other light/dark vocabulary — these are all part
of the same concept-pair as shadow and are just as revealing as the answer itself). Opposites, paired
concepts, and "themed" words connected to the answer's CATEGORY are forbidden — only the riddle's own
narrative imagery (the scenario, objects, and setting described in the riddle text, NOT words related
to what the answer itself is) may be referenced.

Before writing your message, mentally list 3-5 words that are closely associated with the answer
(synonyms, opposites, the same category/field). Then check your sentence does not contain ANY of them.
If it does, rewrite the sentence using only the riddle's narrative/imagery instead.

VARIETY IS REQUIRED. Do not use the same sentence structure twice. Rotate between: playful dismissal,
philosophical musing, mock confusion, rhetorical question, dry wit, dramatic reaction. Keep it fresh.

- "correct": Celebrate warmly. ALWAYS state the correct answer explicitly (e.g. "the answer is COAT OF PAINT"). Reference their guess if it differs. ${isExactMatch && hasMultiple ? `Also mention other valid answer(s): ${otherAnswers.map(a=>a.toUpperCase()).join(", ")}${synonymMode ? ", and their synonyms" : ""}.` : synonymMode ? `ALWAYS state ALL the listed answers (${answersArr.map(a=>a.toUpperCase()).join(", ")}) explicitly by name, even if the player only guessed a synonym of one — and mention synonyms also count.` : ""} Max 2 sentences.
- "typo":    Say it looks like a typo / spelling slip, gently nudge them to check their spelling and try again. Do NOT reveal the answer. Max 1-2 sentences.
- "close":   1 sentence. Make them feel tantalizingly near. Creative, not generic. Use ONLY riddle imagery, never answer-related words.
- "warm":    1 sentence. Motivate with context. Use ONLY riddle imagery, never answer-related words.
- "wrong":   1 sentence. Witty, uses riddle imagery (not answer-related words) to make the dismissal feel smart and specific to this riddle.
- "trash":   1 sentence. Playfully mock the effort. No answer-related words.`

  console.log("[Groq] Sending judge request for guess:", guess)
  const raw = await callAI(prompt)
  console.log("[Groq] Raw response:", raw)

  const parsed = safeParseJSON(raw)
  console.log("[Groq] Parsed:", parsed)

  if (!parsed || !parsed.verdict || !parsed.message) {
    throw new Error(`PARSE_FAIL: ${raw.slice(0, 100)}`)
  }

  const verdict = parsed.verdict.trim().toLowerCase().replace(/['"]/g, "")
  const validVerdicts = ["correct", "typo", "close", "warm", "wrong", "trash"]
  if (!validVerdicts.includes(verdict)) {
    console.warn("[Groq] Unknown verdict:", verdict, "— treating as wrong")
    return { verdict: "wrong", message: parsed.message }
  }

  // Safety: if system confirmed exact match, ALWAYS force correct
  // (typo no longer auto-solves, so we must not let an exact match slip through as typo)
  if (isExactMatch && verdict !== "correct") {
    const others = otherAnswers.length ? ` Also valid: ${otherAnswers.map((a) => a.toUpperCase()).join(", ")}.` : ""
    return { verdict: "correct", message: parsed.message + others }
  }

  return { verdict, message: parsed.message }
}

// Low-level Groq call (OpenAI-compatible format)
async function callAI(prompt, maxTokens = 300) {
  let response
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: AI_CONFIG.model,
        maxTokens,
      }),
    })
  } catch (networkErr) {
    console.error("[Groq] Network error:", networkErr)
    throw new Error("NETWORK")
  }

  if (!response.ok) {
    let errBody = ""
    try {
      errBody = await response.text()
    } catch (_) {}
    console.error(`[Groq] HTTP ${response.status}:`, errBody)
    throw new Error(`HTTP_${response.status}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) {
    console.error("[Groq] Empty response:", JSON.stringify(data).slice(0, 300))
    throw new Error("EMPTY")
  }
  console.log("[Groq] Output:", text.slice(0, 200))
  return text
}

function safeParseJSON(raw) {
  // Gemini 2.5 can return JSON in several formats:
  // 1. Raw JSON
  // 2. ```json\n{...}\n```
  // 3. Some preamble text then JSON
  // 4. JSON with trailing explanation
  try {
    // Try 1: raw JSON directly
    return JSON.parse(raw.trim())
  } catch (_) {}

  try {
    // Try 2: extract from code fences (multiline)
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (fenced) return JSON.parse(fenced[1].trim())
  } catch (_) {}

  try {
    // Try 3: find first { ... } block in the string
    const braceStart = raw.indexOf("{")
    const braceEnd = raw.lastIndexOf("}")
    if (braceStart !== -1 && braceEnd > braceStart) {
      return JSON.parse(raw.slice(braceStart, braceEnd + 1))
    }
  } catch (_) {}

  console.error("[Groq] Could not parse JSON from response:", raw)
  return null
}

// ── FALLBACK (no AI / AI fails) ───────────────────────────────
function buildWrongFallback(guess) {
  const g = guess.toUpperCase()
  const bank = [
    `"${g}" — not quite. Try again.`,
    `Wrong. "${g}" isn't the answer. Think deeper.`,
    `Negative. Keep thinking...`,
    `Close? Maybe. But "${g}" doesn't crack it.`,
    `That's a miss. The riddle has more layers.`,
    `Not this time. Look at the words more carefully.`,
  ]
  const idx = guess.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % bank.length
  return bank[idx]
}

// ── TYPING INDICATOR ─────────────────────────────────────────
function addTypingIndicator() {
  const chatEl = document.getElementById("chatMessages")
  const el = document.createElement("div")
  el.className = "msg msg-system typing-indicator"
  el.innerHTML = `<span class="msg-label">system</span><div class="msg-bubble"><span class="dot-pulse">●●●</span></div>`
  chatEl.appendChild(el)
  scrollChat()
  return el
}

// ── MESSAGE HELPERS ──────────────────────────────────────────
function addUserMsg(text, state) {
  addUserMsgRaw(text, document.getElementById("chatMessages"))
  state.chat.push({ role: "user", text })
}

function addUserMsgRaw(text, container) {
  const el = document.createElement("div")
  el.className = "msg msg-user"
  el.innerHTML = `<span class="msg-label">you</span><div class="msg-bubble">${escapeHtml(text)}</div>`
  ;(container || document.getElementById("chatMessages")).appendChild(el)
}

function addSystemMsg(text, type, container, state) {
  addSystemMsgRaw(text, type, container || document.getElementById("chatMessages"))
  if (state) state.chat.push({ role: "system", text, type })
}

function addSystemMsgRaw(text, type, container) {
  const el = document.createElement("div")
  el.className = "msg msg-system"
  el.innerHTML = `<span class="msg-label">system</span><div class="msg-bubble ${type || ""}">${escapeHtml(text)}</div>`
  ;(container || document.getElementById("chatMessages")).appendChild(el)
}

function scrollChat() {
  const chatEl = document.getElementById("chatMessages")
  setTimeout(() => {
    chatEl.scrollTop = chatEl.scrollHeight
  }, 20)
}

// ── HINT RENDERING ───────────────────────────────────────────
// optionalOverrides: array of already-rephrased strings to use instead of raw
function renderHints(riddle, optionalOverrides) {
  const area = document.getElementById("hintArea")
  area.innerHTML = ""
  for (let i = 0; i < hintCount; i++) {
    const text = optionalOverrides?.[i] || `HINT ${i + 1}: ${riddle.hints[i]}`
    const div = document.createElement("div")
    div.className = "hint-item"
    div.innerHTML = `<span class="hint-label">›</span> <span>${escapeHtml(text)}</span>`
    area.appendChild(div)
  }
}

// ── STATUS BAR ───────────────────────────────────────────────
function updateStatusBar(status) {
  const dot = document.getElementById("statusDot")
  const text = document.getElementById("statusText")
  dot.className = "status-dot"
  const map = {
    [STATUS.TRY]: ["", "READY"],
    [STATUS.TRIED]: ["warn", "IN PROGRESS"],
    [STATUS.SOLVED]: ["ok", "SOLVED ✓"],
    [STATUS.GAVEUP]: ["purple", "REVEALED"],
  }
  const [cls, label] = map[status] || ["", "READY"]
  if (cls) dot.classList.add(cls)
  text.textContent = label
}

// ── LOCK / UNLOCK INPUT ───────────────────────────────────────
function setInputLocked(locked) {
  const ids = ["guessInput", "btnSubmit", "btnGiveUp", "btnHint"]
  ids.forEach((id) => {
    document.getElementById(id).disabled = locked
  })
}

// ── UTILITY ──────────────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement("div")
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadData()
  buildBoard()

  document.getElementById("btnClose").addEventListener("click", closeDevice)
  document.getElementById("btnClearData").addEventListener("click", handleClearData)
  document.getElementById("btnSubmit").addEventListener("click", handleSubmit)
  document.getElementById("btnHint").addEventListener("click", handleHint)
  document.getElementById("btnGiveUp").addEventListener("click", handleGiveUp)
  document.getElementById("btnReset").addEventListener("click", handleReset)

  document.getElementById("guessInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSubmit()
  })

  document.getElementById("deviceOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeDevice()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById("deviceOverlay").classList.contains("active")) closeDevice()
  })
})
