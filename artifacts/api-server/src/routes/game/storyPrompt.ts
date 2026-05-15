interface HeroInfo {
  name: string;
  pronouns: string;
  ancestry: string;
  className: string;
}

interface StartGameData {
  hero: HeroInfo;
  difficulty: string;
  adventureSeed: string;
  maxTurns: number;
}

export interface EpisodePlan {
  episodeTitle: string;
  genre: string;
  centralProblem: string;
  heroGoal: string;
  stakes: string;
  keyStoryElements: string[];
  intendedResolution: string;
  pacingBeats: string[];
  readingGuidance: string;
  opening: QuestOpening;
}

export interface TurnData extends StartGameData {
  turn: number;
  storySummary: string;
  storyHistory?: string;
  chosenAction: string;
  mathResult: string;
  episodePlan?: EpisodePlan;
  lastMathSkill?: {
    skillLabel: string;
    problemType: string;
    difficulty: string;
    gradeBand: number;
    storyFlavor: string;
  };
}

export interface EndingData extends StartGameData {
  turn: number;
  storySummary: string;
  storyHistory?: string;
  mathSolved: number;
  episodePlan?: EpisodePlan;
}

export const ALLOWED_HERO_NAMES = ["Astra", "Kael", "Nova", "Mira", "Jax", "Luna", "Orion", "Sage", "Zara", "Theo", "Elara", "Milo", "Lunamandia", "Solara", "Bramble"] as const;
export const ALLOWED_PRONOUNS = ["she/her", "he/him", "they/them"] as const;
export const ALLOWED_ANCESTRIES = ["Human", "Elf", "Dwarf", "Dragonborn", "Fae", "Robot", "Merfolk", "Beastfolk", "Starborn", "Gnome", "Sprite", "Stonekin", "Cloudling", "Foxfolk", "Hamster", "Koala", "Guinea Pig", "Wolf", "Mango", "Starling", "Pebblekin"] as const;
export const ALLOWED_CLASSES = ["Wizard", "Warrior", "Explorer", "Rogue", "Inventor", "Healer", "Beast Tamer", "Elementalist", "Guardian", "Cartographer", "Stargazer", "Alchemist", "Puzzle Mage"] as const;
export const ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard", "Extreme"] as const;
export const ALLOWED_MAX_TURNS = [8, 12, 16] as const;

const QUEST_LENGTH_LABELS: Record<number, string> = {
  8: "Quick Quest",
  12: "Standard Quest",
  16: "Full Quest",
};

function getQuestLengthLabel(maxTurns: number) {
  return QUEST_LENGTH_LABELS[maxTurns] ?? "Custom Quest";
}

type QuestGenre =
  | "Fantasy"
  | "Space Adventure"
  | "Mystery"
  | "Pirate Adventure"
  | "Jungle Adventure"
  | "Underwater Adventure"
  | "Sky Islands"
  | "Clockwork / Invention"
  | "Ancient Ruins"
  | "Spooky Mystery / Friendly Ghosts"
  | "Tiny World"
  | "Magical School"
  | "Snack Escape"
  | "Crystal Caverns"
  | "Clockwork City"
  | "Jungle Ruins"
  | "Undersea Kingdom"
  | "Moon Base Mystery"
  | "Enchanted Library"
  | "Candy Kingdom"
  | "Dinosaur Valley"
  | "Miniature Backyard Quest"
  | "Rainbow Railway"
  | "Pop Band Quest";

type GenreProfile = {
  settings: string[];
  objectives: string[];
  helpers: string[];
  details: string[];
  avoid: string;
};

export type QuestOpening = {
  name: string;
  genre: QuestGenre;
  setting: string;
  objective: string;
  helpers: string;
  detail: string;
  avoid: string;
};

const SURPRISE_GENRE = "Surprise Me!";

