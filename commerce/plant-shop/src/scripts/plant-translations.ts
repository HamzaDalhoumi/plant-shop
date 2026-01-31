/**
 * Plant Names & Descriptions - French + Tunisian Darija
 * 
 * Format: scientific_name => { fr: French name, ar: Tunisian Darija name, desc_fr, desc_ar }
 */

export interface PlantTranslation {
  fr: string           // French common name
  ar: string           // Tunisian Darija name (تونسي)
  desc_fr: string      // French description
  desc_ar: string      // Arabic/Tunisian description
}

export const PLANT_TRANSLATIONS: Record<string, PlantTranslation> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PLANTES D'INTÉRIEUR - INDOOR PLANTS - نباتات داخلية
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Tropical Foliage
  "Monstera deliciosa": {
    fr: "Monstera",
    ar: "مونستيرا - الفيلودندرون المثقب",
    desc_fr: "La Monstera deliciosa, surnommée 'plante gruyère', est une plante tropicale spectaculaire avec ses grandes feuilles perforées. Facile d'entretien, elle apporte une touche exotique à votre intérieur.",
    desc_ar: "المونستيرا، معروفة بـ'نبتة الجبن السويسري'، نبتة استوائية رائعة بأوراقها الكبيرة المثقبة. سهلة العناية وتضيف لمسة استوائية لدارك."
  },
  "Ficus lyrata": {
    fr: "Figuier lyre",
    ar: "فيكوس ليراتا - تينة الكمنجة",
    desc_fr: "Le Figuier lyre est une plante majestueuse avec ses grandes feuilles en forme de violon. Parfait pour créer un point focal dans votre salon.",
    desc_ar: "فيكوس الكمنجة نبتة فخمة بأوراقها الكبيرة شكل الكمان. مثالية باش تكون نقطة جذب في الصالة."
  },
  "Philodendron hederaceum": {
    fr: "Philodendron grimpant",
    ar: "فيلودندرون متسلق",
    desc_fr: "Le Philodendron grimpant est une plante retombante élégante aux feuilles en forme de cœur. Idéale en suspension ou sur une étagère.",
    desc_ar: "الفيلودندرون المتسلق نبتة أنيقة متدلية بأوراق شكل قلب. مثالية للتعليق أو على رف."
  },
  "Epipremnum aureum": {
    fr: "Pothos doré",
    ar: "بوتوس ذهبي - لبلاب الشيطان",
    desc_fr: "Le Pothos est la plante parfaite pour les débutants. Ses feuilles panachées de vert et or sont magnifiques en suspension.",
    desc_ar: "البوتوس نبتة مثالية للمبتدئين. أوراقها الخضراء والذهبية رائعة في التعليق. سهلة برشا وما تحتاجش عناية كثيرة."
  },
  "Ficus elastica": {
    fr: "Caoutchouc",
    ar: "فيكوس المطاط - الكاوتشو",
    desc_fr: "Le Ficus elastica, appelé aussi arbre à caoutchouc, possède de grandes feuilles brillantes vert foncé. Une plante robuste et élégante.",
    desc_ar: "فيكوس المطاط، عندو أوراق كبيرة لامعة خضراء داكنة. نبتة قوية وأنيقة وسهلة العناية."
  },
  "Monstera adansonii": {
    fr: "Monstera Monkey Leaf",
    ar: "مونستيرا أدانسوني - ورقة القرد",
    desc_fr: "La Monstera adansonii a des feuilles délicatement perforées, plus petites que sa cousine. Parfaite pour les espaces plus réduits.",
    desc_ar: "مونستيرا أدانسوني عندها أوراق مثقبة رقيقة، أصغر من المونستيرا العادية. مناسبة للبلايص الصغيرة."
  },
  "Philodendron bipinnatifidum": {
    fr: "Philodendron Selloum",
    ar: "فيلودندرون سيلوم",
    desc_fr: "Le Philodendron Selloum est une plante imposante avec de grandes feuilles découpées. Elle transforme n'importe quelle pièce en jungle urbaine.",
    desc_ar: "فيلودندرون سيلوم نبتة كبيرة بأوراق مقطعة جميلة. تحول أي غرفة لغابة حضرية."
  },
  "Alocasia amazonica": {
    fr: "Alocasia Amazonica",
    ar: "ألوكاسيا أمازونيكا - ورق الفيل",
    desc_fr: "L'Alocasia Amazonica fascine avec ses feuilles sombres veinées d'argent. Une plante spectaculaire pour les collectionneurs.",
    desc_ar: "ألوكاسيا أمازونيكا مذهلة بأوراقها الداكنة بعروق فضية. نبتة رائعة للهواة."
  },
  "Calathea orbifolia": {
    fr: "Calathea Orbifolia",
    ar: "كالاثيا أوربيفوليا - نبات الطاووس",
    desc_fr: "La Calathea orbifolia charme avec ses grandes feuilles rondes rayées de vert et d'argent. Elle aime l'humidité et la lumière tamisée.",
    desc_ar: "كالاثيا أوربيفوليا ساحرة بأوراقها المستديرة الكبيرة مخططة بالأخضر والفضي. تحب الرطوبة والضوء الخفيف."
  },
  "Strelitzia nicolai": {
    fr: "Oiseau de Paradis Géant",
    ar: "ستريليتزيا - عصفور الجنة العملاق",
    desc_fr: "Le Strelitzia nicolai est une plante majestueuse pouvant atteindre 2m en intérieur. Ses grandes feuilles évoquent les tropiques.",
    desc_ar: "ستريليتزيا نبتة فخمة تقدر توصل 2 متر في الداخل. أوراقها الكبيرة تذكرك بالمناطق الاستوائية."
  },

  // Succulentes & Cactus
  "Aloe vera": {
    fr: "Aloès Vera",
    ar: "صبار - الألوفيرا",
    desc_fr: "L'Aloe vera est une plante médicinale aux multiples vertus. Son gel apaisant est idéal pour les soins de la peau. Facile à cultiver.",
    desc_ar: "الصبار نبتة طبية بفوائد كثيرة. الجل متاعو ممتاز للبشرة. سهل الزراعة وما يحتاجش ماء برشا."
  },
  "Echeveria elegans": {
    fr: "Echeveria",
    ar: "إيشيفيريا - الوردة المكسيكية",
    desc_fr: "L'Echeveria forme de magnifiques rosettes charnues. Ces succulentes décoratives demandent peu d'arrosage et beaucoup de lumière.",
    desc_ar: "الإيشيفيريا تشكل وردات لحمية جميلة. هالصبار ديكوراتيف يحتاج ماء قليل وضوء برشا."
  },
  "Crassula ovata": {
    fr: "Arbre de Jade",
    ar: "شجرة الحظ - كراسولا",
    desc_fr: "L'Arbre de Jade symbolise la prospérité. Cette succulente robuste peut vivre des décennies avec un minimum de soins.",
    desc_ar: "شجرة الحظ ترمز للرزق والبركة. هالصبار القوي يقدر يعيش عشرات السنين بعناية قليلة."
  },
  "Haworthia fasciata": {
    fr: "Haworthia Zébrée",
    ar: "هاورثيا - الصبار المخطط",
    desc_fr: "L'Haworthia fasciata est une petite succulente aux feuilles striées de blanc. Parfaite pour un bureau ou une fenêtre.",
    desc_ar: "هاورثيا صبار صغير بأوراق مخططة بالأبيض. مثالي للمكتب أو قرب الشباك."
  },
  "Senecio rowleyanus": {
    fr: "Collier de Perles",
    ar: "عقد اللؤلؤ - سينيسيو",
    desc_fr: "Le Collier de Perles est une succulente unique avec ses feuilles rondes en cascade. Magnifique en suspension.",
    desc_ar: "عقد اللؤلؤ صبار فريد بأوراقه المستديرة المتدلية كالسبحة. رائع في التعليق."
  },
  "Opuntia microdasys": {
    fr: "Cactus Oreilles de Lapin",
    ar: "صبار آذان الأرنب",
    desc_fr: "Ce cactus original ressemble à des oreilles de lapin. Attention à ses épines fines mais très présentes !",
    desc_ar: "هالصبار الأصلي يشبه آذان الأرنب. انتبه من الشوك الرقيق متاعو!"
  },
  "Gymnocalycium mihanovichii": {
    fr: "Cactus Lune",
    ar: "صبار القمر",
    desc_fr: "Le Cactus Lune est greffé et offre des couleurs vives : rouge, orange, rose ou jaune. Un cactus décoratif unique.",
    desc_ar: "صبار القمر مطعم ويقدم ألوان زاهية: أحمر، برتقالي، وردي أو أصفر. صبار ديكوراتيف فريد."
  },
  "Sedum morganianum": {
    fr: "Queue d'Âne",
    ar: "ذيل الحمار - سيدوم",
    desc_fr: "Le Sedum morganianum forme de longues tiges retombantes couvertes de feuilles charnues bleu-vert. Idéal en suspension.",
    desc_ar: "سيدوم يشكل سيقان طويلة متدلية مغطاة بأوراق لحمية زرقاء خضراء. مثالي في التعليق."
  },

  // Plantes Basse Lumière
  "Sansevieria trifasciata": {
    fr: "Langue de Belle-Mère",
    ar: "سنسيفيريا - لسان الحماة",
    desc_fr: "La Sansevieria est quasi indestructible. Elle purifie l'air et supporte l'ombre comme la négligence. La plante idéale pour débuter.",
    desc_ar: "السنسيفيريا تقريباً ما تموتش. تنقي الهواء وتتحمل الظل والإهمال. النبتة المثالية للمبتدئين."
  },
  "Zamioculcas zamiifolia": {
    fr: "Plante ZZ",
    ar: "زاميوكولكاس - نبتة ZZ",
    desc_fr: "Le Zamioculcas est parfait pour les coins sombres. Ses feuilles brillantes apportent de la verdure sans demander d'attention.",
    desc_ar: "الزاميوكولكاس مثالي للأركان المظلمة. أوراقها اللامعة تجيب الخضرة بدون ما تطلب عناية."
  },
  "Dracaena marginata": {
    fr: "Dragonnier de Madagascar",
    ar: "دراسينا مارجيناتا - شجرة التنين",
    desc_fr: "Le Dracaena marginata a un port élégant avec ses feuilles fines bordées de rouge. Peu exigeant et décoratif.",
    desc_ar: "دراسينا مارجيناتا عندها شكل أنيق بأوراقها الرفيعة بحواف حمراء. قليلة المتطلبات وديكوراتيفية."
  },
  "Dracaena fragrans": {
    fr: "Dragonnier Parfumé",
    ar: "دراسينا فراغرانس - الدراسينا العطرية",
    desc_fr: "Le Dracaena fragrans offre de larges feuilles rayées. Une plante robuste qui s'adapte à tous les intérieurs.",
    desc_ar: "دراسينا فراغرانس عندها أوراق عريضة مخططة. نبتة قوية تتأقلم مع كل الديكورات."
  },
  "Aspidistra elatior": {
    fr: "Plante de Fer",
    ar: "أسبيديسترا - نبتة الحديد",
    desc_fr: "L'Aspidistra est surnommée 'plante de fer' pour sa résistance légendaire. Elle survit même dans les conditions les plus difficiles.",
    desc_ar: "الأسبيديسترا مسماة 'نبتة الحديد' لقوتها الأسطورية. تنجو حتى في أصعب الظروف."
  },
  "Aglaonema commutatum": {
    fr: "Aglaonema",
    ar: "أغلونيما - الخضراء الصينية",
    desc_fr: "L'Aglaonema offre des feuilles panachées en vert, rose ou rouge. Une plante colorée pour égayer les espaces sombres.",
    desc_ar: "الأغلونيما عندها أوراق ملونة بالأخضر والوردي أو الأحمر. نبتة ملونة باش تفرح البلايص المظلمة."
  },
  "Spathiphyllum wallisii": {
    fr: "Fleur de Lune",
    ar: "زهرة القمر - سباثيفيلوم",
    desc_fr: "Le Spathiphyllum produit de élégantes fleurs blanches. Excellent purificateur d'air, il apprécie l'ombre et l'humidité.",
    desc_ar: "سباثيفيلوم يعطي زهور بيضاء أنيقة. ممتاز لتنقية الهواء، يحب الظل والرطوبة."
  },

  // Purificatrices d'Air
  "Chlorophytum comosum": {
    fr: "Plante Araignée",
    ar: "نبتة العنكبوت - كلوروفيتوم",
    desc_fr: "La Plante Araignée est championne de la purification d'air. Elle produit de nombreuses pousses et s'adapte partout.",
    desc_ar: "نبتة العنكبوت بطلة تنقية الهواء. تنتج براعم كثيرة وتتأقلم في كل مكان."
  },
  "Nephrolepis exaltata": {
    fr: "Fougère de Boston",
    ar: "سرخس بوسطن - الفرن",
    desc_fr: "La Fougère de Boston apporte une touche de forêt chez vous. Elle adore l'humidité et purifie excellemment l'air.",
    desc_ar: "سرخس بوسطن يجيب لمسة الغابة لدارك. يحب الرطوبة وينقي الهواء بامتياز."
  },
  "Hedera helix": {
    fr: "Lierre Commun",
    ar: "اللبلاب - الحبل",
    desc_fr: "Le Lierre est une plante grimpante ou retombante facile. Il purifie l'air et crée de belles cascades vertes.",
    desc_ar: "اللبلاب نبتة متسلقة أو متدلية سهلة. ينقي الهواء ويخلق شلالات خضراء جميلة."
  },
  "Ficus benjamina": {
    fr: "Ficus Benjamina",
    ar: "فيكوس بنجامينا - التين البكاء",
    desc_fr: "Le Ficus benjamina est un classique avec son port élégant. Il demande une place stable car il n'aime pas être déplacé.",
    desc_ar: "فيكوس بنجامينا كلاسيكي بشكله الأنيق. يحتاج مكان ثابت لأنه ما يحبش التنقل."
  },
  "Chamaedorea elegans": {
    fr: "Palmier Nain",
    ar: "نخلة الصالون - شاميدوريا",
    desc_fr: "Le Palmier Nain apporte une ambiance tropicale même dans les petits espaces. Il tolère bien l'ombre.",
    desc_ar: "نخلة الصالون تجيب جو استوائي حتى في البلايص الصغيرة. تتحمل الظل مليح."
  },
  "Areca lutescens": {
    fr: "Palmier Areca",
    ar: "نخلة الأريكا - النخلة الذهبية",
    desc_fr: "Le Palmier Areca est majestueux avec ses frondes dorées. Il humidifie et purifie naturellement l'air.",
    desc_ar: "نخلة الأريكا فخمة بسعفها الذهبي. ترطب وتنقي الهواء طبيعياً."
  },

  // Tendance & Rares
  "Pilea peperomioides": {
    fr: "Plante Monnaie Chinoise",
    ar: "بيليا - نبتة النقود الصينية",
    desc_fr: "La Pilea est devenue star des réseaux sociaux avec ses feuilles rondes comme des pièces. Elle produit beaucoup de rejets à partager.",
    desc_ar: "البيليا ولات نجمة السوشيال ميديا بأوراقها المستديرة كالقطع النقدية. تنتج براعم كثيرة للمشاركة."
  },
  "Begonia maculata": {
    fr: "Bégonia Maculata",
    ar: "بيغونيا مرقطة - بيغونيا النقاط",
    desc_fr: "Le Bégonia maculata charme avec ses feuilles tachetées de blanc et son dos rouge. Une plante d'exception.",
    desc_ar: "البيغونيا المرقطة ساحرة بأوراقها المنقطة بالأبيض وظهرها الأحمر. نبتة استثنائية."
  },
  "Tradescantia zebrina": {
    fr: "Misère Pourpre",
    ar: "تراديسكانتيا - الميزيريا",
    desc_fr: "La Tradescantia zebrina offre des feuilles rayées violet et argent. Croissance rapide et bouturage facile.",
    desc_ar: "تراديسكانتيا عندها أوراق مخططة بنفسجية وفضية. نمو سريع وتقطيع سهل."
  },
  "Maranta leuconeura": {
    fr: "Plante Prière",
    ar: "مارانتا - نبتة الصلاة",
    desc_fr: "La Maranta ferme ses feuilles le soir comme des mains en prière. Ses motifs graphiques sont hypnotisants.",
    desc_ar: "المارانتا تسكر أوراقها بالليل كأيدي في الصلاة. نقوشها الجرافيكية مذهلة."
  },
  "Hoya carnosa": {
    fr: "Fleur de Porcelaine",
    ar: "هويا - زهرة الشمع",
    desc_fr: "Le Hoya produit des fleurs en étoile parfumées qui ressemblent à de la porcelaine. Une plante grimpante fascinante.",
    desc_ar: "الهويا تعطي زهور نجمية معطرة تشبه البورسلان. نبتة متسلقة رائعة."
  },
  "Peperomia obtusifolia": {
    fr: "Peperomia",
    ar: "بيبروميا - نبتة الفلفل",
    desc_fr: "Le Peperomia est compact avec des feuilles charnues brillantes. Parfait pour les petits espaces et les bureaux.",
    desc_ar: "البيبروميا صغيرة بأوراق لحمية لامعة. مثالية للبلايص الصغيرة والمكاتب."
  },
  "Stromanthe sanguinea": {
    fr: "Stromanthe Tricolore",
    ar: "سترومانثي - النبتة الملونة",
    desc_fr: "Le Stromanthe impressionne avec ses feuilles vertes, roses et blanches. Le dessous est rouge vif.",
    desc_ar: "السترومانثي مبهرة بأوراقها الخضراء والوردية والبيضاء. الظهر أحمر زاهي."
  },
  "Anthurium andraeanum": {
    fr: "Anthurium",
    ar: "أنثوريوم - زهرة الفلامنغو",
    desc_fr: "L'Anthurium produit des fleurs rouges brillantes en forme de cœur toute l'année. Élégance tropicale garantie.",
    desc_ar: "الأنثوريوم يعطي زهور حمراء لامعة شكل قلب طول العام. أناقة استوائية مضمونة."
  },

  // Plantes Suspendues
  "Scindapsus pictus": {
    fr: "Scindapsus Argent",
    ar: "سيندابسوس - البوتوس الفضي",
    desc_fr: "Le Scindapsus pictus a des feuilles veloutées tachetées d'argent. Magnifique en suspension ou grimpant.",
    desc_ar: "سيندابسوس عندو أوراق مخملية منقطة بالفضي. رائع في التعليق أو التسلق."
  },
  "Philodendron micans": {
    fr: "Philodendron Velours",
    ar: "فيلودندرون ميكانس - الفيلودندرون المخملي",
    desc_fr: "Le Philodendron micans a des feuilles bronze veloutées qui brillent à la lumière. Un trésor pour les collectionneurs.",
    desc_ar: "فيلودندرون ميكانس عندو أوراق برونزية مخملية تلمع في الضوء. كنز للهواة."
  },
  "Ceropegia woodii": {
    fr: "Chaîne de Cœurs",
    ar: "سلسلة القلوب - سيروبيجيا",
    desc_fr: "La Chaîne de Cœurs forme de longues tiges délicates couvertes de petites feuilles en cœur. Romantique en suspension.",
    desc_ar: "سلسلة القلوب تشكل سيقان طويلة رقيقة مغطاة بأوراق صغيرة شكل قلب. رومانسية في التعليق."
  },
  "Rhipsalis baccifera": {
    fr: "Cactus Gui",
    ar: "ريبساليس - صبار الغي",
    desc_fr: "Le Rhipsalis est un cactus sans épines aux tiges fines retombantes. Original et facile d'entretien.",
    desc_ar: "الريبساليس صبار بلا شوك بسيقان رفيعة متدلية. أصلي وسهل العناية."
  },
  "Dischidia nummularia": {
    fr: "Plante Bouton",
    ar: "ديسكيديا - نبتة الأزرار",
    desc_fr: "La Dischidia a de petites feuilles rondes comme des boutons sur des tiges fines. Délicate et originale.",
    desc_ar: "الديسكيديا عندها أوراق صغيرة مستديرة كالأزرار على سيقان رفيعة. رقيقة وأصلية."
  },

  // Plantes Fleuries d'Intérieur
  "Phalaenopsis amabilis": {
    fr: "Orchidée Papillon",
    ar: "أوركيد الفراشة - زهرة السحلبية",
    desc_fr: "L'Orchidée Papillon est la plus facile des orchidées. Ses fleurs élégantes durent des mois.",
    desc_ar: "أوركيد الفراشة أسهل الأوركيدات. زهورها الأنيقة تدوم شهور."
  },
  "Saintpaulia ionantha": {
    fr: "Violette Africaine",
    ar: "البنفسج الأفريقي",
    desc_fr: "La Violette Africaine fleurit généreusement toute l'année. Compacte et colorée, elle égaie les rebords de fenêtre.",
    desc_ar: "البنفسج الأفريقي يزهر بكثرة طول العام. صغير وملون، يفرح حواف الشبابيك."
  },
  "Cyclamen persicum": {
    fr: "Cyclamen",
    ar: "بخور مريم - سيكلامن",
    desc_fr: "Le Cyclamen offre des fleurs élégantes en hiver quand tout est gris. Ses feuilles marbrées sont décoratives.",
    desc_ar: "السيكلامن يعطي زهور أنيقة في الشتاء وقت كل شي رمادي. أوراقه المرقشة ديكوراتيفية."
  },
  "Kalanchoe blossfeldiana": {
    fr: "Kalanchoé",
    ar: "كلانشوي - زهرة الحظ",
    desc_fr: "Le Kalanchoé fleurit longtemps en rouge, rose, orange ou jaune. Succulent et peu exigeant.",
    desc_ar: "الكلانشوي يزهر مدة طويلة بالأحمر والوردي والبرتقالي أو الأصفر. صبار وقليل المتطلبات."
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANTES D'EXTÉRIEUR - OUTDOOR PLANTS - نباتات خارجية
  // ═══════════════════════════════════════════════════════════════════════════

  // Arbres & Arbustes Méditerranéens
  "Olea europaea": {
    fr: "Olivier",
    ar: "شجرة الزيتون - الزيتونة",
    desc_fr: "L'Olivier est le symbole de la Méditerranée. Résistant à la sécheresse, il vit des siècles et produit des olives.",
    desc_ar: "الزيتونة رمز البحر الأبيض المتوسط. تتحمل الجفاف، تعيش قرون وتعطي الزيتون."
  },
  "Citrus limon": {
    fr: "Citronnier",
    ar: "شجرة الليمون - القارص",
    desc_fr: "Le Citronnier offre des fruits toute l'année et un parfum enivrant. Idéal en pot sur une terrasse ensoleillée.",
    desc_ar: "شجرة القارص تعطي غلة طول العام وريحة مسكرة. مثالية في أصيص على تراس مشمس."
  },
  "Citrus sinensis": {
    fr: "Oranger",
    ar: "شجرة البرتقال - الشينة",
    desc_fr: "L'Oranger embaume avec ses fleurs et ses fruits. Un classique des jardins méditerranéens.",
    desc_ar: "الشينة تعطر بزهورها وغلتها. كلاسيكية الجناين المتوسطية."
  },
  "Ficus carica": {
    fr: "Figuier",
    ar: "شجرة التين - الكرمة",
    desc_fr: "Le Figuier est généreux avec ses fruits sucrés. Ses grandes feuilles créent une ombre agréable.",
    desc_ar: "الكرمة كريمة بغلتها الحلوة. أوراقها الكبيرة تخلق ظل مريح."
  },
  "Punica granatum": {
    fr: "Grenadier",
    ar: "شجرة الرمان - الرمانة",
    desc_fr: "Le Grenadier produit de beaux fruits rouges et des fleurs écarlates. Symbole de fertilité.",
    desc_ar: "الرمانة تعطي غلة حمراء جميلة وزهور قرمزية. رمز الخصوبة."
  },
  "Nerium oleander": {
    fr: "Laurier Rose",
    ar: "الدفلة - الدفلى",
    desc_fr: "Le Laurier Rose fleurit abondamment tout l'été. Attention, toutes ses parties sont toxiques.",
    desc_ar: "الدفلة تزهر بكثرة طول الصيف. انتبه، كل أجزائها سامة."
  },
  "Bougainvillea spectabilis": {
    fr: "Bougainvillier",
    ar: "الجهنمية - المجنونة",
    desc_fr: "Le Bougainvillier explose de couleurs vives. Cette plante grimpante transforme murs et pergolas.",
    desc_ar: "الجهنمية تنفجر بألوان زاهية. هالنبتة المتسلقة تحول الحيطان والبرغولات."
  },
  "Jasminum officinale": {
    fr: "Jasmin Officinal",
    ar: "الياسمين - الفل",
    desc_fr: "Le Jasmin embaume les nuits d'été avec son parfum envoûtant. Une plante grimpante romantique.",
    desc_ar: "الياسمين يعطر ليالي الصيف بريحته الساحرة. نبتة متسلقة رومانسية."
  },
  "Hibiscus rosa-sinensis": {
    fr: "Hibiscus",
    ar: "الخطمية - الكركديه",
    desc_fr: "L'Hibiscus produit de grandes fleurs tropicales colorées. Il aime le soleil et la chaleur.",
    desc_ar: "الخطمية تعطي زهور استوائية كبيرة ملونة. تحب الشمس والحرارة."
  },
  "Plumbago auriculata": {
    fr: "Plumbago",
    ar: "الرصاصية - بلومباغو",
    desc_fr: "Le Plumbago offre des grappes de fleurs bleu ciel tout l'été. Parfait pour couvrir un mur.",
    desc_ar: "البلومباغو تعطي عناقيد زهور زرقاء سماوية طول الصيف. مثالية لتغطية حيط."
  },

  // Aromatiques & Herbes
  "Lavandula angustifolia": {
    fr: "Lavande",
    ar: "الخزامى - اللافندر",
    desc_fr: "La Lavande parfume le jardin de son odeur apaisante. Elle attire les abeilles et résiste à la sécheresse.",
    desc_ar: "الخزامى تعطر الجنينة بريحتها المهدئة. تجذب النحل وتتحمل الجفاف."
  },
  "Rosmarinus officinalis": {
    fr: "Romarin",
    ar: "إكليل الجبل - الأزير",
    desc_fr: "Le Romarin est aromatique et médicinal. Indispensable en cuisine méditerranéenne.",
    desc_ar: "الأزير عطري وطبي. ضروري في المطبخ التونسي والمتوسطي."
  },
  "Salvia officinalis": {
    fr: "Sauge Officinale",
    ar: "الميرمية - السالمية",
    desc_fr: "La Sauge est utilisée en cuisine et en tisane. Ses feuilles veloutées sont décoratives.",
    desc_ar: "السالمية تستعمل في الطبيخ والتيزانة. أوراقها المخملية ديكوراتيفية."
  },
  "Thymus vulgaris": {
    fr: "Thym",
    ar: "الزعتر",
    desc_fr: "Le Thym est essentiel en cuisine. Cette plante aromatique résiste à tout et parfume le jardin.",
    desc_ar: "الزعتر ضروري في الطبيخ. هالنبتة العطرية تتحمل كل شي وتعطر الجنينة."
  },
  "Origanum vulgare": {
    fr: "Origan",
    ar: "الزعتر البري - الأوريغانو",
    desc_fr: "L'Origan parfume pizzas et plats méditerranéens. Facile à cultiver et résistant.",
    desc_ar: "الأوريغانو يعطر البيتزا والأكلات المتوسطية. سهل الزراعة ومقاوم."
  },
  "Mentha spicata": {
    fr: "Menthe Verte",
    ar: "النعناع - الفليو",
    desc_fr: "La Menthe est indispensable pour le thé. Elle se propage rapidement, mieux vaut la cultiver en pot.",
    desc_ar: "النعناع ضروري للتاي. ينتشر بسرعة، الأفضل تزرعو في أصيص."
  },

  // Vivaces Fleuries
  "Pelargonium zonale": {
    fr: "Géranium",
    ar: "العطرشة - الجيرانيوم",
    desc_fr: "Le Géranium est le roi des balcons méditerranéens. Il fleurit sans relâche du printemps à l'automne.",
    desc_ar: "العطرشة ملك البلكونات المتوسطية. تزهر بلا توقف من الربيع للخريف."
  },
  "Lantana camara": {
    fr: "Lantana",
    ar: "اللانتانا - أم كلثوم",
    desc_fr: "Le Lantana offre des bouquets multicolores qui attirent les papillons. Très résistant à la chaleur.",
    desc_ar: "اللانتانا تعطي باقات متعددة الألوان تجذب الفراشات. مقاومة برشا للحرارة."
  },
  "Gazania rigens": {
    fr: "Gazania",
    ar: "غازانيا - زهرة الشمس",
    desc_fr: "Le Gazania ouvre ses fleurs colorées au soleil et les ferme le soir. Idéal pour les rocailles.",
    desc_ar: "الغازانيا تفتح زهورها الملونة للشمس وتسكرها بالليل. مثالية للروكاي."
  },
  "Agapanthus africanus": {
    fr: "Agapanthe",
    ar: "أغابانتوس - زنبق النيل",
    desc_fr: "L'Agapanthe produit de spectaculaires boules de fleurs bleues ou blanches en été.",
    desc_ar: "الأغابانتوس تعطي كرات زهور زرقاء أو بيضاء مذهلة في الصيف."
  },
  "Strelitzia reginae": {
    fr: "Oiseau de Paradis",
    ar: "عصفور الجنة - ستريليتزيا",
    desc_fr: "L'Oiseau de Paradis produit des fleurs extraordinaires ressemblant à des oiseaux exotiques.",
    desc_ar: "عصفور الجنة يعطي زهور استثنائية تشبه الطيور الغريبة."
  },
  "Plumeria rubra": {
    fr: "Frangipanier",
    ar: "الفرانجيباني - الياسمين الهندي",
    desc_fr: "Le Frangipanier embaume avec ses fleurs tropicales blanches et roses. Un parfum inoubliable.",
    desc_ar: "الفرانجيباني يعطر بزهوره الاستوائية البيضاء والوردية. ريحة ما تتنساش."
  },

  // Palmiers & Tropicaux
  "Phoenix dactylifera": {
    fr: "Palmier Dattier",
    ar: "نخلة التمر - النخلة",
    desc_fr: "Le Palmier Dattier est majestueux et produit des dattes délicieuses. Symbole des oasis.",
    desc_ar: "نخلة التمر فخمة وتعطي تمر لذيذ. رمز الواحات."
  },
  "Washingtonia robusta": {
    fr: "Palmier de Washington",
    ar: "نخلة واشنطونيا",
    desc_fr: "Le Washingtonia est un palmier élancé à croissance rapide. Parfait pour les grands jardins.",
    desc_ar: "الواشنطونيا نخلة طويلة سريعة النمو. مثالية للجناين الكبيرة."
  },
  "Cycas revoluta": {
    fr: "Cycas du Japon",
    ar: "سيكاس - نخيل الساغو",
    desc_fr: "Le Cycas ressemble à un palmier mais c'est une plante préhistorique. Croissance très lente.",
    desc_ar: "السيكاس يشبه النخلة لكنه نبتة ما قبل التاريخ. نمو بطيء برشا."
  },
  "Yucca elephantipes": {
    fr: "Yucca Géant",
    ar: "اليوكا - يوكا الفيل",
    desc_fr: "Le Yucca est résistant et sculptural. Il supporte la sécheresse et le plein soleil.",
    desc_ar: "اليوكا مقاومة ونحتية. تتحمل الجفاف والشمس الكاملة."
  },

  // Couvre-sols & Grimpantes
  "Aptenia cordifolia": {
    fr: "Aptenia",
    ar: "أبتينيا - القلب",
    desc_fr: "L'Aptenia forme un tapis succulent couvert de petites fleurs roses. Parfait couvre-sol.",
    desc_ar: "الأبتينيا تشكل سجادة صبارية مغطاة بزهور وردية صغيرة. كوفر سول مثالي."
  },
  "Carpobrotus edulis": {
    fr: "Griffe de Sorcière",
    ar: "كاربوبروتوس - صبار الشاطئ",
    desc_fr: "Le Carpobrotus a des feuilles charnues et des fleurs spectaculaires. Idéal pour stabiliser les sols.",
    desc_ar: "الكاربوبروتوس عندو أوراق لحمية وزهور مذهلة. مثالي لتثبيت التربة."
  },
  "Bougainvillea glabra": {
    fr: "Bougainvillier Lisse",
    ar: "الجهنمية الملساء",
    desc_fr: "Cette variété de Bougainvillier est plus compacte et facile à contrôler. Floraison abondante.",
    desc_ar: "هالنوع من الجهنمية أكثر تراصاً وسهل التحكم. إزهار وفير."
  },
  "Trachelospermum jasminoides": {
    fr: "Jasmin Étoilé",
    ar: "الياسمين النجمي - الفل المتسلق",
    desc_fr: "Le Jasmin étoilé parfume intensément avec ses fleurs blanches. Grimpant vigoureux.",
    desc_ar: "الياسمين النجمي يعطر بقوة بزهوره البيضاء. متسلق قوي."
  },
}

/**
 * Get translation for a plant by scientific name
 */
export function getPlantTranslation(scientificName: string): PlantTranslation | null {
  return PLANT_TRANSLATIONS[scientificName] || null
}

/**
 * Generate bilingual title: "French Name | Arabic Name"
 */
export function getBilingualTitle(scientificName: string, fallbackEnglish?: string): string {
  const translation = PLANT_TRANSLATIONS[scientificName]
  if (translation) {
    return `${translation.fr} | ${translation.ar}`
  }
  return fallbackEnglish || scientificName
}

/**
 * Generate bilingual description
 */
export function getBilingualDescription(scientificName: string, fallbackDescription?: string): string {
  const translation = PLANT_TRANSLATIONS[scientificName]
  if (translation) {
    return `${translation.desc_fr}\n\n---\n\n${translation.desc_ar}`
  }
  return fallbackDescription || ""
}
