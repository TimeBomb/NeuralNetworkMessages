const brain = require('brain.js');
const mimir = require('mimir');

// Huge shout out to Joe Minichino from https://medium.com/@tech_fort/classifying-text-with-neural-networks-and-mimir-in-javascript-94c9de20c0ac

const vectorResult = (res, numClasses) => {
    let i = 0;
    const vec = [];
    for (i; i < numClasses; i++) {
       vec.push(0);
    }
    vec[res] = 1;
    return vec;
}

const maxarg = (array) => {
    return array.indexOf(Math.max.apply(Math, array));
};

const categories = {
    SPANISH: 0,
    ENGLISH: 1,
    LOREMIPSUM: 2,
};

const trainingMessages = {
    SPANISH: [
        'Pienso que haya un error en la cuenta.',
        'Os gustáis salie en balandro.',
        'Tiene el pulgar hinchado.',
        '¿Le queda alguna habitación por la noche?',
        'Una abeja/una avispa me picó.',
        'Pagar las entradas.',
        'Él rompió la ventana.',
        'Estoy arrepentido pero estamos completos.',
        'Examinad la batería, por favor.',
        '¿Hay plazas libres?',
        '¿Tiene un sitio para una tienda?',
        'Seguid esta calle / carretera.',
        '¿Cúanto cuesta?',
        '¿Cuántos años tenéis?',
        '¿Podría preguntar a alguien a llevar mis maletas a mi habitación?',
    ],
    ENGLISH: [
        'May I sit next to you?',
        'She has had quite a lot to drink.',
        'You\'d better hurry up if you want to get home before dark.',
        'Hi Kim.',
        'You had better ask him in advance how much it will cost.',
        'It\'s already nine o\'clock.',
        'I must have lost it.',
        'I think it\'s time for me to contact her.',
        'He can come.',
        'I don\'t know what Mary is looking for.',
        'He turned around.',
        'We\'ve arrived.',
        'He left a large fortune to his son.',
        'She decided to marry him even though her parents didn\'t want her to.',
        'People don\'t say that anymore.',
        'I\'ll buy a watch for my son.',
        'I am no match for him.',
        'I\'m in the car driving home.',
        'Have you ever been mugged?',
        'He helped me move.',
        'It\'s next to that building.',
        'She\'s about the same height as you.',
        'He is a man of action.',
        'Slip on your shoes.',
        'I noticed that she was wearing new glasses.',
        'How do you say that in Italian?',
        'How long do you want it for?',
        'Yes, that\'s right. You have a good memory.',
        'I have a hunch that it will rain.',
        'I wish he had attended the meeting.',
    ],
    LOREMIPSUM: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        'Aenean sagittis sapien a volutpat viverra',
        'Etiam scelerisque massa eget nibh vehicula iaculis',
        'Vestibulum nec mi placerat, consectetur turpis ac, dictum quam',
        'Integer et turpis dictum, pharetra augue id, pharetra sapien',
        'Pellentesque facilisis diam a lacinia lacinia',
        'Sed in sem laoreet, ultricies velit sed, sagittis dui',
        'Sed sit amet ex et mauris tincidunt eleifend',
        'Nam auctor risus a ante imperdiet sagittis',
        'Proin facilisis dolor vel nunc scelerisque, non hendrerit nibh laoreet',
        'Cras ut ex sit amet odio consectetur ultrices vel placerat eros',
        'Ut cursus mauris a mauris congue finibus',
        'Aliquam in metus quis augue euismod vehicula nec a nibh',
        'Ut at tortor ac turpis placerat lacinia',
        'Mauris ullamcorper ex sit amet metus suscipit, ac dictum lorem pharetra',
        'Aliquam ultrices felis id posuere fermentum',
        'Mauris non nisl ac nisl ullamcorper egestas quis non nisi',
        'Suspendisse eleifend diam a fringilla egestas',
        'Quisque posuere magna at nunc aliquet, sed venenatis urna commodo',
        'Donec quis massa at enim feugiat imperdiet',
        'Proin pellentesque eros a tortor consectetur, eu tristique orci volutpat',
        'Sed pharetra lorem et tellus facilisis varius vitae vitae tellus',
        'Curabitur ut leo sit amet nunc lobortis facilisis nec quis sapien',
        'Morbi ac diam eget erat pellentesque bibendum',
        'Mauris sed sapien in augue vehicula imperdiet',
        'Nulla nec nibh feugiat urna consectetur cursus',
        'Morbi eu dui consectetur, sagittis nunc eu, dictum ex',
        'Vivamus rhoncus quam et egestas fermentum',
        'Vivamus sit amet nunc eu arcu porttitor euismod',
        'Nam non quam efficitur, tincidunt eros ut, tristique metus',
        'Donec porta arcu non lectus suscipit molestie',
        'Nullam eget nibh maximus, scelerisque neque non, dapibus ex',
    ]
};

const trainingTexts = mimir.dict(trainingMessages.SPANISH.concat(trainingMessages.ENGLISH.concat(trainingMessages.LOREMIPSUM)));

const trainingData = [];
trainingMessages.SPANISH.forEach((spanishMsg) => {
    trainingData.push([mimir.bow(spanishMsg, trainingTexts), categories.SPANISH]);
});
trainingMessages.ENGLISH.forEach((englishMsg) => {
    trainingData.push([mimir.bow(englishMsg, trainingTexts), categories.ENGLISH]);
});
trainingMessages.LOREMIPSUM.forEach((LOREMIPSUMMsg) => {
    trainingData.push([mimir.bow(LOREMIPSUMMsg, trainingTexts), categories.LOREMIPSUM]);
});

const neuralNetwork = new brain.NeuralNetwork();
neuralNetwork.train(trainingData.map((pair) => {
    return {
        input: pair[0],
        output: vectorResult(pair[1], Object.keys(categories).length),
    };
}));


const resultEnglish = maxarg(neuralNetwork.run(mimir.bow('Would you like to dance?', trainingTexts)));
console.log('Passing english msg, result is:', Object.keys(categories)[resultEnglish]); // ENGLISH

const resultSpanish = maxarg(neuralNetwork.run(mimir.bow('¿Dónde ésta la parada de autobús más cerca?', trainingTexts)));
console.log('Passing spanish msg:', Object.keys(categories)[resultSpanish]); // SPANISH

const randomLoremIpsum = maxarg(neuralNetwork.run(mimir.bow('Nam quis velit nec urna consectetur vestibulum in blandit purus.', trainingTexts)));
console.log('Passing lorem ipsum msg:', Object.keys(categories)[randomLoremIpsum]); // LOREMIPSUM