const BASE_GENRE_PROFILES: Record<QuestGenre, GenreProfile> = {
  Fantasy: {
    settings: ["a moonlit castle garden", "a crystal forest", "a floating wizard tower", "a valley of singing stones"],
    objectives: ["restore a missing glow to the guardian lantern", "wake the sleepy bridge before sunset", "return a lost map rune to its page", "help a shy dragon find the courage to ask for help"],
    helpers: ["crystal fox", "owl librarian", "tiny dragon scout", "moss giant"],
    details: ["golden ivy curls around every doorway", "friendly sprites leave clues in acorn cups", "the wind sounds like a harp", "every solved puzzle lights another star"],
    avoid: "dark curses, scary monsters, violence, death",
  },
  "Space Adventure": {
    settings: ["a candy-bright comet station", "a moon garden under glass", "a starship classroom deck", "an asteroid market of floating stalls"],
    objectives: ["repair the beacon that guides friendly travelers", "sort the mixed-up star maps", "help a lost rover find its charging dock", "restart the constellation projector"],
    helpers: ["robot navigator", "moon moth", "comet captain", "star puppy"],
    details: ["planets drift by like glowing marbles", "buttons blink in rainbow patterns", "zero-gravity notebooks float past", "a telescope hums whenever clues line up"],
    avoid: "space disasters, oxygen danger, scary aliens, realistic crashes",
  },
  Mystery: {
    settings: ["a museum after closing", "a moonlit library", "a puzzle hotel with talking doors", "a train car full of harmless clues"],
    objectives: ["find who borrowed the missing exhibit label", "follow the trail of glowing footprints", "solve why the portrait keeps changing hats", "return the lost chapter before the bell rings"],
    helpers: ["book mouse", "friendly detective cat", "map fairy", "talking magnifying glass"],
    details: ["clues appear as harmless sparkles", "every door asks a riddle politely", "the clock ticks in secret patterns", "a notebook flips to the next clue by itself"],
    avoid: "crime realism, fear, threats, horror, death",
  },
  "Pirate Adventure": {
    settings: ["a sunny island cove", "a friendly pirate ship", "a tide-pool treasure map", "a harbor of singing boats"],
    objectives: ["find the missing compass before the tide turns", "share a treasure of kindness fairly", "repair the sail with puzzle patches", "decode a map of safe harbor lights"],
    helpers: ["parrot lookout", "jolly captain", "puzzle crab", "rope-knot sprite"],
    details: ["gold coins are actually chocolate wrappers", "the ship's bell rings when clues are found", "waves clap softly against the dock", "treasure chests giggle when opened"],
    avoid: "weapons, fighting, stealing, danger at sea",
  },
  "Jungle Adventure": {
    settings: ["a bright rainforest trail", "a treehouse observatory", "a vine bridge above a shallow stream", "a hidden garden of giant leaves"],
    objectives: ["help guide friendly animals to the festival clearing", "repair the sun dial flower", "find the path markers before lunch", "return the rain drum to the canopy stage"],
    helpers: ["toucan guide", "gentle jaguar cub", "leaf sprite", "frog drummer"],
    details: ["flowers open when clues are solved", "vines form arrows in the air", "raindrops tap a cheerful rhythm", "butterflies carry tiny map flags"],
    avoid: "predator attacks, injury, scary jungle danger",
  },
  "Underwater Adventure": {
    settings: ["a glowing reef city", "a pearl library", "a kelp maze with friendly signs", "a shell-powered workshop"],
    objectives: ["fix the coral gate before the current changes", "return a missing pearl bookmark", "guide lantern fish back to their school", "tune the shell bells for the reef parade"],
    helpers: ["merfolk guide", "puzzle crab", "lantern fish", "sea turtle elder"],
    details: ["bubbles carry clues upward", "coral windows glow like stained glass", "seaweed writes arrows in the water", "shells hum when the path is right"],
    avoid: "drowning, scary sea monsters, storms, injury",
  },
  "Sky Islands": {
    settings: ["a chain of cloud islands", "a sky orchard above the hills", "a floating market", "a windmill village in the clouds"],
    objectives: ["repair the cloud bridge", "catch runaway kite seeds", "help the windmills turn in rhythm", "deliver a message to the rainbow post office"],
    helpers: ["cloud turtle", "bronze owl", "wind sprite", "sky llama"],
    details: ["clouds puff into stepping stones", "rainbows mark safe paths", "bells ring from floating towers", "feathers drift toward the next clue"],
    avoid: "falling harm, lightning injuries, frightening storms",
  },
  "Clockwork / Invention": {
    settings: ["a clockwork workshop", "a friendly robot lab", "a gear-powered greenhouse", "a steam train of inventions"],
    objectives: ["restart the kindness-powered engine", "sort gears into the right machine", "help a robot remember its parade steps", "cool a volcano machine into harmless steam"],
    helpers: ["gear sprite", "clockwork bird", "robot helper", "goggle-wearing squirrel"],
    details: ["gears click like music", "safe steam puffs into silly shapes", "blueprints fold into arrows", "tiny bells ding after every clever choice"],
    avoid: "explosions, burns, real machine danger, injury",
  },
  "Ancient Ruins": {
    settings: ["a sunlit puzzle pyramid", "a marble maze of friendly statues", "a buried garden temple", "a ruin where murals tell jokes"],
    objectives: ["match the mural tiles before sunset", "open the kindness gate", "restore the compass statue's missing gem", "find the festival path through the ruins"],
    helpers: ["sand sphinx", "hieroglyph fairy", "magic compass", "stone turtle"],
    details: ["tiles glow when patterns make sense", "statues offer polite hints", "sunbeams point at safe clues", "ancient bells hum softly in the walls"],
    avoid: "curses, mummy horror, traps that hurt people, tomb danger",
  },
  "Spooky Mystery / Friendly Ghosts": {
    settings: ["a friendly ghost lighthouse", "a glowing portrait hallway", "a moonlit schoolhouse with silly shadows", "a library where lanterns float politely"],
    objectives: ["help a shy ghost pet find its bell", "relight the welcome beacon", "match silly skeleton keys to their doors", "solve why the portraits keep swapping frames"],
    helpers: ["friendly ghost keeper", "moon moth", "lantern sprite", "smiling skeleton key"],
    details: ["nothing jumps out; clues glow gently", "shadows wave hello", "the ghost says please and thank you", "candles bob like tiny stars"],
    avoid: "horror, terror, gore, death-focused plots, nightmare imagery",
  },
  "Tiny World": {
    settings: ["a garden where the hero is tiny", "a teacup village", "a mushroom workshop", "a bookshelf city behind a loose page"],
    objectives: ["find the safe growing charm", "repair the acorn elevator", "help ants organize a picnic parade", "deliver a button wheel to the toy cart"],
    helpers: ["ladybug scout", "friendly ant", "button mouse", "flower fairy"],
    details: ["dew drops look like crystal balls", "pencils become bridges", "crumbs are boulder-sized snacks", "petals unfold like maps"],
    avoid: "being eaten, scary insects, injury",
  },
  "Magical School": {
    settings: ["a school of floating staircases", "a classroom inside a giant tree", "a safe spell practice hall", "a hall of glowing lockers"],
    objectives: ["help the class mural remember its colors", "organize runaway lesson cards", "find the missing bell chime", "prepare the kindness exam celebration"],
    helpers: ["pencil sprite", "friendly hall monitor owl", "chalkboard dragon", "bookmark fairy"],
    details: ["desks shuffle into helpful patterns", "chalk lines become arrows", "lockers hum cheerful clues", "stars sparkle over correct plans"],
    avoid: "mean teachers, punishment, embarrassment, unsafe magic",
  },
  "Snack Escape": {
    settings: ["a giant picnic blanket", "a storybook kitchen counter", "a cafeteria tray raceway", "a market basket maze"],
    objectives: ["help a snack-sized hero reach the safe fruit parade", "roll a tiny supply cart away from the lunch line", "guide the picnic treats back to their cozy basket", "find the crumb trail to the safe snack clubhouse"],
    helpers: ["blueberry scout", "toast crumb cartographer", "friendly napkin kite", "tiny spoon sled"],
    details: ["giant footsteps thump like drums far away", "a napkin flutters like a sail", "crumbs make boulder-sized stepping stones", "a lunch bell rings in silly cartoon echoes"],
    avoid: "cannibalism, horror, graphic eating, biting, chewing, injury, realistic danger, scary humans",
  },
  "Crystal Caverns": {
    settings: ["a glowing cave of rainbow crystals", "a gem tunnel under a sleepy mountain", "a lantern-lit cavern classroom", "a crystal bridge above a quiet underground stream"],
    objectives: ["restore the song of the crystal bells", "sort the color keys before the lanterns dim", "help a lost echo find its cave door", "repair the gem bridge for the festival parade"],
    helpers: ["glow-worm guide", "crystal badger", "echo sprite", "lantern mole"],
    details: ["crystals chime when clues match", "soft lights ripple across the stone", "tiny echoes repeat helpful words", "gem dust sparkles like safe confetti"],
    avoid: "cave-ins, darkness panic, realistic danger, injury",
  },
  "Clockwork City": {
    settings: ["a city of friendly gears", "a clock tower market", "a brass bridge over a winding canal", "a robot parade workshop"],
    objectives: ["restart the kindness clock", "help the parade robots find their rhythm", "sort the mixed-up gear tickets", "repair the bell that announces helpful ideas"],
    helpers: ["clockwork pigeon", "robot baker", "gear librarian", "spring-powered squirrel"],
    details: ["gears click in cheerful patterns", "steam puffs make cloud shapes", "brass signs flip toward clues", "tiny bells ding after brave choices"],
    avoid: "explosions, burns, dangerous machinery, injury",
  },
  "Jungle Ruins": {
    settings: ["sunny ruins wrapped in vines", "a treehouse beside old puzzle stones", "a flower-covered temple courtyard", "a mossy staircase with friendly signs"],
    objectives: ["match the mural leaves", "wake the garden fountain", "guide the festival animals to the safe courtyard", "return a sun tile to the kindness gate"],
    helpers: ["toucan mapkeeper", "leaf sprite", "gentle capybara", "frog drummer"],
    details: ["vines curl into arrows", "flowers open around good clues", "old stones glow softly", "butterflies carry tiny flags"],
    avoid: "predator attacks, injury, scary ruins, traps that hurt people",
  },
  "Undersea Kingdom": {
    settings: ["a pearl castle beneath calm waves", "a coral classroom", "a kelp garden maze", "a shell-lit town square"],
    objectives: ["tune the shell bells", "help lantern fish find the parade route", "repair the coral gate", "return a missing pearl bookmark"],
    helpers: ["sea turtle guide", "merfolk librarian", "puzzle crab", "lantern fish"],
    details: ["bubbles carry clues upward", "coral windows glow softly", "seaweed points like arrows", "shells hum when choices are kind"],
    avoid: "drowning, scary sea monsters, storms, injury",
  },
  "Moon Base Mystery": {
    settings: ["a friendly moon base garden", "a rover garage under glass", "a crater observatory", "a moon market of floating stalls"],
    objectives: ["find the missing rover key", "restart the constellation projector", "sort moon rocks for the science fair", "repair the beacon for visiting star friends"],
    helpers: ["rover pup", "moon moth", "robot botanist", "star-map keeper"],
    details: ["low gravity makes notebooks float", "buttons blink in moon colors", "crater dust sparkles softly", "stars seem to wink at clues"],
    avoid: "oxygen danger, crashes, scary aliens, realistic space emergencies",
  },
  "Enchanted Library": {
    settings: ["a library where books whisper politely", "a tower of floating shelves", "a reading room under a starry skylight", "a hallway of bookmark doors"],
    objectives: ["return a runaway chapter", "help the index cards find their shelves", "wake the sleepy story lantern", "solve why the map book keeps sneezing glitter"],
    helpers: ["bookmark fairy", "owl librarian", "book mouse", "talking magnifying glass"],
    details: ["pages flutter into arrows", "ink glows around clues", "shelves slide gently aside", "bookmarks bow like tiny flags"],
    avoid: "forbidden magic, scary books, punishment, horror",
  },
  "Candy Kingdom": {
    settings: ["a gumdrop castle courtyard", "a peppermint bridge", "a cupcake village square", "a licorice-road garden"],
    objectives: ["restore the festival sprinkles", "guide the cookie carts to the parade", "repair the candy clock", "find the missing recipe ribbon"],
    helpers: ["marshmallow messenger", "jellybean scout", "peppermint pony", "cupcake mayor"],
    details: ["everything is cartoon-sweet and not for eating anyone", "sugar crystals sparkle like stars", "candy signs wiggle toward clues", "frosting flowers bloom after kind choices"],
    avoid: "gross eating imagery, biting, chewing, stomach jokes, realistic danger",
  },
  "Dinosaur Valley": {
    settings: ["a sunny valley of gentle dinosaurs", "a fossil library", "a fern-covered river bend", "a dino egg nursery with friendly signs"],
    objectives: ["help the baby dinosaurs find the music trail", "sort fossil tiles for the museum", "repair the fern bridge", "return a lost footprint map"],
    helpers: ["tiny triceratops", "fossil fairy", "gentle brontosaurus", "dino librarian"],
    details: ["big footsteps sound like drums", "ferns wave toward clues", "fossils glow in safe patterns", "dinosaur friends rumble hello"],
    avoid: "predator attacks, injury, scary chases, extinction danger",
  },
  "Miniature Backyard Quest": {
    settings: ["a backyard where the hero is tiny", "a flowerpot village", "a garden hose river", "a birdhouse lookout tower"],
    objectives: ["repair the acorn elevator", "help ladybugs organize the map parade", "find the missing button wheel", "guide the dew-drop lanterns home"],
    helpers: ["ladybug scout", "button mouse", "friendly ant", "clover sprite"],
    details: ["grass blades tower like trees", "dew drops sparkle like crystal balls", "pebbles become stepping stones", "petals unfold like maps"],
    avoid: "being eaten, scary insects, injury, realistic animal danger",
  },
  "Rainbow Railway": {
    settings: ["a rainbow train station", "a cloud platform with glowing rails", "a ticket booth run by friendly sprites", "a bridge of colored light"],
    objectives: ["sort the color tickets", "help the train reach the festival stop", "repair the whistle that calls helpful clues", "find the missing conductor badge"],
    helpers: ["conductor fox", "ticket sprite", "cloud turtle", "paintbrush bird"],
    details: ["rails glow one color at a time", "tickets flutter toward clues", "the train hums a cheerful tune", "clouds puff into safe platforms"],
    avoid: "train crashes, falling danger, injury, scary speed",
  },
  "Pop Band Quest": {
    settings: ["a glittering rehearsal studio", "a backstage maze before the big show", "a rooftop concert stage under paper lanterns", "a music-video set full of colorful props"],
    objectives: ["help the crew find the missing chorus cue", "repair the glowing stage lights before showtime", "organize the dance cards for the final number", "bring the harmony badges back to the performance wall"],
    helpers: ["stage manager sprite", "rhythm robot", "backup dancer fox", "sparkle-light technician"],
    details: ["light sticks glow in safe rainbow patterns", "costume racks sparkle with storybook colors", "the beat board flashes cheerful clues", "fans are represented by friendly star-shaped lanterns"],
    avoid: "real celebrities, real music groups, romance, crushes, fame pressure, rivalry meanness, unsafe crowds, stage accidents",
  },
};

