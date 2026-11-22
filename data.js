/* BEAUTY IN MOTION — store data (demo / academic project)
   Edit prices, contact details and shipping rules here: the whole site reads from this file. */

const CONFIG = {
  currency: "DH",
  shippingStandard: 25,        // DH, 48–72h, all Morocco
  shippingExpress: 45,         // DH, 24h, Casablanca / Rabat only
  freeShippingFrom: 400,       // DH, standard shipping becomes free
  expressCities: ["Casablanca", "Rabat"],
  promoCodes: { BIENVENUE10: 0.10, GLOW15: 0.15 },
  phone: "+212 6 00 00 00 00",          // placeholder — replace with the real WhatsApp Business number
  email: "contact@beautyinmotion.ma",   // placeholder — replace with the real address
  instagram: "@beautyinmotion.ma",
  tiktok: "@beautyinmotion",
  cities: ["Casablanca", "Rabat", "Marrakech", "Tanger", "Agadir", "Fès", "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Témara", "Mohammedia", "El Jadida", "Béni Mellal", "Nador", "Safi", "Laâyoune", "Autre ville"]
};

const PRODUCTS = [
  {
    id: "daily-cleanser",
    name: "Daily Cleanser",
    fr: "Gel nettoyant visage",
    motto: "Cleanse · Refresh · Glow",
    step: 1, stepLabel: "Nettoyer",
    category: "nettoyer",
    price: 219, size: "200 ml",
    images: ["images/cleanser-1.jpg", "images/cleanser-2.jpg", "images/cleanser-3.jpg"],
    short: "Un gel frais qui purifie la peau en douceur et la laisse nette, souple et prête à recevoir vos soins.",
    description: "Le Daily Cleanser est la première étape de votre routine BEAUTY IN MOTION. Sa texture gel se transforme en une mousse légère qui élimine impuretés, excès de sébum et résidus de maquillage léger, sans tirailler. Enrichi en eau de rose de Kelâat M'Gouna et en aloe vera, il rafraîchit instantanément et respecte l'équilibre naturel de la peau — matin et soir, même pour les journées les plus actives.",
    skin: "Tous types de peau, y compris mixtes à grasses",
    texture: "Gel transparent → mousse légère",
    scent: "Note florale très légère de rose",
    benefits: [
      "Élimine impuretés et excès de sébum",
      "Rafraîchit et réveille le teint",
      "Ne tiraille pas, ne dessèche pas",
      "Prépare la peau à mieux recevoir sérum et crème"
    ],
    keyIngredients: [
      { name: "Eau de rose de Kelâat M'Gouna", role: "Tonifie et rafraîchit, avec une touche marocaine." },
      { name: "Aloe vera", role: "Apaise et adoucit la peau après le nettoyage." },
      { name: "Glycérine végétale", role: "Préserve l'hydratation pendant le rinçage." },
      { name: "Tensioactifs doux d'origine coco", role: "Nettoient efficacement sans agresser." }
    ],
    inci: "Aqua, Rosa Damascena Flower Water, Coco-Glucoside, Glycerin, Aloe Barbadensis Leaf Juice, Sodium Cocoyl Glutamate, Panthenol, Allantoin, Citric Acid, Sodium Benzoate, Potassium Sorbate, Parfum.",
    howTo: [
      "Humidifiez le visage à l'eau tiède.",
      "Déposez 1 à 2 pressions dans le creux de la main.",
      "Massez 30 à 60 secondes en mouvements circulaires, en évitant le contour des yeux.",
      "Rincez abondamment et séchez en tamponnant avec une serviette propre."
    ],
    when: "Matin et soir",
    tips: "Le soir, si vous portez un maquillage longue tenue, faites un premier passage avec un démaquillant avant le Daily Cleanser.",
    anim: "bubbles"
  },
  {
    id: "glow-serum",
    name: "Glow Serum",
    fr: "Sérum éclat",
    motto: "Brighten · Renew · Glow",
    step: 2, stepLabel: "Illuminer",
    category: "eclat",
    price: 249, size: "30 ml",
    images: ["images/serum-1.jpg", "images/serum-2.jpg", "images/serum-3.jpg"],
    short: "Le geste éclat de la routine : un sérum léger qui unifie le teint et révèle une peau lumineuse.",
    description: "Concentré et ultra-léger, le Glow Serum complète la routine pour apporter de l'éclat. Sa formule associe niacinamide, dérivé de vitamine C et acide hyaluronique pour aider à unifier le teint, lisser le grain de peau et lui redonner de la lumière. Il pénètre en quelques secondes, sans film collant — idéal sous la crème le matin comme le soir.",
    skin: "Tous types de peau, particulièrement teints ternes ou fatigués",
    texture: "Fluide aqueux, absorption rapide",
    scent: "Sans parfum ajouté",
    benefits: [
      "Teint plus lumineux et plus uniforme",
      "Grain de peau visiblement lissé",
      "Hydratation légère, fini non gras",
      "S'intègre facilement sous la crème et le maquillage"
    ],
    keyIngredients: [
      { name: "Niacinamide (vitamine B3)", role: "Aide à unifier le teint et à affiner l'apparence des pores." },
      { name: "Vitamine C stabilisée", role: "Ravive l'éclat du teint." },
      { name: "Acide hyaluronique", role: "Hydrate et repulpe en surface." },
      { name: "Extrait de figue de Barbarie", role: "Ingrédient marocain aux propriétés adoucissantes." }
    ],
    inci: "Aqua, Niacinamide, Propanediol, Glycerin, Ascorbyl Glucoside, Sodium Hyaluronate, Opuntia Ficus-Indica Fruit Extract, Panthenol, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
    howTo: [
      "Appliquez sur une peau propre et sèche, après le Daily Cleanser.",
      "Déposez 3 à 4 gouttes au creux de la main ou directement sur le visage.",
      "Tapotez du centre du visage vers l'extérieur, puis sur le cou.",
      "Laissez pénétrer 30 secondes avant d'appliquer l'Hydrating Cream."
    ],
    when: "Matin et/ou soir",
    tips: "Le matin, terminez toujours votre routine par une protection solaire : c'est le meilleur allié de l'éclat.",
    anim: "drop"
  },
  {
    id: "hydrating-cream",
    name: "Hydrating Cream",
    fr: "Crème hydratante visage",
    motto: "Hydrate · Protect · Smooth",
    step: 3, stepLabel: "Hydrater",
    category: "hydrater",
    price: 179, size: "50 ml",
    images: ["images/cream-1.jpg", "images/cream-2.jpg", "images/cream-3.jpg"],
    short: "Une crème fondante qui nourrit, hydrate et laisse la peau douce et confortable toute la journée.",
    description: "L'Hydrating Cream nourrit et hydrate la peau tout en restant légère. Sa texture fondante associe acide hyaluronique, huile d'argan du Maroc et beurre de karité pour renforcer le confort de la peau et la protéger du dessèchement. La peau est souple, lisse et visiblement repulpée — un fini satiné qui accompagne vos journées en mouvement.",
    skin: "Peaux normales, mixtes et sèches",
    texture: "Crème fondante, fini satiné",
    scent: "Note fraîche et légère",
    benefits: [
      "Hydratation longue durée",
      "Nourrit sans effet gras",
      "Peau plus souple et plus lisse",
      "Parfaite base de maquillage"
    ],
    keyIngredients: [
      { name: "Acide hyaluronique", role: "Retient l'eau et repulpe la peau." },
      { name: "Huile d'argan du Maroc", role: "Nourrit et adoucit, riche en vitamine E." },
      { name: "Beurre de karité", role: "Apporte confort et protège du dessèchement." },
      { name: "Panthénol (provitamine B5)", role: "Apaise et soutient la barrière cutanée." }
    ],
    inci: "Aqua, Caprylic/Capric Triglyceride, Glycerin, Argania Spinosa Kernel Oil, Butyrospermum Parkii Butter, Cetearyl Alcohol, Glyceryl Stearate, Sodium Hyaluronate, Panthenol, Tocopherol, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin, Parfum.",
    howTo: [
      "Prélevez une noisette de crème avec la spatule ou le bout des doigts.",
      "Répartissez en 5 points : front, joues, nez et menton.",
      "Massez en mouvements circulaires remontants jusqu'à absorption.",
      "Terminez par le cou et le décolleté."
    ],
    when: "Matin et soir",
    tips: "En hiver ou après une journée au soleil, appliquez une couche plus généreuse le soir en masque de nuit express.",
    anim: "cream"
  }
];

