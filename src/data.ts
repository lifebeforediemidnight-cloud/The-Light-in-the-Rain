import { Act } from './types';

// Let's declare the generated image paths as unique constants in our model
export const STORYBOARD_IMAGES = {
  dawnSkyline: "/src/assets/images/dawn_bangalore_skyline_1780395231248.png",
  hariGrind: "/src/assets/images/hari_crowded_grind_1780395246492.png",
  rainyFall: "/src/assets/images/rainy_fall_accident_1780395260149.png",
  cozyTeaStall: "/src/assets/images/cozy_bangalore_tea_stall_1780395274204.png",
  sunnyPark: "/src/assets/images/sunny_cubbon_park_1780395290428.png",
};

export const STORYBOARD_DATA: Act[] = [
  {
    id: "act-1",
    title: "ACT I: THE AWAKENING",
    subtitle: "A silent city dreams of glass under pink canopies.",
    startTime: 0,
    endTime: 60,
    scenes: [
      {
        id: "scene-1.1",
        title: "The City Wakes Up",
        startTime: 0,
        endTime: 25,
        shots: [
          {
            id: "shot-1.1.1",
            number: 1,
            description: "A panoramic view of the Bangalore skyline at dawn. Soft, hazy purple and orange hues. The silhouette of a distant metro train glides across an elevated track.",
            camera: "Extreme Wide, establishing panorama, ultra-slow pan left.",
            lighting: "Dawn twilight, soft misty orange glow, long gradients, hazy backlighting.",
            audioText: "People call this the city of dreams. A place of glass buildings, endless flyovers, and bright futures.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Faint echo of distant temple bell",
              "Low warm sub-heavy ambient synthesizer pads with swelling analog chord shifts",
              "Distant murmur of city highway awakening"
            ],
            visualPrompt: "Vast cityscape of Bangalore under a glowing dawn sky, colored in gentle violet and warm apricot. The thin line of an elevated metro railroad stretches across the horizon, carrying a tiny silhouetted train.",
            imageKey: "dawnSkyline"
          },
          {
            id: "shot-1.1.2",
            number: 2,
            description: "Heavy dew dripping off a vibrant pink Tabebuia flower. The camera pulls back slowly to reveal a quiet street in Jayanagar, wet with morning mist.",
            camera: "Extreme Close-Up pulling back to Medium, rack focus from the heavy drops to the empty street background.",
            lighting: "Soft ambient morning light, cool dew reflection, damp asphalt specular sheen.",
            audioText: "People call this the city of dreams. A place of glass buildings, endless flyovers, and bright futures.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Solitary bird chirping (common mynas)",
              "Faint swishing of a roadside broom"
            ],
            visualPrompt: "Detailed macro view of a single bright pink Tabebuia blossom heavy with water droplets. A soft focus background shows a quiet residential lane with wet concrete gates and leafy shadows.",
            imageKey: "dawnSkyline"
          },
          {
            id: "shot-1.1.3",
            number: 3,
            description: "A green-and-yellow auto-rickshaw parked under a streetlamp that is flickering off as daylight breaks.",
            camera: "Medium Shot, still, atmospheric framing.",
            lighting: "Incandescent orange yellow lamp bulb flickering out, giving way to bright morning sky blue.",
            audioText: "But when you are at the bottom, the city doesn’t look up.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Electric hum of streetlamp dying out",
              "Distant morning bus rumbling"
            ],
            visualPrompt: "Retro green and yellow auto-rickshaw parked quietly under a curved steel streetlamp bracket. The sky is turning to a clear pristine morning teal, and tree leaves rustle.",
            imageKey: "dawnSkyline"
          }
        ]
      },
      {
        id: "scene-1.2",
        title: "Hari’s Room",
        startTime: 25,
        endTime: 60,
        shots: [
          {
            id: "shot-1.2.4",
            number: 4,
            description: "A small, dimly lit attic room. Shafts of morning light cut through a dusty window pane, illuminating dust motes dancing in the air.",
            camera: "Interior Wide, steady angle looking toward the gable window.",
            lighting: "Strong direct volumetric beams cut across deep shadows, warm contrast.",
            audioText: "But when you are at the bottom, the city doesn’t look up. It just moves past you. Another day to survive.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Faint ticking clock",
              "Low melancholic piano chords blending into the ambient synth pad texture"
            ],
            visualPrompt: "Cozy old brick attic workspace. A narrow wooden bed with a thin mattress is lit by dramatic beams of volumetric morning sun pouring through glass panes. Soft dust particles glimmering.",
            imageKey: "dawnSkyline"
          },
          {
            id: "shot-1.2.5",
            number: 5,
            description: "Hari’s face, looking tired but determined. He sits up, rubs his eyes, and ties his shoelaces.",
            camera: "Close-Up, tracking Hari as he moves to the edge of the mattress.",
            lighting: "Soft rim lighting outlining his face, leaving his expressions in deep contemplation.",
            audioText: "Just one more day.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Rustle of course blanket, creak of wood, tying rough canvas shoelace laces together"
            ],
            visualPrompt: "Close-up profile of a young Indian man wearily sitting up, eyes tired but intense, tying the laces of weathered work sneakers. Low golden lighting highlights his face.",
            imageKey: "dawnSkyline"
          },
          {
            id: "shot-1.2.6",
            number: 6,
            description: "His hand reaches for a worn-out backpack. Next to it is a framed photo of his mother in a rural setting, lit gently by the window light.",
            camera: "Detail Shot, slow slide-right with extremely limited depth of field.",
            lighting: "Warm golden direct sun beam illuminates the wooden picture frame and mother's peaceful face.",
            audioText: "Another day to survive. Just one more day.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Soft sigh",
              "Backpack fabric dragging across wood stool"
            ],
            visualPrompt: "Side view of an old table. A tanned, hardworking hand grips the shoulder strap of a faded canvas backpack. A simple wooden framed photograph of a rural mother in a saree stands in the soft sunlit draft.",
            imageKey: "dawnSkyline"
          }
        ]
      }
    ]
  },
  {
    id: "act-2",
    title: "ACT II: THE GRIND",
    subtitle: "Chasing lanyards, flyers, and the endless clamor of traffic.",
    startTime: 60,
    endTime: 135,
    scenes: [
      {
        id: "scene-2.1",
        title: "The Contrast of Lives",
        startTime: 60,
        endTime: 100,
        shots: [
          {
            id: "shot-2.1.1",
            number: 7,
            description: "Hari walking briskly past a modern glass IT park entrance. Security guards stand at the gates; employees in business casual walk past holding lanyards.",
            camera: "Medium tracking shot keeping pace with Hari, background moves faster with crowd rush.",
            lighting: "Bright, clinical sunlight, high contrast cold reflection of the glass mirrors.",
            audioText: "In this crowd of millions, it’s easy to feel invisible.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Transition to faster, rhythmic acoustic guitar strings",
              "Electronic keycard chimes, chatter of corporate lanyards moving quickly",
              "Kannada, Hindi, English corporate greetings"
            ],
            visualPrompt: "A young, determined deliverer in plain blue shirt passing by a massive, high-tech glass commercial complex. Employees in crisp shirts with neon ID straps drift past inside security turnstiles.",
            imageKey: "hariGrind"
          },
          {
            id: "shot-2.1.2",
            number: 8,
            description: "Hari standing on a dusty divider, handing out flyers to passing cars and bikes. The exhaust fumes are visible in the bright, harsh midday light.",
            camera: "Wide Shot from high angle, capturing speed and rush around the static young man.",
            lighting: "Harsh white midday sun overhead, creating harsh dark shadows under wheels, sun glare.",
            audioText: "You can scream, and the sound will just get swallowed by the traffic.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Deafening chorus of motorcycle revs, honks",
              "Exhaust pipe splutters",
              "Heat rising shivers"
            ],
            visualPrompt: "A young distributor standing in the middle of a hot, chaotic multi-lane Bangalore crossing. Waves of auto-rickshaws, city buses, and motorbikes sweep by, leaving shimmering dust trails in the burning daylight.",
            imageKey: "hariGrind"
          },
          {
            id: "shot-2.1.3",
            number: 9,
            description: "Hari’s perspective: hands passing by, ignoring the flyers. The camera uses a shallow depth of field, keeping the passing crowd blurred while Hari’s hands remain in sharp focus.",
            camera: "First-Person POV, looking at his own hand holding a paper pamphlets with blurred corporate figures brushing by.",
            lighting: "Slight overexposure on white paper sheets, surrounding city is bleached with white sun glare.",
            audioText: "In this crowd of millions, it’s easy to feel invisible.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Rushing wind of passing commuter scooters",
              "Scraping sound of wind tossing paper slips"
            ],
            visualPrompt: "First person perspective. A hand holding crisp white advertising flyers. The busy background is a beautiful, blurry pastel kaleidoscope of busy city commuters passing without stopping.",
            imageKey: "hariGrind"
          }
        ]
      },
      {
        id: "scene-2.2",
        title: "The Darshini Shift",
        startTime: 100,
        endTime: 135,
        shots: [
          {
            id: "shot-2.2.4",
            number: 10,
            description: "Inside a crowded local Darshini. Steam rises from a hot griddle as plates of dosas are prepared.",
            camera: "Interior Medium Shot over the hot counter, moving through the mist.",
            lighting: "Warm orange tungsten kitchen lights, steam glowing from backlight.",
            audioText: "Two coffee! One masala dosa! Siri, bega madi!",
            audioChar: "Manager",
            audioType: "dialogue",
            acousticCues: [
              "Hissing of cooling water on hot cast iron griddle",
              "Sizzling of ghee oil",
              "Loud clatter of metal steel plates",
              "Muffled Kannada shouts of cafe menu orders"
            ],
            visualPrompt: "Interior of a packed, fast-paced Bangalore Darshini. A chef pours crispy paper-thin dosas on a long steaming flat grill. White rising vapors billow toward the yellow overhead glass lamps.",
            imageKey: "hariGrind"
          },
          {
            id: "shot-2.2.5",
            number: 11,
            description: "Hari standing at a sink, washing a stack of metal plates. Sweat drips down his temple.",
            camera: "Medium Close-up, profile angle, looking wet and tired.",
            lighting: "Dim kitchen backlight, damp reflections on the steel tiles, sweaty sheen.",
            audioText: "In this crowd of millions, it's easy to feel invisible...",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Gushing water tap",
              "Metal plates scratching",
              "Heavy, rhythmic breath from Hari"
            ],
            visualPrompt: "Medium shot of a young Indian kitchen assistant washing stainless steel coffee tumblers at a damp commercial sink. Water droplets gleam on his brow under weak fluorescent yellow lighting.",
            imageKey: "hariGrind"
          },
          {
            id: "shot-2.2.6",
            number: 12,
            description: "The restaurant manager’s face, speaking quickly and gesturing toward a dirty table.",
            camera: "Extreme Close-Up, wide lens from slightly low angle, making the manager look commanding and rushed.",
            lighting: "Deep harsh shadows on manager's face highlight his irritation.",
            audioText: "Siri, bega kelasa mado! (Hey, do the work quickly!)",
            audioChar: "Manager",
            audioType: "dialogue",
            acousticCues: [
              "Louder clattering of stainless plates",
              "Noisy customer crunching and fork scratches"
            ],
            visualPrompt: "An intense, animated face of a mustache-bearing Indian manager talking with wide expressions, pointing his index finger off-screen. The busy restaurant is reflected in the steel frames behind him.",
            imageKey: "hariGrind"
          }
        ]
      }
    ]
  },
  {
    id: "act-3",
    title: "ACT III: THE BREAKING POINT",
    subtitle: "A dark violet sky unlocks a storm of mud and metal.",
    startTime: 135,
    endTime: 210,
    scenes: [
      {
        id: "scene-3.1",
        title: "The Storm Approaches",
        startTime: 135,
        endTime: 165,
        shots: [
          {
            id: "shot-3.1.1",
            number: 13,
            description: "The sky rapidly turning dark violet. Sudden gusts of wind blow dry leaves across the asphalt.",
            camera: "Wide tilt up from the tarmac to the huge sky.",
            lighting: "Uncanny twilight, deep violet dark sky, high wind contrast.",
            audioText: "[Low rumble of distant thunder]",
            audioChar: "ambient",
            audioType: "ambient",
            acousticCues: [
              "Distant thunder claps with bass rumble",
              "Fierce howling wind rustling dense trees",
              "Metal commercial store signs rattling"
            ],
            visualPrompt: "A city asphalt road under a massive dark bruised purple tempest sky. Dry yellow wind-swept leaves swirl in circles over the road, creating a chaotic pre-storm Bangalore atmospheric sense.",
            imageKey: "rainyFall"
          },
          {
            id: "shot-3.1.2",
            number: 14,
            description: "Hari on an old bicycle, wearing a bright blue delivery backpack and a cheap, transparent plastic raincoat.",
            camera: "Tracking Wide, moving parallel to his struggle against the wind forces.",
            lighting: "Dim grey dark storm ambient lighting, strong wind blowing his thin jacket open.",
            audioText: "I wanted to prove I could make it...",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Creak of bicycle chains straining",
              "Heavy laboured breathing under raincoat"
            ],
            visualPrompt: "A young delivery rider desperately peddling an old rustic iron bicycle uphill against severe gale-force wind. His bright blue plastic delivery pack sits ballooned on his back.",
            imageKey: "rainyFall"
          }
        ]
      },
      {
        id: "scene-3.2",
        title: "The Fall",
        startTime: 165,
        endTime: 210,
        shots: [
          {
            id: "shot-3.2.3",
            number: 15,
            description: "Heavy raindrops begin to fall, splashing on the road. The rain quickly turns into a heavy downpour.",
            camera: "Slow Motion Extreme Close-up, focus on raindrops splashing.",
            lighting: "Dark grey overcast with heavy specular glitter from the water sheets on the road.",
            audioText: "[Sound of torrential rain hitting the ground]",
            audioChar: "ambient",
            audioType: "ambient",
            acousticCues: [
              "Silence of the guitar music stream",
              "Deafening explosion of heavy white noise rain, splashing water drops on hard pavement"
            ],
            visualPrompt: "Slow motion shot of heavy raindrops dropping like large crystal beads, landing on a wet asphalt street, creating large ripples and splashing reflections of passing headlights.",
            imageKey: "rainyFall"
          },
          {
            id: "shot-3.2.4",
            number: 16,
            description: "Hari pedaling hard against the wind. An auto-rickshaw speeds past, splashing a sheet of muddy water over him.",
            camera: "Low angle Tracking Shot, rickshaw sweeps left, splashing the viewport.",
            lighting: "Harsh neon yellow headlights pierce through sheets of dark rain.",
            audioText: "But maybe...",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Sudden motorized roar of rickshaw engine zooming past",
              "Viscous swooshing sound of mud water washing over Hari"
            ],
            visualPrompt: "A rain-drenched delivery rider hit on his side by a massive geyser of muddy puddles thrown up by a speeding rickshaw. Rain sheets fall heavily through streetlights.",
            imageKey: "rainyFall"
          },
          {
            id: "shot-3.2.5",
            number: 17,
            description: "The bicycle loses traction on a wet patch of road. Hari slides and falls onto the pavement. The delivery box tears open, spilling its contents into the dirty water.",
            camera: "Wide static shot of the mechanical fall, heavy splash sound effect.",
            lighting: "Dull blue grey storm tones with bright flashing neon indicators.",
            audioText: "...maybe there’s no room for me here.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Violent metallic clatter of bike frame hitting concrete",
              "Cardboard packaging tearing open",
              "Soft damp floating slops"
            ],
            visualPrompt: "A dynamic anime shot. A young bicyclist slides sideways onto flooded dark streets, his deliveries spilling into the dirty puddle streams. The rain is relentless.",
            imageKey: "rainyFall"
          },
          {
            id: "shot-3.2.6",
            number: 18,
            description: "Hari sitting on the flooded road, his head lowered as rain pours over his hood. Water droplets mix with silent tears on his face.",
            camera: "Tight Close-Up, high angle, highlighting his isolation in the puddle.",
            lighting: "Slight highlight on the tears on his cheeks, reflecting cold silver street lamp hues.",
            audioText: "Maybe there lies no path...",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Complete isolation of sound, muted distant traffic, heavy heartbeat sound layer under rain white noise"
            ],
            visualPrompt: "Drenched Indian youth sitting down on a flooded road curb, rain water washing over his blue hood. Streams of rain water cascade down his face, mixing with silent flowing tears of defeat.",
            imageKey: "rainyFall"
          }
        ]
      }
    ]
  },
  {
    id: "act-4",
    title: "ACT IV: THE WARMTH OF A STRANGER",
    subtitle: "A roadside canopy, a boiling kettle, and a golden stream of coffee.",
    startTime: 210,
    endTime: 270,
    scenes: [
      {
        id: "scene-4.1",
        title: "The Tea Stall",
        startTime: 210,
        endTime: 250,
        shots: [
          {
            id: "shot-4.1.1",
            number: 19,
            description: "Hari huddled under a blue tarpaulin sheet at a roadside tea stall. He is shivering, his arms wrapped around his knees.",
            camera: "Medium Wide, framing the cozy yellow hut inside cold torrential surroundings.",
            lighting: "High contrast warm neon amber interior light vs cool blue-grey dark exterior rainstorm.",
            audioText: "[Shivering breathing]",
            audioChar: "Hari",
            audioType: "ambient",
            acousticCues: [
              "Muted sound of rain outside hitting tarpaulin canopy",
              "Start of a gentle, warm acoustic piano melody, slow and deeply soft"
            ],
            visualPrompt: "A young wet man huddled close on a wooden bench inside a small roadside stall shelter, built from bamboo and a bright blue tarp. Steaming rain falls outside the dark rim.",
            imageKey: "cozyTeaStall"
          },
          {
            id: "shot-4.1.2",
            number: 20,
            description: "The owner, Anna, a man with kind eyes and graying hair, looks at Hari. He turns to his stove, where milk is boiling in a large brass vessel.",
            camera: "Medium Shot of Anna, slow track-left, showing his gentle concern.",
            lighting: "Glow from stove fire reflecting orange on Anna’s spectacles and face.",
            audioText: "[Sizzling stove flame, bubbling milk]",
            audioChar: "ambient",
            audioType: "ambient",
            acousticCues: [
              "Clatter of brass tumblers",
              "Soft puff of gas burner flame"
            ],
            visualPrompt: "A kind-faced Indian vendor with graying hair and glasses looking down caringly with deep soft eyes, warming milk in an ornate brass kettle on a single gas stove inside his small lit cozy kiosk.",
            imageKey: "cozyTeaStall"
          },
          {
            id: "shot-4.1.3",
            number: 21,
            description: "Anna pours hot filter coffee between two steel tumblers, creating a long, frothy stream. The steam catches the yellow light of the stall's single bulb.",
            camera: "Macro Close-Up tracking the hot cascade of coffee stream as it falls through the backlit vapor.",
            lighting: "Direct cinematic lighting on the thin frothy coffee stream, the hot vapor catching the warm bulb glow like small fireflies.",
            audioText: "[Splendid frothing pour liquid sounds]",
            audioChar: "ambient",
            audioType: "ambient",
            acousticCues: [
              "Rich swishing foam sound of milk poured between containers",
              "Acoustic piano chord swell"
            ],
            visualPrompt: "A detailed view of steaming golden tea/coffee being hand-poured in a long high frothy stream between steel tumblers, surrounded by shining backlit vapor under a warm glowing hanging bulb.",
            imageKey: "cozyTeaStall"
          },
          {
            id: "shot-4.1.4",
            number: 22,
            description: "Anna slides the steaming tumbler toward Hari.",
            camera: "Close-up on the wooden table surface as steel tumbler slides closer. Hari's hand hesitantly reaches out.",
            lighting: "Warm overhead yellow light. Soft mist emanating from the glass.",
            audioText: "Kudi, maga. It’ll warm you up. / Anna... I don’t have money today. / Who asked for money? Some days, the rain is too heavy for everyone. You just have to wait it out. Tomorrow, the sun will come back. Bangalore weather is like that. Life is like that too.",
            audioChar: "Anna",
            audioType: "dialogue",
            acousticCues: [
              "Squeak of metal tumbler sliding on old wet wooden table",
              "Soft rain hum background"
            ],
            visualPrompt: "Hands sliding a hot steel mug of frothy cappuccino onto a table. A shivering young courier reaches his cold hands toward the warm metal tumbler, surrounded by soft steam.",
            imageKey: "cozyTeaStall"
          }
        ]
      },
      {
        id: "scene-4.2",
        title: "Finding Perspective",
        startTime: 250,
        endTime: 270,
        shots: [
          {
            id: "shot-4.2.5",
            number: 23,
            description: "Hari looking out from under the tarp. The wet street, once looking hostile, now reflects the neon shop signs and streetlights in beautiful, glittering shades of gold, blue, and pink.",
            camera: "Point of View (POV) looking outwards, soft camera breathing.",
            lighting: "Spectacular visual array of colorful neon reflections (magenta, cyan, gold) shimmering in flooded road surface pools.",
            audioText: "A simple cup of coffee. A stranger’s kindness. In a city so busy, someone paused. Someone saw me.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Soothing piano melody grows brighter",
              "Rain droplets sound lighter, rhythmic and refreshing rather than cold"
            ],
            visualPrompt: "A perspective view looking out from inside a dark bamboo dry canopy. The pouring wet streets are adorned with spectacular shining reflections of green, amber, pink, and bright cyan storefront neon signs.",
            imageKey: "cozyTeaStall"
          },
          {
            id: "shot-4.2.6",
            number: 24,
            description: "Hari taking a sip of the hot coffee. The tension in his shoulders visibly relaxes.",
            camera: "Close-up of Hari's face, a slow visual relief showing on his face as he takes a sip.",
            lighting: "Glowing firelight illumination on his neck, lips, and closed eyelashes.",
            audioText: "Someone saw me. Tomorrow, the sun will come back.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Satisfied soft sip sound",
              "Relieved steady breathing"
            ],
            visualPrompt: "Close-up of a young Indian man drinking steaming coffee from a steel tumbler. Closed eyelids, a thin slight serene smile forming, his shoulders sinking into peaceful relaxation.",
            imageKey: "cozyTeaStall"
          }
        ]
      }
    ]
  },
  {
    id: "act-5",
    title: "ACT V: RESILIENCE",
    subtitle: "A morning of green parks, bandaged knees, and deep resolve.",
    startTime: 270,
    endTime: 300,
    scenes: [
      {
        id: "scene-5.1",
        title: "A New Day",
        startTime: 270,
        endTime: 300,
        shots: [
          {
            id: "shot-5.1.1",
            number: 25,
            description: "Cubbon Park the next morning. The sun shines brightly through the damp green canopy. People are walking, jogging, and laughing.",
            camera: "Wide Panoramic Shot under the towering bamboo trees of the park, slow rise up.",
            lighting: "Crisp bright yellow sunbeams filtering through leaves (God rays), glowing dew drops, vibrant green and gold trees.",
            audioText: "The struggle hasn't ended. The rent is still due, and the days will still be hard.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Instrumental music rises to a hopeful, swelling orchestral crescendo with violins, cellos, and acoustic grand piano",
              "Lively birds singing and whistling",
              "Faint laughter and footsteps in distance"
            ],
            visualPrompt: "A breathtaking sun-drenched park forest. Rays of shimmering morning light pierce through high green bamboo tree tops, illuminating paths covered with rich carpet of fallen pink Tabebuia flowers. Elegant slice-of-life anime style.",
            imageKey: "sunnyPark"
          },
          {
            id: "shot-5.1.2",
            number: 26,
            description: "Hari walking down a path. His knee is neatly bandaged. His face looks rested, carrying a quiet expression of hope.",
            camera: "Medium Shot following Hari walking forward, looking up at the sky canopy.",
            lighting: "Dappled light spots falling on his hair and shoulder as he walks under the leaves.",
            audioText: "But I am still here. This city is tough, but so am I.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Crunching of dry leaves underfoot",
              "Swell of cello strings"
            ],
            visualPrompt: "A young Indian courier walking down a sunny leaf-strewn park lane. A clean white bandage is tied around his knee, visible through a small fold. He looks forward with a quiet, calm smile.",
            imageKey: "sunnyPark"
          },
          {
            id: "shot-5.1.3",
            number: 27,
            description: "A pink Tabebuia flower falls slowly from a branch. Hari catches it in his palm, looks at it for a moment, and smiles softly.",
            camera: "Close-up following the spinning falling blossom, tracking to land in his hand, then rack focusing to his gentle smile.",
            lighting: "Direct bright morning sun highlighting the delicate translucent pink petals in his hand.",
            audioText: "I will find my way. One day at a time.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Soft wind blowing leaves",
              "Peak of violin crescendo"
            ],
            visualPrompt: "A delicate pink trumpet flower catches mid-air, landing safely in an open palm of a smiling youth. Splendid morning sun outlines the fine petals, casting beautiful garden background colors.",
            imageKey: "sunnyPark"
          },
          {
            id: "shot-5.1.4",
            number: 28,
            description: "Hari joins the flow of people walking toward the main road as the city bustles with life around him.",
            camera: "Extreme Wide, zooming back slowly as his figure blends into a crowd of walking citizens, fading to warm golden light.",
            lighting: "Bright warm golden halo enveloping the entire viewport, slowly fading the scene.",
            audioText: "Maleya Belaku. The Light in the Rain.",
            audioChar: "Hari",
            audioType: "voiceover",
            acousticCues: [
              "Orchestral chord suspends on a beautiful, lingering minor-major resolution note",
              "Humming city traffic blends with music in absolute peaceful harmony",
              "Fades out slowly"
            ],
            visualPrompt: "A vast bustling street crossing. A young courier joins the colorful stream of joggers and daily workers merging onto a sun-lit wide avenue. The frame slowly washes out in radiant golden mist.",
            imageKey: "sunnyPark"
          }
        ]
      }
    ]
  }
];