const GENRE_PROFILE_EXPANSIONS: Record<QuestGenre, Pick<GenreProfile, "settings" | "objectives" | "helpers" | "details">> = {
  Fantasy: {
    settings: ["a lantern-lit hedge maze", "a starlit dragon library", "a silver bridge over a whispering brook", "a meadow of floating spellbooks", "a mountain village of glowing windows", "a courtyard where banners sing softly", "a moonbeam ferry dock", "a willow grove with crystal doorways", "a festival tent beside a fairy ring", "a snow-dusted tower balcony"],
    objectives: ["find the crown-shaped key for the welcome gate", "help the moonbeam ferry remember its route", "restore color to the festival banners", "guide a lost lantern back to its post", "arrange the spellbook pages before twilight", "mend the silver bridge with puzzle stones", "wake the gentle fountain song", "return a wishing pebble to the brook", "help the banner choir practice safely", "match star charms to the tower windows"],
    helpers: ["moon rabbit courier", "banner sprite", "gentle griffin page", "lantern snail", "storybook raven", "willow dryad", "star-moth guide", "silver bridge keeper", "tiny unicorn messenger", "festival badger"],
    details: ["a crown-shaped shadow points toward a clue", "spellbook pages flutter into careful stacks", "moonbeams pool like silver stepping stones", "festival ribbons ripple without wind", "a fountain hums each time a clue fits", "mushroom lanterns blink in pairs", "a tiny bell rings from inside a flower", "crystal doorways show harmless reflections", "the bridge stones glow from left to right", "a banner bows toward the safest path"],
  },
  "Space Adventure": {
    settings: ["a solar garden with floating seed pods", "a friendly satellite repair bay", "a rainbow nebula rest stop", "a star chart classroom", "a comet greenhouse", "a rover race practice track", "a moon-cake bakery dome", "a constellation museum", "a quiet space elevator lobby", "an orbiting playground under glass"],
    objectives: ["realign the friendly satellite mirrors", "help the comet greenhouse open its shutters", "find the missing rover parade flag", "sort constellation cards for the museum", "guide a moon-cake delivery cart", "restart the starlight weather vane", "repair the zero-gravity pencil case", "match nebula badges to their stations", "help a visiting rover learn the route", "tune the star chart before launch bell"],
    helpers: ["satellite sparrow", "rover librarian", "nebula gardener", "moon-bakery helper", "star chart keeper", "comet snail", "orbit otter", "constellation curator", "zero-gravity pencil sprite", "elevator robot"],
    details: ["seed pods drift in neat orbit paths", "satellite mirrors shine harmless rainbow dots", "a rover beeps a polite clue", "constellation cards hover in tidy rows", "moon-cake trays float beside the counter", "the weather vane spins toward a safe hatch", "pencils drift into arrow shapes", "nebula badges glow by color family", "the elevator dings in star patterns", "a comet tail sketches a bright curve"],
  },
  Mystery: {
    settings: ["a theater lobby after rehearsal", "a bakery with missing recipe cards", "a clock shop full of ticking clues", "a greenhouse where labels shuffled themselves", "a town square during a lantern festival", "a toy museum with mixed-up exhibit tags", "a quiet observatory with hidden star notes", "a boardwalk booth of puzzle prizes", "a school art room with wandering paintbrushes", "a cozy inn with numbered room keys"],
    objectives: ["discover why the recipe cards changed places", "find the owner of the sparkling theater ticket", "solve which clock is chiming early", "return mixed-up plant labels to their pots", "match lantern messages to the right posts", "find the missing toy exhibit tag", "decode the star notes before moonrise", "sort puzzle prizes for the booth", "help the paintbrushes find their jars", "match room keys to the cozy inn map"],
    helpers: ["theater kitten", "recipe-card fairy", "clock shop apprentice", "greenhouse beetle", "lantern festival guide", "toy curator mouse", "observatory owl", "boardwalk puzzle keeper", "paintbrush sprite", "innkeeper rabbit"],
    details: ["a ticket stub sparkles near the clue board", "recipe cards smell faintly of cinnamon", "one clock ticks in a funny rhythm", "plant labels line up like suspects", "lantern messages glow only when paired", "toy wheels point toward the next shelf", "star notes form a secret pattern", "prize ribbons flutter toward the booth", "paint drops make dotted trails", "room keys hum when near their doors"],
  },
  "Pirate Adventure": {
    settings: ["a lighthouse island with friendly flags", "a tidepool map school", "a sunny deck full of puzzle ropes", "a shell market at low tide", "a cheerful ship repair dock", "a palm grove with compass flowers", "a sandcastle harbor", "a rainbow sail workshop", "a treasure picnic on the beach", "a floating bottle-message post office"],
    objectives: ["find the missing lighthouse flag", "sort tidepool map shells", "untangle the puzzle ropes before lunch", "deliver shell coins to the market stalls", "repair the cheerful ship bell", "match compass flowers to map corners", "help the sandcastle harbor open its gates", "sew rainbow sail patches in order", "share beach treasure tokens fairly", "return bottle messages to their docks"],
    helpers: ["lighthouse gull", "map-school crab", "rope-knot fairy", "shell merchant turtle", "dock carpenter otter", "compass flower sprite", "sandcastle builder mouse", "rainbow sailmaker", "picnic parrot", "message-bottle dolphin"],
    details: ["friendly flags snap into clue shapes", "tidepool shells arrange themselves by color", "ropes coil into harmless loops", "shell coins clink in tidy stacks", "the ship bell rings when a patch fits", "compass flowers turn toward safe paths", "sand towers sparkle under the sun", "sail cloth flutters like a map", "treasure tokens shine like buttons", "bottle corks pop with gentle chimes"],
  },
  "Jungle Adventure": {
    settings: ["a canopy bridge classroom", "a fruit grove with singing signs", "a butterfly counting trail", "a sunny river bend with stepping stones", "a treetop library", "a waterfall garden with rainbow mist", "a vine-wrapped lookout platform", "a seed festival clearing", "a hollow-log map room", "a flower clock meadow"],
    objectives: ["repair the canopy bridge signs", "help the fruit grove remember its song", "guide butterflies to the counting trail", "arrange river stones into a safe path", "return a map leaf to the treetop library", "wake the waterfall garden chimes", "fix the lookout's leaf telescope", "sort seed packets for the festival", "find the hollow-log map marker", "set the flower clock for parade time"],
    helpers: ["canopy squirrel", "fruit-song toucan", "butterfly guide", "river pebble frog", "treetop librarian sloth", "waterfall hummingbird", "lookout monkey", "seed festival beetle", "map-room moth", "flower clock gecko"],
    details: ["bridge signs swing into arrow shapes", "fruit trees hum gentle notes", "butterflies land in careful groups", "river stones glow when counted", "a leaf map unfolds by itself", "rainbow mist reveals dotted clues", "the leaf telescope shows a bright marker", "seed packets rustle in patterns", "a hollow log echoes helpful hints", "flower petals open like clock hands"],
  },
  "Underwater Adventure": {
    settings: ["a bubble elevator in reef city", "a sea-star classroom", "a tide calendar hall", "a jellyfish lantern garden", "a calm shipwreck museum", "a coral music pavilion", "a pearl post office", "a shell bakery plaza", "a kelp ribbon racetrack", "a moonlit lagoon gate"],
    objectives: ["fix the bubble elevator buttons", "help sea-star students sort their charts", "match tide calendar shells", "relight the jellyfish lanterns", "return museum labels to safe displays", "tune coral instruments for the parade", "deliver pearl postcards", "find the shell bakery's recipe ribbon", "set kelp ribbons along the race path", "open the lagoon gate for lantern fish"],
    helpers: ["bubble elevator squid", "sea-star teacher", "tide calendar crab", "jellyfish lantern keeper", "museum seahorse", "coral musician ray", "pearl post turtle", "shell baker snail", "kelp ribbon eel", "lagoon dolphin guide"],
    details: ["bubbles rise in numbered columns", "sea stars point to chart corners", "calendar shells click into place", "jellyfish lights pulse softly", "museum labels float in gentle rows", "coral pipes play tiny notes", "pearl postcards shimmer in stacks", "recipe ribbons curl like seaweed", "kelp ribbons wave in safe lanes", "lagoon gates glow with moon colors"],
  },
  "Sky Islands": {
    settings: ["a cloud bakery above the valley", "a kite workshop on a floating hill", "a sky library with feather bookmarks", "a bell tower island", "a rainbow weather station", "a floating garden of balloon flowers", "a cloud sheep pasture", "a sky ferry terminal", "a wind-chime bridge", "a sunrise observatory"],
    objectives: ["deliver cloud rolls to the festival cart", "repair the kite workshop pattern board", "return feather bookmarks to the shelves", "ring the bell tower in the right order", "sort rainbow weather cards", "tie balloon flowers safely to their stems", "guide cloud sheep to the pasture gate", "help the sky ferry find its schedule", "tune the wind-chime bridge", "aim the sunrise telescope at the first clue"],
    helpers: ["cloud baker", "kite fox", "feather librarian", "bell tower moth", "weather sprite", "balloon flower bee", "cloud sheepdog", "ferry turtle", "wind-chime sparrow", "sunrise astronomer"],
    details: ["cloud rolls puff into soft arrows", "kite tails draw bright patterns", "feather bookmarks drift to open pages", "bells glow after each correct ring", "weather cards shuffle by color", "balloon flowers bob gently", "cloud sheep leave hoof-shaped mist", "the ferry schedule folds into a map", "wind chimes answer in twos", "sunrise light paints the clue gold"],
  },
  "Clockwork / Invention": {
    settings: ["a button-powered idea lab", "a music-box repair bench", "a gear garden greenhouse", "a blueprint library", "a safe steam carousel", "a robot pet adoption booth", "a pulley tower classroom", "a spring-loaded message station", "a brass telescope balcony", "a clockwork puppet theater"],
    objectives: ["connect the idea lab buttons", "repair the music-box melody wheel", "sort gear garden seed cogs", "return blueprints to their shelves", "help the steam carousel turn gently", "teach robot pets the parade route", "balance pulleys for the classroom flag", "send spring messages in the right order", "focus the brass telescope", "help puppet gears bow for curtain call"],
    helpers: ["button beetle", "music-box mouse", "gear gardener", "blueprint librarian", "carousel snail", "robot puppy trainer", "pulley professor", "spring messenger", "telescope cricket", "puppet theater sprite"],
    details: ["buttons blink in friendly pairs", "melody wheels spin with soft chimes", "seed cogs sprout paper leaves", "blueprints fold into helpful arrows", "steam puffs spell no words, only shapes", "robot pets wag metal tails", "pulleys rise in smooth patterns", "spring messages bounce into slots", "the telescope lens glows amber", "puppet gears click like applause"],
  },
  "Ancient Ruins": {
    settings: ["a sun mosaic courtyard", "a column hall with echoing tiles", "a terraced garden above old steps", "a star map carved into stone", "a fountain plaza of gentle statues", "a sandstone puzzle library", "a bridge of painted blocks", "a mural room under a skylight", "a tablet workshop with soft brushes", "a festival arch with missing gems"],
    objectives: ["restore the sun mosaic pattern", "match echoing tiles to the column hall", "water the terraced garden channels", "complete the carved star map", "help statues find their fountain spots", "sort sandstone puzzle tablets", "arrange painted bridge blocks", "return colors to the mural room", "brush dust from tablet clues", "place missing gems in the festival arch"],
    helpers: ["mosaic lizard", "echo tile keeper", "garden tortoise", "star-map scarab", "fountain statue cub", "tablet librarian", "painted block mouse", "mural butterfly", "soft-brush sprite", "festival arch owl"],
    details: ["mosaic pieces warm in the sunlight", "tiles echo in repeating patterns", "water channels sparkle like ribbons", "stone stars brighten one by one", "statues point with polite paws", "tablet grooves catch golden dust", "painted blocks glow at the edges", "mural colors ripple safely", "brushes sweep dust into clue lines", "arch gems hum in color order"],
  },
  "Spooky Mystery / Friendly Ghosts": {
    settings: ["a pumpkin-lit reading nook", "a silly shadow puppet stage", "a moon-cookie bakery", "a friendly attic of floating scarves", "a lantern garden behind the manor", "a cozy tower with creaky-but-kind stairs", "a ghost pet grooming room", "a glow-in-the-dark puzzle parlor", "a costume closet with helpful labels", "a midnight mailbox lane"],
    objectives: ["help the pumpkin lanterns line up", "match shadow puppets to their scripts", "find the moon-cookie recipe card", "guide floating scarves back to hooks", "relight the lantern garden path", "help stairs remember their song", "find the ghost pet's ribbon", "solve the glowing parlor pattern", "sort costume labels kindly", "deliver midnight mailbox notes"],
    helpers: ["pumpkin lantern keeper", "shadow puppet rabbit", "moon-cookie baker", "scarf ghost", "lantern gardener", "staircase sprite", "ghost pet kitten", "glow-parlor mouse", "costume closet moth", "mailbox owl"],
    details: ["pumpkins grin without being scary", "shadows wave like paper cutouts", "moon cookies sparkle with sugar stars", "scarves float in gentle loops", "lanterns bob along the path", "stairs creak in a friendly rhythm", "a ghost pet purrs like wind chimes", "glowing tiles blink slowly", "costume tags twirl on strings", "mailboxes open with polite squeaks"],
  },
  "Tiny World": {
    settings: ["a thimble theater", "a pencil-box workshop", "a button bridge over a puddle", "a strawberry leaf campsite", "a clock face plaza under glass", "a paperclip climbing park", "a spool tower neighborhood", "a marble pond beside the path", "a lunchbox balcony village", "a shoebox train station"],
    objectives: ["repair the thimble theater curtain", "sort pencil-box tools", "guide carts across the button bridge", "raise tents at the strawberry leaf campsite", "set the clock face plaza markers", "help climbers place paperclip rails", "deliver mail to spool towers", "find the marble pond ripple clue", "organize lunchbox balcony flags", "repair the shoebox train timetable"],
    helpers: ["thimble stagehand", "pencil-box beetle", "button bridge mouse", "strawberry leaf camper", "clock face cricket", "paperclip climber", "spool tower swallowtail", "marble pond froglet", "lunchbox flag sprite", "shoebox conductor"],
    details: ["thread curtains shimmer like banners", "tiny tools line up by size", "buttons wobble into bridge steps", "leaf tents glow in the sun", "clock numbers cast long shadows", "paperclips gleam like rails", "spools stack into bright towers", "marble ripples reveal circles", "flags snap from toothpick poles", "shoebox tracks curve around erasers"],
  },
  "Magical School": {
    settings: ["a potion garden classroom", "a floating homework hallway", "a constellation cafeteria", "a library of whispering lockers", "a broom practice courtyard", "a kindness trophy room", "a chalk river bridge", "a spell-safe art studio", "a musical staircase landing", "a moonlit school greenhouse"],
    objectives: ["sort potion garden labels", "catch floating homework pages", "help cafeteria stars find trays", "return locker whispers to the right doors", "line up practice brooms safely", "polish kindness trophies for assembly", "draw the chalk bridge path", "organize spell-safe paint jars", "tune the musical staircase notes", "wake greenhouse moonflowers"],
    helpers: ["potion garden snail", "homework page fairy", "cafeteria star sprite", "locker whisper owl", "broom coach cat", "trophy room beetle", "chalk river frog", "art studio dragonlet", "staircase songbird", "greenhouse moon-moth"],
    details: ["labels float over safe plants", "homework pages flap like birds", "star trays glow on the counter", "lockers hum in gentle chords", "brooms hover low and slow", "trophies shine with warm light", "chalk lines ripple like water", "paint jars sparkle without spilling", "stairs sing one note at a time", "moonflowers open with soft clicks"],
  },
  "Snack Escape": {
    settings: ["a cereal-box canyon", "a cookie tin clubhouse", "a fruit bowl lookout tower", "a sandwich tray bridge", "a jelly jar lighthouse", "a muffin wrapper tunnel", "a pancake stack staircase", "a teacup harbor", "a cracker path across a napkin", "a lunchbox stage with paper flags"],
    objectives: ["guide the cereal carts to the safe shelf", "find the cookie tin clubhouse key", "signal from the fruit bowl tower", "repair the sandwich tray bridge", "relight the jelly jar lighthouse", "map the muffin wrapper tunnel", "climb the pancake staircase carefully", "sail a spoon boat to teacup harbor", "mark cracker paths with crumb flags", "help the lunchbox stage crew prepare"],
    helpers: ["cereal square scout", "cookie tin mouse", "grape balloon guide", "sandwich flag sprite", "jelly jar firefly", "muffin wrapper mole", "pancake stairkeeper", "spoon boat captain", "cracker path beetle", "paper flag stagehand"],
    details: ["cereal pieces stack like blocks", "cookie tin lids shine like shields", "fruit stickers become tiny signs", "sandwich flags point away from danger", "jelly glass glows amber", "wrapper ridges form tunnels", "pancake steps smell sweet and safe", "teacup waves barely ripple", "cracker crumbs form dotted lines", "paper flags flutter above the stage"],
  },
  "Crystal Caverns": {
    settings: ["an amethyst music hall", "a quartz staircase chamber", "a sapphire lantern dock", "a ruby reflection pool", "a moonstone map room", "a crystal mushroom grove", "a prism elevator shaft", "an opal bridge checkpoint", "a glowstone workshop", "a geode theater"],
    objectives: ["tune the amethyst music hall", "repair quartz stair markers", "guide lanterns to the sapphire dock", "match reflections in the ruby pool", "restore the moonstone map route", "help crystal mushrooms ring safely", "restart the prism elevator", "align opal bridge colors", "sort glowstone tools", "prepare the geode theater curtain"],
    helpers: ["amethyst song sprite", "quartz stair mouse", "sapphire dock mole", "ruby pool echo", "moonstone cartographer", "crystal mushroom beetle", "prism elevator snail", "opal bridge keeper", "glowstone tinkerer", "geode stage moth"],
    details: ["amethyst notes shimmer in arcs", "quartz steps blink from bottom to top", "sapphire lanterns float in rows", "ruby reflections ripple kindly", "moonstone maps glow at the edges", "crystal mushrooms ping softly", "prism light splits into safe colors", "opal tiles brighten underfoot", "glowstone tools hum on shelves", "geode curtains sparkle inside"],
  },
  "Clockwork City": {
    settings: ["a gear-bus depot", "a brass fountain plaza", "a clockmaker's rooftop garden", "a spring-powered bakery street", "a copper bridge crossing", "a dial-filled message office", "a robot orchestra square", "a tick-tock toy shop", "a windup library lift", "a pocket-watch park"],
    objectives: ["sort gear-bus tickets", "restart the brass fountain pattern", "water rooftop gear flowers", "help bakery trays roll safely", "match copper bridge dials", "deliver dial messages", "tune the robot orchestra", "repair toy shop windup keys", "send the library lift to the right floor", "set pocket-watch park chimes"],
    helpers: ["gear-bus driver", "fountain gearfish", "rooftop gardener beetle", "bakery tray robot", "copper bridge fox", "message office spring", "robot conductor", "toy shop cricket", "library lift owl", "watch park squirrel"],
    details: ["tickets punch themselves into patterns", "fountain gears splash harmless light", "gear flowers open with tiny clicks", "trays roll along safe rails", "bridge dials point to symbols", "messages pop from brass tubes", "robot instruments flash softly", "windup keys turn with cheerful clicks", "lift buttons glow by floor", "watch hands sweep toward clues"],
  },
  "Jungle Ruins": {
    settings: ["a vine-covered sundial court", "a parrot mosaic wall", "a fern library under arches", "a rain-drum amphitheater", "a hidden orchid staircase", "a monkey puzzle bridge", "a leaf-roofed map shelter", "a golden seed vault", "a butterfly mural plaza", "a river-stone clue path"],
    objectives: ["reset the sundial court stones", "repair the parrot mosaic", "return fern scrolls to the arches", "tune the rain drums", "find the orchid staircase markers", "help the puzzle bridge unfold", "restore the map shelter compass", "sort golden seed tokens", "complete the butterfly mural", "line up river stones to the clue path"],
    helpers: ["sundial lizard", "mosaic parrot", "fern scroll sloth", "rain-drum frog", "orchid stair sprite", "bridge monkey guide", "map shelter moth", "seed vault turtle", "butterfly mural keeper", "river-stone crab"],
    details: ["sundial shadows point gently", "mosaic feathers shine in patterns", "fern scrolls unfurl like maps", "drums tap a soft code", "orchids glow beside each step", "bridge planks swing safely into place", "compass leaves spin slowly", "seed tokens clink in rows", "butterfly wings show colors", "river stones shimmer after counting"],
  },
  "Undersea Kingdom": {
    settings: ["a royal bubble ballroom", "a seahorse courier lane", "a coral crown workshop", "a moonpool storytelling stage", "a starfish map gallery", "a pearl elevator tower", "a gentle whale-song theater", "a kelp ribbon classroom", "a tidepool throne garden", "a shell trumpet balcony"],
    objectives: ["arrange bubble ballroom lights", "deliver seahorse courier notes", "repair the coral crown pattern", "prepare the moonpool story stage", "match starfish maps to routes", "send the pearl elevator upward", "tune whale-song echoes softly", "sort kelp ribbons by clue", "restore throne garden shells", "practice shell trumpet calls"],
    helpers: ["bubble ballroom dancer", "seahorse courier", "coral crown smith", "moonpool storyteller", "starfish mapkeeper", "pearl elevator eel", "whale-song guide", "kelp ribbon teacher", "throne garden turtle", "shell trumpet crab"],
    details: ["bubbles waltz in gentle circles", "courier notes float in tubes", "crown pieces glow when matched", "moonpool ripples show images", "starfish maps turn slowly", "pearls light floor by floor", "echoes pulse like soft drums", "kelp ribbons wave in order", "garden shells shine pastel colors", "trumpet shells hum tiny notes"],
  },
  "Moon Base Mystery": {
    settings: ["a moon greenhouse classroom", "a crater ticket booth", "a solar panel garden", "a rover wash station", "a lunar library dome", "a meteorite sorting lab", "a moon-paint art studio", "a star-viewing cafeteria", "a robot mail tunnel", "a silver dust playground"],
    objectives: ["find the greenhouse moonseed labels", "sort crater tickets", "align solar panel flowers", "help rovers line up for washing", "return lunar library cards", "sort meteorites for the display", "mix safe moon-paint colors", "arrange star-viewing trays", "deliver robot mail capsules", "trace silver dust clue tracks"],
    helpers: ["greenhouse rover", "crater ticket moth", "solar panel snail", "rover wash robot", "lunar librarian", "meteorite lab mouse", "moon-paint sprite", "cafeteria star keeper", "mail tunnel bot", "silver dust fox"],
    details: ["moonseed labels glow pale green", "tickets float in low gravity", "solar panels tilt like petals", "rovers beep in line", "library cards hover over shelves", "meteorites sparkle safely in trays", "paint jars shimmer like moonlight", "cafeteria trays orbit slowly", "mail capsules click through tubes", "dust tracks curl into arrows"],
  },
  "Enchanted Library": {
    settings: ["a spiral stair of floating books", "a dictionary garden", "a candlelit map alcove", "a pop-up book meadow", "a bookmark repair desk", "a quiet shelf maze", "a moon-window reading balcony", "a story lantern workshop", "an index-card aviary", "a glossary gate"],
    objectives: ["return floating books to the spiral stair", "help dictionary flowers bloom in order", "complete the candlelit map", "fold the pop-up meadow safely", "repair bookmark ribbons", "find the shelf maze route", "open the moon-window balcony", "relight story lanterns", "guide index cards to their nests", "unlock the glossary gate"],
    helpers: ["spiral stair bookworm", "dictionary gardener", "map alcove moth", "pop-up meadow rabbit", "bookmark repair fairy", "shelf maze mouse", "moon-window owl", "story lantern beetle", "index-card finch", "glossary gate sprite"],
    details: ["books hover like stepping stones", "dictionary flowers spell no words, only colors", "map candles flicker toward clues", "paper hills rise gently", "bookmark ribbons curl into arrows", "shelves slide aside politely", "moonlight paints a path", "lanterns glow page by page", "index cards flap like wings", "gate hinges hum with ink"],
  },
  "Candy Kingdom": {
    settings: ["a lollipop lantern lane", "a caramel clock tower", "a sherbet snow garden", "a taffy bridge workshop", "a candy-cane music hall", "a sprinkle sorting plaza", "a gingerbread map cottage", "a gumdrop train depot", "a cocoa fountain square", "a sugar crystal observatory"],
    objectives: ["relight lollipop lanterns", "set the caramel clock chimes", "guide sherbet snowflakes into patterns", "repair the taffy bridge rails", "tune candy-cane music notes", "sort sprinkles for the parade", "find the gingerbread map pin", "help gumdrop trains choose tracks", "restore cocoa fountain sparkle", "aim the sugar crystal telescope"],
    helpers: ["lollipop lantern sprite", "caramel clock snail", "sherbet snow fairy", "taffy bridge turtle", "candy-cane musician", "sprinkle sorter bee", "gingerbread map mouse", "gumdrop conductor", "cocoa fountain frog", "sugar crystal astronomer"],
    details: ["lantern sticks glow softly", "clock hands drip harmless caramel shapes", "sherbet flakes twirl by color", "taffy rails stretch into place", "music notes sparkle without words", "sprinkles line up in tiny rows", "map icing forms arrows", "gumdrop wheels roll slowly", "cocoa bubbles pop into stars", "crystals reflect rainbow dots"],
  },
  "Dinosaur Valley": {
    settings: ["a fossil music meadow", "a fern bridge school", "a gentle dino parade route", "a volcano-shaped art studio with cool clay", "a footprint map trail", "a river pebble nursery", "a sunny bone puzzle museum", "a tall fern lookout", "a shell fossil workshop", "a valley drum circle"],
    objectives: ["tune fossil music stones", "repair fern bridge signs", "guide the dino parade flags", "shape cool clay decorations safely", "complete the footprint map", "sort river pebbles for the nursery", "match bone puzzle pieces", "raise the lookout leaf flag", "clean shell fossil displays", "practice valley drum patterns"],
    helpers: ["fossil music fairy", "fern bridge stegosaurus", "parade flag triceratops", "clay studio lizard", "footprint map keeper", "river pebble turtle", "museum brontosaurus", "lookout pterosaur kite", "shell fossil beetle", "drum circle dino"],
    details: ["fossil stones ring softly", "fern signs point with leaf tips", "flags wave beside gentle footsteps", "cool clay glows in safe colors", "footprints fill with sunlight", "pebbles sort into circles", "bone pieces click like puzzle tiles", "leaf flags flutter high above", "shell spirals sparkle gently", "drums thump in friendly patterns"],
  },
  "Miniature Backyard Quest": {
    settings: ["a clover tunnel village", "a garden glove castle", "a watering-can waterfall", "a snail-shell library", "a birdbath island market", "a sunflower ladder lookout", "a toy shovel bridge", "a seed packet archive", "a sidewalk chalk plaza", "a picnic blanket horizon"],
    objectives: ["open the clover tunnel gate", "repair the garden glove flag", "guide boats past the watering-can falls", "return books to the snail-shell library", "sort island market pebbles", "climb sunflower ladder clues", "steady the toy shovel bridge", "file seed packet maps", "complete the chalk plaza route", "find the picnic blanket compass corner"],
    helpers: ["clover tunnel beetle", "garden glove mouse", "watering-can skipper", "snail-shell librarian", "birdbath market frog", "sunflower lookout bee", "toy shovel ant", "seed packet archivist", "chalk plaza cricket", "picnic blanket moth"],
    details: ["clover leaves fold into doors", "glove fingers become towers", "water drops sparkle like lanterns", "shell shelves curve in spirals", "pebbles trade places politely", "sunflower seeds mark steps", "toy shovel metal shines like a bridge", "seed packets rustle with maps", "chalk lines glow pastel", "blanket threads look like roads"],
  },
  "Rainbow Railway": {
    settings: ["a prism tunnel station", "a paint-splash repair yard", "a cloud ticket carousel", "a color-switch bridge", "a lantern car depot", "a rainbow dining car", "a conductor's map room", "a weather-window caboose", "a sparkle signal tower", "a festival platform at sunset"],
    objectives: ["set the prism tunnel colors", "repair paint-splash wheels", "sort cloud carousel tickets", "switch bridge colors in order", "load lantern cars safely", "arrange dining car color plates", "finish the conductor's map", "clean weather-window clues", "relight the signal tower", "prepare the sunset platform banner"],
    helpers: ["prism tunnel sprite", "paint yard mechanic", "cloud ticket rabbit", "color-switch turtle", "lantern car fox", "dining car firefly", "map room conductor", "weather-window moth", "signal tower snail", "festival platform painter"],
    details: ["prism walls scatter soft color", "paint drops hop into buckets", "tickets spin on cloud hooks", "bridge lights change slowly", "lantern cars glow from inside", "plates line up by rainbow order", "maps unfold across the table", "windows show tiny weather symbols", "signals blink in three colors", "banners ripple over the platform"],
  },
  "Pop Band Quest": {
    settings: ["a mirror-lined dance practice room", "a costume sparkle workshop", "a light-stick design booth", "a harmony rehearsal lounge", "a backstage prop tunnel", "a rooftop fan-lantern plaza", "a rhythm-game practice corner", "a touring bus map table", "a music award rehearsal stage", "a friendship encore platform"],
    objectives: ["find the missing beat card", "sort costume charms before curtain call", "match light-stick colors to stage cues", "help the harmony board glow in order", "guide props to their safe marks", "prepare lanterns for the rooftop finale", "set rhythm tiles for practice", "map the tour route stops", "repair the award stage sparkle arch", "plan the friendship encore pose"],
    helpers: ["dance captain sprite", "costume charm keeper", "light-stick engineer", "harmony board robot", "prop tunnel fox", "lantern plaza guide", "rhythm tile mouse", "tour map turtle", "sparkle arch technician", "encore stage manager"],
    details: ["mirrors reflect only colorful lights", "costume charms twinkle on ribbons", "light sticks pulse in safe patterns", "harmony tiles brighten one by one", "props roll gently to taped marks", "lanterns float like tiny stars", "rhythm tiles blink to a cheerful beat", "map pins sparkle at each stop", "the sparkle arch glows without words", "the encore platform shines under warm lights"],
  },
};