const BUNDLE = {
  id: "coffret-routine",
  name: "Coffret Routine Glow",
  fr: "Les 3 essentiels",
  motto: "Cleanse · Glow · Hydrate",
  category: "coffret",
  price: 549,
  size: "200 ml + 30 ml + 50 ml",
  images: ["images/coffret.jpg", "images/cleanser-1.jpg", "images/serum-2.jpg", "images/cream-2.jpg"],
  items: ["daily-cleanser", "glow-serum", "hydrating-cream"],
  short: "La routine complète en 3 gestes — nettoyer, illuminer, hydrater — à prix doux.",
  description: "Le Coffret Routine Glow réunit les trois soins de la première gamme BEAUTY IN MOTION : le Daily Cleanser pour purifier, le Glow Serum pour l'éclat et l'Hydrating Cream pour nourrir. Une routine simple et complète, idéale pour découvrir la marque ou pour offrir."
};

/* Fictional demo reviews — the site footer states it is an academic demonstration. */
const REVIEWS = [
  { p: "glow-serum", name: "Salma B.", city: "Casablanca", age: "28 ans", skin: "Peau mixte", rating: 5, date: "2026-11-12", title: "Mon teint a vraiment changé", text: "Je l'utilise matin et soir depuis 4 semaines. Mon teint est plus uniforme et j'ai moins besoin de fond de teint. La texture est très légère, aucun effet collant.", av: 0 },
  { p: "glow-serum", name: "Imane R.", city: "Rabat", age: "34 ans", skin: "Peau normale", rating: 4, date: "2026-11-03", title: "Bel éclat, flacon un peu petit", text: "Effet bonne mine visible après une dizaine de jours. Seul bémol : 30 ml part assez vite si on l'utilise matin et soir. Mais pour 249 DH ça reste correct.", av: 1 },
  { p: "glow-serum", name: "Hajar T.", city: "Tanger", age: "22 ans", skin: "Peau grasse", rating: 5, date: "2026-10-27", title: "Pas gras du tout", text: "J'avais peur que ça fasse briller ma zone T mais pas du tout. Il pénètre direct. Je le mets sous ma crème avant les cours.", av: 2 },
  { p: "glow-serum", name: "Nadia E.", city: "Agadir", age: "46 ans", skin: "Peau sèche", rating: 4, date: "2026-10-19", title: "Agréable", text: "Je le trouve agréable et ma peau paraît plus reposée. Pour ma peau sèche je dois bien mettre la crème par-dessus, seul il ne suffit pas.", av: 3 },
  { p: "hydrating-cream", name: "Kenza M.", city: "Marrakech", age: "31 ans", skin: "Peau sèche", rating: 5, date: "2026-11-15", title: "Enfin une crème qui tient", text: "Avec le climat de Marrakech ma peau tire tout le temps. Là je suis confortable jusqu'au soir. L'odeur est discrète, j'adore le pot.", av: 4 },
  { p: "hydrating-cream", name: "Meryem A.", city: "Fès", age: "38 ans", skin: "Peau mixte", rating: 4, date: "2026-11-01", title: "Très bonne base de maquillage", text: "Fini satiné, le maquillage tient bien par-dessus. Un peu riche pour mon nez en été, je n'en mets qu'une fine couche sur la zone T.", av: 5 },
  { p: "hydrating-cream", name: "Youssef K.", city: "Casablanca", age: "29 ans", skin: "Peau normale", rating: 5, date: "2026-10-22", title: "Approuvé aussi par les hommes", text: "Ma femme l'a commandée, j'ai fini par lui piquer. Ça pénètre vite et ça ne brille pas. Le parfum est neutre, rien de trop féminin.", av: 6 },
  { p: "hydrating-cream", name: "Fatima-Zahra O.", city: "Meknès", age: "52 ans", skin: "Peau sèche", rating: 3, date: "2026-10-10", title: "Bien mais pas assez nourrissante pour moi", text: "Agréable le matin, mais pour la nuit j'ai besoin de quelque chose de plus riche. J'aimerais une version nuit dans la gamme.", av: 7 },
  { p: "daily-cleanser", name: "Lina H.", city: "Agadir", age: "20 ans", skin: "Peau grasse", rating: 5, date: "2026-11-18", title: "Frais et efficace", text: "Il mousse juste ce qu'il faut et ma peau est nette sans tirer. Le flacon pompe de 200 ml dure longtemps, très bon rapport qualité-prix.", av: 8 },
  { p: "daily-cleanser", name: "Sara L.", city: "Rabat", age: "26 ans", skin: "Peau sensible", rating: 4, date: "2026-11-06", title: "Doux pour ma peau sensible", text: "Aucune rougeur après le nettoyage, ce qui est rare pour moi. J'aurais aimé une version sans aucun parfum mais l'odeur de rose est très légère.", av: 9 },
  { p: "daily-cleanser", name: "Oumaima Z.", city: "Kénitra", age: "33 ans", skin: "Peau mixte", rating: 5, date: "2026-10-25", title: "Ma routine du matin", text: "Je le garde dans la douche. Rapide, agréable, et ma peau est prête pour le sérum. Livraison reçue en 48h.", av: 10 },
  { p: "coffret-routine", name: "Rania S.", city: "Tanger", age: "27 ans", skin: "Peau mixte", rating: 5, date: "2026-11-16", title: "Cadeau parfait", text: "Offert à ma sœur pour son anniversaire, le coffret est très élégant. Elle a adoré la routine en 3 étapes, simple à suivre.", av: 11 },
  { p: "coffret-routine", name: "Ghita N.", city: "Casablanca", age: "35 ans", skin: "Peau normale", rating: 4, date: "2026-11-08", title: "Bonne découverte", text: "Le meilleur moyen de tester la marque. Le sérum est mon préféré. J'ai payé à la livraison, aucun souci.", av: 12 }
];
