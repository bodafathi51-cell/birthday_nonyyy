/* ============================================================
   ✏️  EDIT THIS FILE TO PERSONALIZE YOUR BIRTHDAY WEBSITE
   ------------------------------------------------------------
   • You only need to change the text between the quotes "..."
     (or between the backticks `...` for the long letter).
   • Don't delete the commas at the end of lines.
   • Save the file, then refresh the page in your browser.
   • Anywhere you write {name}, the recipient's name is inserted.
   ============================================================ */

window.birthdayContent = {

  /* ---------- 1. WHO IS IT FOR? ---------- */
  recipientName: "Nonnyy",             // ← Her name, shown in the greeting and the letter
  pageTitle: "Happy Birthday ❤️",        // text on the browser tab
  specialDate: "7-11-2005",                       // optional, e.g. "November 2nd" — leave "" to hide it

  /* ---------- 2. OPENING SCREEN ---------- */
  intro: {
    eyebrow: "✨ A Little Surprise For You ✨",
    title: `To My Beautiful Nourhan ❤️
I made something special just for you...
💌 Open Your Surprise`,
    button: "Open Your Surprise ❤️"
  },

  /* ---------- 3. BIRTHDAY GREETING (first page) ---------- */
  hero: {
  greeting: "Happy Birthday, My Beautiful Girl! 💗",
  subtitle: "اليوم ده مميز عشانك أنتِ.. ضحكتك ووجودك بيفرقوا معايا جداً. كل سنة وأنتِ كل حاجة حلوة في حياتي. ✨",
  button: "A Little Surprise for You 💌"
},

  /* ---------- 4. PHOTO GALLERY ----------
     Put your pictures in the folder:  assets/photos/
     Then list them here. Copy one line to add a photo,
     delete a line to remove one. Any size/shape works —
     photos are never stretched.                                  */
  gallery: {
    title: "Our Beautiful Memories",
    subtitle: "Every picture is a little piece of my heart",
 photos: [
        { src: "assets/photos/photo1.jpeg", caption: "Your smile lights up my world" },
        { src: "assets/photos/photo2.jpeg", caption: "Adventures together" },
        { src: "assets/photos/photo3.jpeg", caption: "My favourite person" },
        { src: "assets/photos/photo4.jpeg", caption: "Creating memories" },
        { src: "assets/photos/photo5.jpeg", caption: "Mini Nonyyyyyyy" },
        { src: "assets/photos/photo6.jpeg", caption: "Just us" }
    ]
      // ,{ src: "assets/photos/photo7.jpg", caption: "Add another one like this" }
    
  },

  /* ---------- 5. THE ENVELOPE & LETTER ---------- */
  letter: {
    sectionTitle: "A Letter Just For You",
    hint: "Tap the envelope to open it",
    reopenHint: "Tap to read it again",
    title: "A Special Message for You",
    salutation: "Dear {Nonyyy},",         // leave "" for no "Dear ..." line

    // Write your message between the backticks.
    // • A BLANK LINE starts a new paragraph.
    // • A normal line break stays a line break.
    // • It can be as long as you like — the letter scrolls.
    message: `بصي انا والله مش بعرف اتكلم وبتوتر من المواقف اللي زي دي يعني يمكن من اكتر الحاجات المتهورة اللي انا هعملها وافرحك بالطريقة دي اكيد هتبسط جدا اني هشوفك وكمان مكنش ينفع افوت يوم زي ده احنا مقطعين بعض بقالنا شهور كان لازم نتدخل بقى 😂😂😭

عاوز اقولك اني بحبك والله العظيم ومفيش اي حاجة تقدر تبعدني عنك ولا حد يقدر يبعدنا عن بعض عارف اني بزعلك كتير وبنتخانق اكتر بس في الاخر ملناش غير بعض

كل سنة وانتي معايا يا روحي وعقبال سنييييييييين كتيييير وانتي معايا وجنبي وبحبك كتير كتير كتير واتمنى اكون فرحت نونههه ❤️`,
    signature: "With all my love ❤️",    // leave "" to hide
    date: "7-11-2026"                             // optional, e.g. "November 2, 2026" — leave "" to hide
  },

  /* ---------- 6. FINAL WISH ---------- */
  finale: {
    title: "أمنية من قلبي ليكي ❤️",
    hint: "اضغطي على الشمعة، غمّضي عينيكي، واتمني أمنية من قلبك...",
    wish: "أتمنى إن كل أمنياتك تتحقق، وإن السعادة متفارقش قلبك أبدًا، وإن كل سنة نعدّيها سوا تكون أحلى من اللي قبلها. وأمنيتي أنا إنك تفضلي معايا، ونفضل نختار بعض كل يوم، مهما عدّت السنين. بحبك ❤️",
    afterWish: "وجودك في حياتي هو أجمل هدية، وكل سنة وإنتِ أقرب لقلبي وأغلى من كل حاجة ❤️✨",
    replayButton: "↻ Replay the surprise",
    footer: "Made with ❤️ for the most amazing person in the world"
  },

  /* ---------- 7. MUSIC (optional) ----------
     Put an .mp3 in the folder  assets/music/  and write its name here.
     If the file doesn't exist, the music button simply stays hidden.   */
 music: {
  file: "assets/music/song.mp3",
  volume: 0.6
}
};