function expandGenreProfiles(
  baseProfiles: Record<QuestGenre, GenreProfile>,
  expansions: Record<QuestGenre, Pick<GenreProfile, "settings" | "objectives" | "helpers" | "details">>,
): Record<QuestGenre, GenreProfile> {
  return Object.fromEntries(
    (Object.keys(baseProfiles) as QuestGenre[]).map((genre) => {
      const baseProfile = baseProfiles[genre];
      const expansion = expansions[genre];
      return [
        genre,
        {
          ...baseProfile,
          settings: [...baseProfile.settings, ...expansion.settings],
          objectives: [...baseProfile.objectives, ...expansion.objectives],
          helpers: [...baseProfile.helpers, ...expansion.helpers],
          details: [...baseProfile.details, ...expansion.details],
        },
      ];
    }),
  ) as Record<QuestGenre, GenreProfile>;
}

const GENRE_PROFILES = expandGenreProfiles(BASE_GENRE_PROFILES, GENRE_PROFILE_EXPANSIONS);

const QUEST_GENRES = Object.keys(GENRE_PROFILES) as QuestGenre[];
export const ALLOWED_ADVENTURE_SEEDS = [SURPRISE_GENRE, ...QUEST_GENRES] as const;

const DIFFICULTY_READING_GUIDANCE: Record<string, { gradeBand: 3 | 4 | 5; guidance: string; sceneWords: string; endingWords: string }> = {
  easy: {
    gradeBand: 3,
    guidance: "Aim for Grade 3 readability: short sentences, concrete action, familiar vocabulary, and clear cause-and-effect. Use 80-120 words.",
    sceneWords: "80-120 words",
    endingWords: "110-140 words",
  },
  medium: {
    gradeBand: 4,
    guidance: "Aim for Grade 4 readability: moderate sentences, vivid but clear vocabulary, and one strong story development per scene. Use 100-150 words.",
    sceneWords: "100-150 words",
    endingWords: "120-160 words",
  },
  hard: {
    gradeBand: 5,
    guidance: "Aim for Grade 5 readability: richer description, varied sentence structure, and clear emotional stakes without becoming dense. Use 130-190 words.",
    sceneWords: "130-190 words",
    endingWords: "140-190 words",
  },
  extreme: {
    gradeBand: 5,
    guidance: "Aim for upper Grade 5 readability: layered clues and slightly more advanced vocabulary, but keep the tone elementary, concrete, and kid-friendly. Use 140-200 words.",
    sceneWords: "140-200 words",
    endingWords: "150-200 words",
  },
};

