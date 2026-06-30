// riddledata.js — Riddle list for MyRiddlePage
// Each riddle: { id, name, difficulty, lines, hints, answer }

const RIDDLES = [
{
  id: 1,
  name: "It was left there, it is part here",
  difficulty: "moderate",
  lines: [
    "They found it buried, but still left it,",
    "and just took what was present in it.",
    "For them, of course, was just the treasure,",
    "which they sought for life-long money and pleasure.",
    "It is also present on the tree,",
    "a part of most cars, I've seen.",
    "It is part of both elephant and you,",
    "guess the it, you've got every clue."
  ],
  hints: [
    "The same word refers to a body part, a container, and a vehicle compartment.",
    "Think of something shared by an elephant, a tree, and many cars."
  ],
  answer: "trunk",
  synonym: false
},
{
  id: 2,
  name: "Can see or not?",
  difficulty: "moderate",
  lines: [
    "Whenever it is there, I am able to see,",
    "Still it is what I'm sure, you can't ever see.",
    "It is neither heavy, nor does it take space,",
    "Wherever you are, whatever is your place.",
    "Yet it fills up the room, you were in before,",
    "It never makes a sound, it's a fact, I'm sure.",
    "It is no doubt, essential, for me and for you,",
    "But still we don't save it , and you can't do that too!",
    "If you are it , then you should eat and eat,",
    "Find the it , though for this, you won't get a treat."
  ],
  hints: [
    "You rely on it every day, but it isn't something you can physically hold.",
    "no sound, no space, necessary but can't save. hmm."
  ],
  answer: "light",
  synonym: false
},
{
  id: 3,
  name: "Faces of Fortune",
  difficulty: "easy",
  lines: [
    "I threw it, you threw it, but it is not a waste,",
    "It can help me or make me lose, according to its face.",
    "It has many faces, but I assure you, it is not the Ravanna,",
    "It has many dots, just like bullets, but it is not a gun.",
    "It helped me reach the ladder, it made me overtake others,",
    "Find the it, it's not that hard, my fellow sisters and brothers."
  ],
  hints: [
    "Its outcome depends entirely on which face lands upward.",
    "Board games often can't begin without it."
  ],
  answer: ["dice","die"],
  synonym: false
},
{
  id: 4,
  name: "The Final Visitor",
  difficulty: "moderate",
  lines: [
    "It is something you have never got, neither have you experienced,",
    "But still I'm sure, a day will come, when you'll become it's recipient.",
    "I would never want you to, experience it so soon,",
    "as for if you get it, my riddles would be read by whom?",
    "It is for everyone, it's a rule, that it will come to visit,",
    "and, you well know you will get it, it's enough, so guess the it."
  ],
  hints: [
    "Every living being is destined to encounter it once.",
    "It's the one certainty shared by everyone."
  ],
  answer: "death",
  synonym: false
},
{
  id: 5,
  name: "A Well-Placed Serve",
  difficulty: "hard",
  lines: [
    "It is not to be eaten, but yet is what we serve,",
    "I hit it, you do that too, and it goes in a curve.",
    "If I do never hit it, that is called love usually,",
    "But still my mother says - hit it, do not be so silly!",
    "If I serve, and it is for you,",
    "then I would never want you to-",
    "return it, so that I get praised,",
    "find the it, if this is the case."
  ],
  hints: [
    "The clue 'love' points toward one family of sports.",
    "Different sports use different versions of the same object."
  ],
  answer: ["shuttlecock", "tennis ball", "table tennis ball"],
  synonym: false
},
{
  id: 6,
  name: "The Used Hero",
  difficulty: "moderate",
  lines: [
    "I used him for a purpose, oh sorry,",
    "It was for my own greed,",
    "He is trapped in the plan now, he can't escape,",
    "I don't care if he was with me,",
    "I sacrificed it for the king and king's horses,",
    "For it was for me most worthless,",
    "But if it reaches the end, it would be,",
    "For me and my side, the best.",
    "It is a thing, he is someone, yet they both are same,",
    "if you can't find the him or it, it would be a shame."
  ],
  hints: [
    "It begins as the least valuable piece on the board.",
    "Reaching the opposite side completely changes its fate."
  ],
  answer: "pawn",
  synonym: false
},
{
  id: 7,
  name: "The Empty Thought",
  difficulty: "hard",
  lines: [
    "It is there when you don't have anything,",
    "If you think of it, you can never think a thing.",
    "There is a reason for it, for why you can't think,",
    "As when you think of it, you actually never think.",
    "Let us stop thinking then, and go for its shape,",
    "Alas! it has no shape or size, it has nothing in it.",
    "It makes this riddle so special that, this is no special anyhow,",
    "these are enough hints for you to guess, so find the it now!"
  ],
  hints: [
    "It is the absence rather than the presence of something.",
    "The answer itself describes emptiness."
  ],
  answer: "nothing",
  synonym: false
},
{
  id: 8,
  name: "Something's Simple Here",
  difficulty: "easy",
  lines: [
    "It is the front of women, it is at the back of cow,",
    "It is what that starts the world.",
    "If you see carefully, it is made up of two 'V's,",
    "And is in warmth, not in the cold.",
    "You have seen it, the it you have to guess,",
    "About which i'm talking in the first 4 lines.",
    "Believe this or not, the answer appeared,",
    "in the riddle itself, many times!"
  ],
  hints: [
    "Read the words literally rather than their meanings.",
    "It's a single letter with an interesting shape."
  ],
  answer: ["the letter w","w"],
  synonym: true
},
{
  id: 9,
  name: "One Word, Many Wings",
  difficulty: "hard",
  lines: [
    "It lives in a hive, flying from flower to flower,",
    "It is controlled by terrorists, or by military tower.",
    "It may have a battery, or maybe a heart like you,",
    "It might not sting you, but it might shoot, it's true.",
    "It may also be person, who lives on work of others,",
    "Or it could be irritating, a musical tone rather.",
    "This is interesting, for it has many meanings,",
    "so it could be found by a few,",
    "Now, guess the it, you have some time,",
    "till I make a riddle new."
  ],
  hints: [
    "Every clue points to a different meaning of the same word.",
    "Think of insects, aircraft, music, and people."
  ],
  answer: "drone",
  synonym: false
},
{
  id: 10,
  name: "On the Right Track",
  difficulty: "easy",
  lines: [
    "It is a verb, it is a noun,",
    "I run on it, when it is on ground.",
    "Police does it, when a car is stolen,",
    "It is on which the stolen car is driven.",
    "It is the series of the songs on my PC,",
    "no doubt you can find it, this one's too ez."
  ],
  hints: [
    "The same word can mean to follow, a path, or an individual song.",
    "Railways are closely associated with one of its meanings."
  ],
  answer: "track",
  synonym: false
},
{
  id: 11,
  name: "The Misplaced Wanderer",
  difficulty: "moderate",
  lines: [
    "It is brown, it has a hump,",
    "it is an animal indeed,",
    "It has four legs, a quiet nature,",
    "and doesn't need a regular feed.",
    "BUT,",
    "it doesn't know, where it is, and",
    "where is the family gone,",
    "and why is there no sand, but snow,",
    "and when did it become all alone.",
    "For you, I tracked it, it is at North Pole,",
    "far away, north of Rome,",
    "a camel lives in desert, and not at a pole,",
    "so, think again, guessing the it is your goal."
  ],
  hints: [
    "The answer is more specific than just the animal.",
    "The location described is completely wrong for where it belongs."
  ],
  answer: "lost camel",
  synonym: false
},
{
  id: 12,
  name: "The First Addition",
  difficulty: "moderate",
  lines: [
    "When If I put all of these one by one then-",
    "it is the number of letters that complete writing 'ten',",
    "it is the number of books I can put in my empty bag,",
    "it is the number of files I can put on the vacant rack,",
    "it is the number of people that can sit on an unoccupied seat,",
    "it is the number of words that I can write on a blank sheet,",
    "it is the number of biscuits I can put in an empty glass,",
    "it is the number of people who can own uninhabited villas,",
    "it is the number of bricks that completes a building,",
    "it is the number of words that completed this riddle writing.",
    "I really don't know why I would put, biscuits in a glass,",
    "Just ignore that nonsense, find the it, real quick and fast."
  ],
  hints: [
    "Every example depends on something being empty before the first addition.",
    "The answer is the smallest positive counting number."
  ],
  answer: ["one", "1"],
  synonym: false
},
{
  id: 13,
  name: "Words About Words",
  difficulty: "hard",
  lines: [
    "It is where success comes before work,",
    "it is where a chick comes before egg,",
    "If we open it we can find nothing in it,",
    "yet it has chicken and omelet and egg.",
    "It is in our Earth, but also, Earth is in it,",
    "it may get ruined by water, still has water in it.",
    "It is not living but still, has emotion and brain,",
    "think and think, and find the thing, until you go insane!"
  ],
  hints: [
    "Alphabetical order explains several of the clues.",
    "It contains countless words without physically containing the things they describe."
  ],
  answer: "dictionary",
  synonym: false
},
{
  id: 14,
  name: "Dinner Guest",
  difficulty: "easy",
  lines: [
    "On the dining table, you may dine on it,",
    "it should be sour, if in your mouth it could fit.",
    "But in real it would eat you in a blink,",
    "if it was present, what is it? you think..."
  ],
  hints: [
    "Say the first two words out loud.",
    "The joke depends on a phrase sounding like a single word."
  ],
  answer: "dinosaur",
  synonym: false
},
{
  id: 15,
  name: "Layers of Tears",
  difficulty: "easy",
  lines: [
    "It makes us cry, so it might be emotional,",
    "It goes on and on, and has eye in the middle,",
    "Find the it, I accept, this riddle is not original."
  ],
  hints: [
    "The 'eye' is part of its spelling, not its anatomy.",
    "Peeling it is enough to make many people cry."
  ],
  answer: "onion",
  synonym: false
},
{
  id: 16,
  name: "Life on a Keypad",
  difficulty: "hard",
  lines: [
    "If 1 is a foetus, who has never taken in air,",
    "and if 2 is a baby, who needs a lot of care;",
    "if 3 is a child, who without candy goes wild,",
    "and if 6 is a teenager, who isn't anymore a child;",
    "if 7 is an adult, working for wealth to prosper,",
    "and if 8 is an old man, who can't listen to a whisper;",
    "if 9 is a skeleton, as after death is no one alive,",
    "then you've to find the it, if it is four and five."
  ],
  hints: [
    "Imagine the digits representing stages of a person's life.",
    "The answer is formed by combining two consecutive digits."
  ],
  answer: ["nine", "9"],
  synonym: false
},
{
  id: 17,
  name: "The Timeless Guard",
  difficulty: "hard",
  lines: [
    "While walking in the nature, I ended up in a city,",
    "Markets were closed, doors were shut, just a person asking for pity.",
    "I asked what he wanted, he said - I want it,",
    "Pointing towards an animal, under the shed, lamplit.",
    "It is a watch that shows no time,",
    "And sits there all silent and aloof,",
    "The man wants it for protection, guess the it,",
    "It is still under the shed, in the cold night, oof !"
  ],
  hints: [
    "Split the word into two familiar English words.",
    "Its job is to keep watch, not to tell time."
  ],
  answer: "watchdog",
  synonym: false
},
{
  id: 18,
  name: "Ferrari's Kitten",
  difficulty: "moderate",
  lines: [
    "I just learned the process of crossbreeding and,",
    "crossed my shining Ferrari with my dearest kitty cat,",
    "it is soft like my pet, and stylish like my car,",
    "guess the it till I find something to cross with a rat."
  ],
  hints: [
    "Blend the names of the two things together.",
    "You probably have one somewhere in your house."
  ],
  answer: "carpet",
  synonym: false
},
{
  id: 19,
  name: "Always Said Wrong",
  difficulty: "easy",
  lines: [
    "No matter how easy the situation is,",
    "you'll always tell it incorrect,",
    "no doubt you are a fool because,",
    "you'll never speak it correct.",
    "You aren't a good person,",
    "as you use it for wrong,",
    "it isn't rare, easily find it,",
    "no need to think for long."
  ],
  hints: [
    "The joke is about saying the word itself.",
    "Pronouncing it correctly still means you've said it."
  ],
  answer: "incorrect",
  synonym: false
},
{
  id: 20,
  name: "Everything Was...",
  difficulty: "easy",
  lines: [
    "The Earth was never round firstly,",
    "and the space is filled with air,",
    "aliens pull us down and not some force,",
    "which you all call gravity, but don't fear.",
    "Fruits were never meant to be eaten,",
    "that's a mistake everyone has made,",
    "they are gods who are evil, not the demons,",
    "and the thieves do never invade.",
    "Guess the it, oh I do agree that,",
    "in the riddle it never appear,",
    "then let me use it in the last line-",
    "the facts in the riddle were all it, now it is clear."
  ],
  hints: [
    "Every statement before the ending shares the same quality.",
    "The final line directly describes every previous claim."
  ],
  answer: ["wrong", "misconceptions", "incorrect"],
  synonym: true
},
{
  id: 21,
  name: "The Bus You Can't Ride",
  difficulty: "moderate",
  lines: [
    "Find the it, if it is a bus which you can't ride,",
    "if huge, it is a stress, which you would never like,",
    "you want it early, so that you can prepare,",
    "you want it for large numbers, about which you all care."
  ],
  hints: [
    "The first line is a wordplay, not an actual vehicle.",
    "Students often ask for it before exams."
  ],
  answer: "syllabus",
  synonym: false
},
{
  id: 22,
  name: "The Dry Ocean",
  difficulty: "hard",
  lines: [
    "It is just an ocean, but without any water,",
    "so, there are no sharks or fishes, there is no slaughter.",
    "There is no land, don't ask me why, because-",
    "it is JUST an ocean, but without any water.",
    "It has no markings, so it is not a map,",
    "it is not a planet, which only has gas,",
    "you may call it like a riddle, without any words,",
    "or maybe like a tree with nests, without any birds.",
    "It has no ships sailing, no waves, no motion,",
    "what is it that has no water, yet is called an ocean?"
  ],
  hints: [
    "Take the description completely literally.",
    "The answer is exactly what the riddle keeps describing."
  ],
  answer: "an ocean without water",
  synonym: false
},
{
  id: 23,
  name: "Black to Red",
  difficulty: "easy",
  lines: [
    "I bought it, I got it, from somewhere, somehow,",
    "it was black like the dreary but scary night, but now,",
    "it is red on use, find the it, if in the day,",
    "I would throw it, when it will become boring gray."
  ],
  hints: [
    "Think about what changes color as it burns.",
    "Its final gray form is usually thrown away."
  ],
  answer: ["coal", "charcoal"]
},
{
  id: 24,
  name: "The Wet Coat",
  difficulty: "easy",
  lines: [
    "It is a coat that is wore wet,",
    "not by you but by houses and machines,",
    "it is no cloth, it has no buttons,",
    "just a colour, so find it by any means."
  ],
  hints: [
    "The 'coat' isn't clothing.",
    "Walls and vehicles often receive one for protection and appearance."
  ],
  answer: "coat of paint",
  synonym: false
},
{
  id: 25,
  name: "The Weeping Sky",
  difficulty: "moderate",
  lines: [
    "It cries so that, you are able to live,",
    "it flies without any wings.",
    "If it is grey, you may hear it",
    "though it neither speaks nor sings.",
    "It's arrival can even defeat the bright,",
    "warm shine of the days or the noon,",
    "Guess the it, answer and wait,",
    "the next one is coming soon!"
  ],
  hints: [
    "Its tears are essential for life on Earth.",
    "A darker one often arrives with thunder."
  ],
  answer: "clouds",
  synonym: false
},
{
  id: 26,
  name: "The Swift Messenger",
  difficulty: "hard",
  lines: [
    "If it is the first from the center then,",
    "you will be on the third,",
    "It moved through the worlds, a god with speed,",
    "by flying like a bird.",
    "A drop of it maybe a death for you,",
    "What is it, a guess can you do?"
  ],
  hints: [
    "The same name belongs to both a Roman god and a planet.",
    "In another meaning, it is a toxic metal."
  ],
  answer: "mercury",
  synonym: false
},
{
  id: 27,
  name: "Seen From Every Angle",
  difficulty: "moderate",
  lines: [
    "It looks like some kind of 'T',",
    "-says person when he sees it from far & open,",
    "No ! It is more like a circle,",
    "-says the brightshining mighty sun.",
    "Hold it straight and, it is a 'one' when closed,",
    "-says the same little fellow person,",
    "Interrupts the mannerless sun again,",
    "it is a dot and not a one.",
    "Whatever it looks like, it is always the same,",
    "what matters is that, you have to find its name."
  ],
  hints: [
    "Its appearance changes depending on how it's held.",
    "You'd be glad to have one if it suddenly started raining."
  ],
  answer: "umbrella",
  synonym: false
},
{
  id: 28,
  name: "The Working Weight",
  difficulty: "hard",
  lines: [
    "It is professional weight unit by name,",
    "it works, it runs, and still has no brain.",
    "it has no legs, no hands, no seed,",
    "it may work on snakes, or letters it may read.",
    "it won't work, even with the slightest of fault,",
    "let your guesses come out, without any hault !"
  ],
  hints: [
    "Its name is also the SI unit for force.",
    "Computers execute it line by line."
  ],
  answer: "program",
  synonym: false
},
{
  id: 29,
  name: "A Hero Within",
  difficulty: "hard",
  lines: [
    "If first two are seen, then it is a he,",
    "If first three, then it is her,",
    "If the first four are seen, it has someone,",
    "who is good n great and a winner.",
    "Leave the numbers, and go for the whole,",
    "it describes a women of good-n-great soul,",
    "whether admired for beauty or some work real good,",
    "finding the it is what all you should."
  ],
  hints: [
    "The prefixes form meaningful English words one after another.",
    "The complete word is commonly used for a female lead in stories."
  ],
  answer: "heroine",
  synonym: false
},
{
  id: 30,
  name: "Still a Stone",
  difficulty: "easy",
  lines: [
    "I got a stone from a person, who was then a chancellor,",
    "then I kept it on the stage, for the geologist dancer.",
    "The dancer told me about it, it was from tropic of cancer,",
    "what is it now, after, listening to the dancer's answer ?"
  ],
  hints: [
    "Nothing described changes the object itself.",
    "Its owner, location, and information about it are irrelevant."
  ],
  answer: "stone",
  synonym: false
},
{
  id: 31,
  name: "The Silent Messenger",
  difficulty: "moderate",
  lines: [
    "From your houses to the offices,",
    "along the roads and highway it runs,",
    "without any legs it travels miles,",
    "whether it rains or is below the sun.",
    "Not some vehicle, it is not some field,",
    "though some say it travels from pole to pole,",
    "it delivers your words, your feelings and all,",
    "For now, finding the it is your only goal."
  ],
  hints: [
    "It carries conversations, not passengers.",
    "Think of the physical connection rather than the device."
  ],
  answer: ["telephone wire", "telephone line", "communication cable"],
  synonym: true
},
{
  id: 32,
  name: "Climbing Without Moving",
  difficulty: "hard",
  lines: [
    "It is made of blocks, or lines one or few,",
    "it may show heart rate, performance or time,",
    "it stays at one place, while climbing up-n-down,",
    "ignore this sentence as I had nothing to rhyme.",
    "It has a scale, and has markings on it,",
    "it can be related with votes or cars or dresses,",
    "If made for long, it is long, that's obvious,",
    "so now this one is done, do you have any guesses ?"
  ],
  hints: [
    "It visually represents information.",
    "Bar, line, and pie are common varieties."
  ],
  answer: "graph",
  synonym: false
},
{
  id: 33,
  name: "Friend and Foe",
  difficulty: "moderate",
  lines: [
    "In cold it makes you ill if,",
    "for long it is on you,",
    "if you think it is harmful then, beware!",
    "it is already inside you too.",
    "If it surrounds you for quite some time,",
    "you would have to die,",
    "If it's not around you for hours,",
    "you might have to cry.",
    "It is in your kitchen,",
    "in the soil and in the air,",
    "finding the it is-",
    "neither hard, nor it is rare."
  ],
  hints: [
    "Too much or too little of it can both be dangerous.",
    "Your body is largely made of it."
  ],
  answer: "water",
  synonym: false
}
////
];