export function getReadingGuidance(difficulty: string) {
  return DIFFICULTY_READING_GUIDANCE[difficulty.trim().toLowerCase()] ?? DIFFICULTY_READING_GUIDANCE.medium;
}

function getPopBandCrewLabel(pronouns: string) {
  const normalized = pronouns.trim().toLowerCase();
  if (normalized === "she/her") return "girl group";
  if (normalized === "he/him") return "boy band";
  return "pop crew";
}

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function countQuestOpeningCombinations() {
  return QUEST_GENRES.reduce((total, genre) => {
    const profile = GENRE_PROFILES[genre];
    return (
      total +
      profile.settings.length *
        profile.objectives.length *
        profile.helpers.length *
        profile.details.length
    );
  }, 0);
}

export function resolveSeed(adventureSeed: string) {
  const requested =
    adventureSeed === SURPRISE_GENRE || !(adventureSeed in GENRE_PROFILES)
      ? pickOne(QUEST_GENRES)
      : (adventureSeed as QuestGenre);
  const profile = GENRE_PROFILES[requested];

  return {
    name: requested,
    genre: requested,
    setting: pickOne(profile.settings),
    objective: pickOne(profile.objectives),
    helpers: pickOne(profile.helpers),
    detail: pickOne(profile.details),
    avoid: profile.avoid,
  };
}

function buildPacingBeats(maxTurns: number) {
  if (maxTurns <= 8) {
    return [
      "Chapters 1-2: introduce the place, the central problem, and a helpful clue.",
      "Chapters 3-5: reveal a complication and make the chosen actions visibly matter.",
      "Chapters 6-7: move into the climax and bring back important established details.",
      "Chapter 8: prepare the final resolution without ending early.",
    ];
  }

  if (maxTurns <= 12) {
    return [
      "Chapters 1-3: introduce the place, the central problem, and first clue.",
      "Chapters 4-7: deepen the mystery with discoveries, helpers, and complications.",
      "Chapters 8-10: connect earlier choices to the path forward and raise urgency.",
      "Chapters 11-12: set up the final resolution without resolving before the ending.",
    ];
  }

  return [
    "Chapters 1-4: introduce the world, the central problem, helpers, and early clues.",
    "Chapters 5-9: develop complications and let choices create visible consequences.",
    "Chapters 10-13: connect clues, revisit key story elements, and build toward the climax.",
    "Chapters 14-16: bring the quest to the threshold of its resolution without ending early.",
  ];
}

export function createEpisodePlan(data: StartGameData): EpisodePlan {
  const seed = resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);
  const lengthLabel = getQuestLengthLabel(data.maxTurns);
  const popBandCrewLabel = getPopBandCrewLabel(hero.pronouns);

  return {
    episodeTitle: `${seed.name}: ${hero.name}'s ${lengthLabel}`,
    genre: seed.genre,
    centralProblem: seed.objective,
    heroGoal: `${hero.name} must help solve the problem in ${seed.setting} by making brave, kind, and clever choices.`,
    stakes: "If the hero does nothing, the magical place will remain tangled or unfinished, but no one should be harmed.",
    keyStoryElements: [
      `Genre: ${seed.genre}`,
      `Setting: ${seed.setting}`,
      `Objective: ${seed.objective}`,
      `Possible helpers: ${seed.helpers}`,
      `Opening detail: ${seed.detail}`,
      `Avoid: ${seed.avoid}`,
      `Hero flavor: ${hero.name} is a ${hero.ancestry} ${hero.className}.`,
      ...(seed.genre === "Pop Band Quest"
        ? [`Pop Band Quest flavor: frame the main performance crew as a ${popBandCrewLabel}. Keep the story about teamwork, rehearsals, stage clues, costumes, light sticks, choreography, and joyful performance. Do not reference real bands, real idols, K-pop brands, romance, crushes, fame pressure, or fan behavior.`]
        : []),
    ],
    intendedResolution: `${hero.name} should resolve "${seed.objective}" in a joyful, classroom-safe way during the ending, using clues and choices established earlier.`,
    pacingBeats: buildPacingBeats(data.maxTurns),
    readingGuidance: reading.guidance,
    opening: seed,
  };
}

function formatEpisodePlan(plan?: EpisodePlan) {
  if (!plan) return "No episode plan was found. Rebuild a simple safe quest from the seed and keep continuity tight.";
  return [
    `Episode title: ${plan.episodeTitle}`,
    `Central problem: ${plan.centralProblem}`,
    `Hero goal: ${plan.heroGoal}`,
    `Stakes: ${plan.stakes}`,
    `Key story elements:\n- ${plan.keyStoryElements.join("\n- ")}`,
    `Intended resolution: ${plan.intendedResolution}`,
    `Pacing beats:\n- ${plan.pacingBeats.join("\n- ")}`,
    `Reading guidance: ${plan.readingGuidance}`,
  ].join("\n");
}

function formatStoryHistory(storyHistory?: string) {
  const trimmed = storyHistory?.trim();
  return trimmed ? trimmed : "No full story history was provided. Use the summary and chosen action carefully.";
}

const SYSTEM_PROMPT = `You are the story engine for MathQuest Live, a classroom-safe math adventure game for 3rd to 5th grade students ages 8-11. Write short, exciting, kid-safe scenes.

IMPORTANT RULES:
- This is for a 3rd to 5th grade classroom. All content must be safe and appropriate.
- No gore, graphic violence, death, romance, profanity, horror, or realistic weapons harming people
- No bullying or stereotypes
- No real-world politics or religion
- No drugs, alcohol, smoking, or vaping
- No sexual content
- No self-harm
- No asking for names, addresses, phone numbers, emails, school names, locations, or any personal information
- Allowed: cartoon adventure danger, puzzles, magical obstacles, friendly creatures, storms, locked doors, mysteries
- Problems resolved through: math, observation, kindness, creativity, teamwork, courage
- Ancestry/species only affects appearance and fantasy flavor — never implies intelligence or ability
- If the hero is a Mango, describe them as a cheerful whimsical fruit-shaped adventurer with cartoon-safe charm; never use gross, creepy, body-horror, or realistic eating imagery.
- If the genre is Snack Escape, frame it as silly cartoon picnic or cafeteria chaos with distant hungry giants/humans; never use cannibalism, horror, biting, chewing, injury, gore, or realistic predator danger.
- If the genre is Pop Band Quest, use the episode plan's crew label: girl group for she/her, boy band for he/him, pop crew otherwise. Keep it inspired by upbeat pop performance energy without naming or copying real artists, real groups, K-pop brands, songs, lyrics, choreography, fandoms, or celebrity likenesses.
- Pronouns only affect pronoun use in the story
- Write in fun, adventurous middle-grade tone like a fantasy novel
- The student can ONLY choose from buttons — no freeform input
- Do NOT generate math problems — the app handles all math separately
- Do NOT include HTML tags, XML tags, Markdown, or formatting tags of any kind
- For storyText and endingText, write plain text with short paragraphs separated by newline characters
- Break longer scenes into 2-4 short paragraphs so students do not see one large run-on block
- Do not use literal "<br>", "<p>", "<div>", or any other tag text
- Return ONLY valid JSON matching the required format
- safetyRating must always be "kid_safe"
- Provide EXACTLY 3 choices with ids "A", "B", "C"
- Each choice label must be under 90 characters
- The chosen action from the student must visibly change the next scene. Do not ignore it.
- New choices must be grounded in objects, helpers, clues, places, or problems that were explicitly established in the current scene.
- Each playable storyText should end with one brief in-world question inviting the next decision, such as asking what the hero should try next. Vary the wording and keep it forward-looking.
- The story-ending question must not mention math, benchmarks, standards, buttons, apps, or which choice is correct.
- Do not offer vague choices like "continue forward" unless the scene clearly supports that action.`;

export function buildStartPrompt(data: StartGameData, episodePlan = createEpisodePlan(data)): string {
  const seed = episodePlan.opening;
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters. The opening scene is not counted as a math-gated chapter.

EPISODE PLAN:
${formatEpisodePlan(episodePlan)}

This is the OPENING SCENE. Write ${reading.sceneWords}.

Your task: Write a vivid, immersive opening that does THREE things:
1. Introduces ${hero.name} as a character — give them personality, a brief backstory hint, and a reason why they are the right hero for this quest. Use their class and ancestry to flavor their appearance and style (appearance only, never personality or ability).
2. Sets the scene — paint a picture of where the adventure begins, using rich sensory details.
3. Launches the adventure — give them a clear quest goal.
4. End storyText with a short, natural question that invites the next choice, then provide exactly 3 action choices.

Make the student feel like they are stepping into the pages of a fantasy story. Use vivid, descriptive language. Refer to ${hero.name} by name and use ${hero.pronouns.split("/")[0]} pronouns correctly.
Each choice must clearly connect to a specific thing established in this opening scene, such as a helper, clue, doorway, tool, sound, map, or magical obstacle.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "${reading.sceneWords} of vivid, exciting opening story text",
  "choices": [
    { "id": "A", "label": "clear action under 90 chars" },
    { "id": "B", "label": "clear action under 90 chars" },
    { "id": "C", "label": "clear action under 90 chars" }
  ],
  "storySummary": "1-2 sentence summary of who the hero is and what happened",
  "safetyRating": "kid_safe"
}`;
}

export function buildTurnPrompt(data: TurnData): string {
  const seed = data.episodePlan?.opening ?? resolveSeed(data.adventureSeed);
  const hero = data.hero;
  const turnsLeft = data.maxTurns - data.turn;
  const reading = getReadingGuidance(data.difficulty);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
Avoid these twists: ${seed.avoid}

HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters.
Current story beat: Chapter ${data.turn} of ${data.maxTurns}. This number refers to successful math-gated chapters, not the intro.

EPISODE PLAN:
${formatEpisodePlan(data.episodePlan ?? createEpisodePlan(data))}

FULL STORY HISTORY:
${formatStoryHistory(data.storyHistory)}

SHORT STORY SUMMARY:
${data.storySummary}

The student chose: "${data.chosenAction}"
Math result: ${data.mathResult}
${data.lastMathSkill ? `Math skill flavor: The student just practiced ${data.lastMathSkill.skillLabel} (${data.lastMathSkill.storyFlavor}). You may echo this only as light story flavor, such as maps, gates, patterns, measures, or clever planning. Do not mention benchmark codes. Do not generate, solve, check, or explain math.` : ""}

Continue the adventure from where we left off. ${hero.name} solved the math challenge and can now act. Write ${reading.sceneWords} of exciting story. The first paragraph must show how the student's chosen action changes what happens next. ${turnsLeft <= 2 ? "The adventure is nearing its climax — bring back established clues and build urgently toward the intended resolution." : turnsLeft <= 4 ? "The adventure is past its midpoint — raise the stakes with a complication tied to earlier details." : "Keep the adventure moving forward with a new discovery tied to the episode plan."}

Choice rules:
- End storyText with a short, natural in-world question that invites the next choice.
- End with exactly 3 new safe action choices.
- Each choice must name or imply a specific scene detail from the storyText you just wrote.
- Do not introduce choices that ignore the chosen action or reset the story.
- Keep benchmark codes and math instructions out of the story.

Respond ONLY with valid JSON in this exact format:
{
  "sceneTitle": "short dramatic scene title",
  "storyText": "${reading.sceneWords} of exciting, safe story text",
  "choices": [
    { "id": "A", "label": "clear action under 90 chars" },
    { "id": "B", "label": "clear action under 90 chars" },
    { "id": "C", "label": "clear action under 90 chars" }
  ],
  "storySummary": "updated 1-2 sentence summary of the whole adventure so far",
  "safetyRating": "kid_safe"
}`;
}

export function buildEndingPrompt(data: EndingData): string {
  const hero = data.hero;
  const reading = getReadingGuidance(data.difficulty);
  const seed = data.episodePlan?.opening ?? resolveSeed(data.adventureSeed);

  return `${SYSTEM_PROMPT}

QUEST GENRE: ${seed.genre}
Setting: ${seed.setting}
Objective: ${seed.objective}
Possible helpers: ${seed.helpers}
Opening detail: ${seed.detail}
HERO: ${hero.name}
Class: ${hero.className}
Ancestry/Species: ${hero.ancestry}
Pronouns: ${hero.pronouns}
Difficulty: ${data.difficulty}
Reading guidance: ${reading.guidance}
Math alignment: Florida B.E.S.T. Mathematics Grade ${reading.gradeBand} band. Use this only to tune reading complexity. Do not mention the student's grade level in the story.
Quest length: ${getQuestLengthLabel(data.maxTurns)} with ${data.maxTurns} math-gated chapters.
Math challenges solved: ${data.mathSolved} of ${data.maxTurns}

EPISODE PLAN:
${formatEpisodePlan(data.episodePlan ?? createEpisodePlan(data))}

FULL STORY HISTORY:
${formatStoryHistory(data.storyHistory)}

SHORT STORY SUMMARY:
${data.storySummary}

Write a triumphant, emotionally satisfying ending to this adventure! ${hero.name} has completed the quest and solved ${data.mathSolved} math challenges. The ending should:
- Resolve the quest objective fully
- Match the intended resolution and bring back at least two established details from the story history
- Celebrate the hero's cleverness and courage
- Feel like the final page of a great fantasy story
- Give the hero a unique, creative badge name that reflects their specific adventure

Write ${reading.endingWords} of triumphant, joyful ending.

Respond ONLY with valid JSON in this exact format:
{
  "endingTitle": "dramatic ending title",
  "endingText": "${reading.endingWords} of triumphant, safe ending story",
  "badge": "Creative Badge Name (2-4 words)",
  "safetyRating": "kid_safe"
}`;
}
